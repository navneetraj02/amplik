import { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import Groq from "groq-sdk";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "";
const TEAM_EMAIL = process.env.TEAM_EMAIL || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

const groq = new Groq({ apiKey: GROQ_API_KEY });

function buildDateTime(datePath: string, timePath: string, _timeZone: string) {
  // datePath is YYYY-MM-DD (from toISOString().slice(0,10))
  // timePath is "9:00 AM" or "2:30 PM"
  const [timeStr, ampm] = timePath.split(" ");
  let [hours, minutes] = timeStr.split(":").map(Number);

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  
  // Asia/Kolkata is fixed at +05:30
  const isoString = `${datePath}T${paddedHours}:${paddedMinutes}:00+05:30`;
  const d = new Date(isoString);
  
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid Date created from ${isoString}`);
  }
  
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

    // Generate AI Summary of the chat
    let aiSummary = "No chat history available";
    if (summary && GROQ_API_KEY) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a professional business assistant. Summarize the following chat transcript into a concise 'Client Brief'. Include the client's goals, any mentioned budget/pricing, and the project timeline. Keep it structured with bullet points. Be professional and brief."
            },
            {
              role: "user",
              content: `Summarize this chat for the team:\n\n${summary}`
            }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.5,
        });
        aiSummary = completion.choices[0]?.message?.content || "Could not generate summary.";
      } catch (err) {
        console.error("Summarization error:", err);
        aiSummary = "Error generating AI summary. Please refer to full transcript.";
      }
    }

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
      description: `Consultation Brief:\n${aiSummary}\n\nClient Email: ${clientEmail}`,
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
      `When: ${whenString}\n\n` +
      `--- Consultation Brief (AI Summary) ---\n` +
      `${aiSummary}\n\n` +
      `----------------------------------------\n` +
      `Full Chat Transcript:\n` +
      `${summary || "No chat history available"}\n\n` +
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
