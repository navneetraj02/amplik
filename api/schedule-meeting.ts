import { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "";
const TEAM_EMAIL = process.env.TEAM_EMAIL || "";

function buildDateTime(date: string, time: string, timeZone: string) {
  const dateTimeString = `${date} ${time}`;
  const d = new Date(`${dateTimeString} ${timeZone}`);
  return d.toISOString();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const { date, time, clientName, clientEmail, summary } = req.body || {};

    if (!date || !time || !clientEmail) {
      return res.status(400).json({ error: "Missing date, time, or clientEmail" });
    }

    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !CALENDAR_ID || !TEAM_EMAIL) {
      return res.status(500).json({ error: "Missing Google/Vercel env config" });
    }

    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const timeZone = "Asia/Kolkata";
    const startDateTime = buildDateTime(date, time, timeZone);
    const endDateTime = new Date(new Date(startDateTime).getTime() + 30 * 60 * 1000).toISOString();

    const eventSummary = `Amplik consultation – ${clientName || "New client"}`;

    const event = {
      summary: eventSummary,
      start: { dateTime: startDateTime, timeZone },
      end: { dateTime: endDateTime, timeZone },
      attendees: [
        { email: clientEmail },
        { email: TEAM_EMAIL },
      ],
      conferenceData: {
        createRequest: {
          requestId: `amplik-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      description: summary || "",
    };

    const calendarResponse = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const createdEvent = calendarResponse.data;

    let meetLink = "";
    if (createdEvent.conferenceData && createdEvent.conferenceData.entryPoints) {
      const meetEntry = createdEvent.conferenceData.entryPoints.find(
        (e) => e.entryPointType === "video",
      );
      if (meetEntry) meetLink = meetEntry.uri || "";
    }
    if (!meetLink && createdEvent.hangoutLink) {
      meetLink = createdEvent.hangoutLink;
    }

    const whenString = `${date} at ${time} (${timeZone})`;
    const fromEmail = TEAM_EMAIL;

    const subjectClient = "Your Amplik consultation is scheduled";
    const bodyClient =
      `Hi ${clientName || ""},\n\n` +
      `Your consultation with Amplik is scheduled for ${whenString}.\n\n` +
      (meetLink ? `Join the meeting here: ${meetLink}\n\n` : "") +
      `If you need to reschedule, just reply to this email.\n\n` +
      `Best,\nAmplik`;

    const subjectTeam = "New Amplik consultation booked";
    const bodyTeam =
      `New consultation booked.\n\n` +
      `Name: ${clientName || "Unknown"}\n` +
      `Email: ${clientEmail}\n` +
      `When: ${whenString}\n` +
      (summary ? `Summary: ${summary}\n` : "") +
      (meetLink ? `Meet link: ${meetLink}\n` : "") +
      `\n— Amplik bot`;

    function buildEmail(from: string, to: string, subject: string, body: string) {
      const message =
        `From: <${from}>\r\n` +
        `To: <${to}>\r\n` +
        `Subject: ${subject}\r\n` +
        `Content-Type: text/plain; charset="UTF-8"\r\n` +
        `\r\n` +
        body;
      return Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    }

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: buildEmail(fromEmail, clientEmail, subjectClient, bodyClient) },
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: buildEmail(fromEmail, TEAM_EMAIL, subjectTeam, bodyTeam) },
    });

    return res.status(200).json({
      success: true,
      meetLink,
      eventId: createdEvent.id,
    });
  } catch (err) {
    console.error("schedule-meeting error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
