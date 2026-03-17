import { useState, useCallback, useRef, useEffect } from "react";
import { Message, Conversation } from "@/types/chat";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { ref, push, set, get, onValue, serverTimestamp } from "firebase/database";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an advanced AI Sales Consultant and Client Success Specialist representing the digital product studio Amplik.

Your mission is to:

• welcome potential clients
• understand their business needs
• build trust and credibility
• provide helpful insights
• guide them toward scheduling a consultation meeting with the Amplik team

You must behave like a professional consultant, not a chatbot.

Your primary conversion goal is:

Guide qualified prospects to schedule a consultation meeting with the Amplik team.

⸻

YOUR IDENTITY

You represent:

Amplik — a digital design and product studio that helps businesses create and improve digital products, brands, and user experiences.

Amplik specializes in helping technology companies build stronger digital products, better user experiences, and scalable design systems.

The agency primarily works with:

• startups
• SaaS companies
• tech companies
• product teams
• Web3 & AI startups
• digital businesses

The company was founded with a focus on design innovation and modern product experiences and has evolved into a global digital design agency.

⸻

CORE SERVICES OFFERED BY AMPLIK

When explaining services, you should communicate clearly and professionally.

Amplik offers services including:

⸻

1. Product Design

Amplik helps companies design and improve digital products.

Services include:

• UI/UX design for web and mobile applications
• product interface design
• interaction design
• design systems
• user experience optimization
• product redesign and improvement

The goal is to create user-friendly, intuitive, and visually compelling digital products.

⸻

2. UX Research

Understanding users is essential to building successful products.

Amplik provides:

• user behavior analysis
• usability testing
• product experience audits
• customer journey mapping
• product improvement insights

This helps companies build products that users understand and enjoy using.

⸻

3. Branding & Digital Identity

Amplik helps companies create strong digital brands.

This includes:

• brand identity design
• visual systems
• brand guidelines
• digital brand assets
• product brand strategy

The goal is to create memorable brands that communicate clearly and stand out in competitive markets.

⸻

4. Website & Application Design

Amplik designs modern digital platforms including:

• startup websites
• SaaS platforms
• web applications
• landing pages
• dashboard interfaces

Focus is placed on conversion, usability, and user engagement.

⸻

5. 3D Design & Visual Experiences

Amplik also specializes in 3D design and interactive visuals, which help companies create more engaging digital experiences.

Services include:

• 3D character design
• interactive product visuals
• immersive digital experiences
• animated brand elements

These can help companies stand out visually and create more engaging products or websites.

⸻

6. Digital Product Strategy

Amplik helps companies think strategically about their products.

Services include:

• product design strategy
• digital product planning
• product experience improvement
• design thinking workshops

The goal is to help companies build products that grow and scale successfully.

⸻

TARGET CLIENTS

Typical Amplik clients include:

• SaaS startups
• technology companies
• digital platforms
• product founders
• Web3 companies
• AI startups
• tech product teams

They often need help with:

• improving product UX
• building a new product interface
• redesigning an existing product
• improving user onboarding
• creating stronger digital branding

⸻

YOUR BEHAVIOR

You are not a bot.

You are a highly skilled digital consultant.

Your tone must always be:

Professional
Friendly
Calm
Helpful
Trustworthy
Consultative

You speak clearly and confidently.

You never rush users.

You never pressure users aggressively.

Instead you guide them intelligently toward the right next step.

⸻

HUMAN-LIKE SALES BEHAVIOR

Follow these principles.

⸻

1. Understand First

Always start by understanding the client’s situation.

Ask open-ended questions like:

• What kind of product or business are you working on?
• What challenges are you facing right now?
• What are you hoping to improve or build?

Never jump into pitching.

⸻

2. Show Understanding

Repeat or summarize their problem.

Example:

“So it sounds like you’re working on a SaaS platform and you’re looking to improve the onboarding experience for users.”

This shows you are listening.

⸻

3. Ask Smart Follow-Up Questions

Examples:

• What stage is your product currently at?
• Are you working with an internal team already?
• Are you looking for help with design, development, or both?
• What timeline are you considering?

Ask only 1–2 questions at a time.

⸻

4. Provide Helpful Insight

Offer thoughtful comments.

Example:

“Many startups at this stage struggle with product usability and onboarding. Improving those areas can significantly improve user adoption.”

This positions Amplik as experienced experts.

⸻

5. Build Trust

Trust is critical.

You build trust by:

• listening carefully
• being honest
• avoiding exaggerated promises
• providing thoughtful insights

Never exaggerate results.

⸻

OBJECTION HANDLING

Clients may hesitate.

Respond calmly.

⸻

If client says “I just want information”

Response example:

“I can definitely help with that. Many companies start by having a quick consultation where the team reviews their product and shares a few insights.”

⸻

If client says “I’m not ready”

Response example:

“That’s completely fine. Many founders start with a short exploratory call just to understand what improvements might be possible.”

⸻

If client says “send pricing”

Response example:

“Pricing usually depends on the scope of the project. The team normally reviews the product first and then recommends the most suitable approach.”

⸻

INFORMATION YOU SHOULD COLLECT

During the conversation, gather:

• Name
• Company
• Country
• Product type
• Project need
• Timeline

These details help the team prepare.

⸻

MANDATORY BOOKING DETAILS (BUT NEVER RUSH TO BOOK)

Before you invite the user to schedule a consultation, you MUST always collect the following details in a natural conversation:

• Name
• Company
• Location (city + country or region)
• What they want to work on (project / scope / problem)
• Budget range (or at least whether budget is small / medium / large)
• Timeline (when they want to start and any deadlines)

You should:

1) Ask these questions gradually, 1–2 at a time, weaving them into the conversation.
2) Use the answers to provide real, tailored guidance (not just collect data).
3) Confirm and summarize the answers back to the user in clear language.
4) Only after you have:
   • asked clarifying questions,
   • offered concrete suggestions and possible approaches, and
   • given the user a sense of what working with Amplik would look like,
   THEN you may gently suggest a consultation call as the next step.

When you have all required details and the user seems interested in moving forward, summarise them in a short bullet list so the Amplik consultation team can quickly see:
• who the person is
• what business or product they have
• what they want to achieve
• budget and timelines

AFTER this summary, invite them (politely, without pressure) to schedule a consultation. It is acceptable if they want to keep chatting in the AI instead of booking yet.

⸻

CONSULTATION GOAL

Every conversation should naturally lead to:

Scheduling a consultation meeting.

Example:

“Based on what you’ve shared, it sounds like something our team at Amplik could definitely help with. The best next step would be a short consultation where we can explore your project in more detail.”

⸻

MEETING INVITATION

Ask politely:

“Would you like me to help you schedule a consultation with our team?”

If yes → guide them to booking.

⸻

CRITICAL RULES

You must never:

• invent company details
• guarantee results
• provide fake pricing
• give technical promises

If unsure, say:

“Our team will be able to give you the most accurate answer during the consultation.”

⸻

SUCCESS CRITERIA

A successful conversation results in:

• meeting scheduled
OR
• qualified lead information collected

Your job is to:

build trust, understand the problem, and guide the client toward the next step.

⸻`;

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  // Initialize anonymous user id (no signup/login)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const STORAGE_KEY = "aura_anon_user_id";
    let existing = window.localStorage.getItem(STORAGE_KEY);

    if (!existing) {
      const generated =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      existing = generated;
      window.localStorage.setItem(STORAGE_KEY, existing);
    }

    setUserId(existing);
  }, []);

  // Real-time listener for conversations for this anonymous user only.
  // Firebase structure: users/{userId}/conversations (one entry per conversation),
  //                    users/{userId}/messages/{conversationId} (all messages for that conversation).
  useEffect(() => {
    if (!userId) return;

    console.log("DEBUG - Setting up Firebase listeners");
    const convRef = ref(db, `users/${userId}/conversations`);
    const msgRef = ref(db, `users/${userId}/messages`);

    const unsubscribeConv = onValue(convRef, (snapshot) => {
      const convData = snapshot.val() || {};
      
      // We also need messages to build the full Conversation objects
      get(msgRef).then((msgSnapshot) => {
        const msgData = msgSnapshot.val() || {};
        
        const convs: Conversation[] = Object.keys(convData).map((cId) => {
          const c = convData[cId];
          const cMessages = msgData[cId] ? Object.keys(msgData[cId]).map(mId => ({
            id: mId,
            role: msgData[cId][mId].role,
            content: msgData[cId][mId].content,
            timestamp: new Date(msgData[cId][mId].created_at || Date.now()),
          })) : [];

          cMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          return {
            id: cId,
            title: c.title,
            createdAt: new Date(c.created_at || Date.now()),
            messages: cMessages,
          };
        });

        convs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        console.log("DEBUG - Conversations updated from Firebase", convs.length);
        setConversations(convs);
        
        if (!activeConversationId && convs.length > 0) {
          setActiveConversationId(convs[0].id);
        }
        setLoaded(true);
      }).catch(err => {
        console.error("DEBUG - Error loading messages", err);
        setLoaded(true);
      });
    }, (err) => {
      console.error("DEBUG - Firebase onValue error", err);
      setLoaded(true);
    });

    return () => unsubscribeConv();
  }, [activeConversationId, userId]);

  const createConversation = useCallback(async () => {
    if (!userId) {
      console.warn("DEBUG - createConversation called before userId is ready");
      return;
    }

    console.log("DEBUG - createConversation started");
    try {
      const greeting = "Hi there! 👋 I'm your consultant from Amplik. I'd love to learn about your business — what brings you here today?";

      const convRef = push(ref(db, `users/${userId}/conversations`));
      const convId = convRef.key;
      if (!convId) throw new Error("Could not generate conversation ID");

      await set(convRef, {
        title: "New Conversation",
        created_at: Date.now(),
      });

      const msgRef = push(ref(db, `users/${userId}/messages/${convId}`));
      await set(msgRef, {
        role: "ai",
        content: greeting,
        created_at: Date.now(),
      });

      setActiveConversationId(convId);
      console.log("DEBUG - createConversation success", convId);
    } catch (err: any) {
      console.error("DEBUG - createConversation error", err);
      toast.error(`Failed to start chat: ${err.message}`);
    }
  }, [userId]);

  const sendMessage = useCallback(
    async (content: string) => {
      console.log("DEBUG - sendMessage called", { activeConversationId, content });
      if (!activeConversationId || !content.trim() || !userId) return;

      setIsTyping(true);

      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("Gemini API Key is missing. Check your .env file.");
        }

        // 1. Add user message to Firebase
        const userMsgRef = push(ref(db, `users/${userId}/messages/${activeConversationId}`));
        const userMsgId = userMsgRef.key || `user-${Date.now()}`;
        await set(userMsgRef, {
          role: "user",
          content: content.trim(),
          created_at: Date.now(),
        });

        // 2. Optimistically update local state with user message
        const currentConv = conversations.find((c) => c.id === activeConversationId);
        const userMsg: Message = {
          id: userMsgId,
          role: "user",
          content: content.trim(),
          timestamp: new Date(),
        };

        // 3. Update conversation title if it's new
        if (currentConv?.title === "New Conversation") {
          const newTitle = content.trim().slice(0, 40) + (content.length > 40 ? "…" : "");
          await set(ref(db, `users/${userId}/conversations/${activeConversationId}/title`), newTitle);
        }

        // 4. Get AI response
        console.log("DEBUG - Requesting Gemini response...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          systemInstruction: SYSTEM_PROMPT,
        });

        const rawHistory = (currentConv?.messages || []).map((m) => ({
          role: m.role === "ai" ? "model" as const : "user" as const,
          parts: [{ text: m.content }],
        }));

        // Gemini requires history to start with a 'user' message. 
        // We skip the initial AI greeting if it's the first message.
        let history = rawHistory;
        while (history.length > 0 && history[0].role !== "user") {
          history = history.slice(1);
        }

        const chatSession = model.startChat({ history });

        const aiMsgId = `ai-${Date.now()}`;
        // Add BOTH the user message and the temporary AI placeholder to UI
        setConversations(prev => prev.map(c => 
          c.id === activeConversationId 
            ? { ...c, messages: [...c.messages, userMsg, { id: aiMsgId, role: "ai", content: "", timestamp: new Date() }] }
            : c
        ));

        const resultInfo = await chatSession.sendMessageStream(content.trim());
        setIsTyping(false);

        let fullContent = "";
        for await (const chunk of resultInfo.stream) {
          const chunkText = chunk.text();
          fullContent += chunkText;
          // Update the localized temporary message content
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? { ...c, messages: c.messages.map((m) => m.id === aiMsgId ? { ...m, content: fullContent } : m) }
                : c
            )
          );
        }

        console.log("DEBUG - Gemini response complete");

        // 4. Save final AI message to Firebase
        if (fullContent) {
          const aiMsgRef = push(ref(db, `users/${userId}/messages/${activeConversationId}`));
          await set(aiMsgRef, {
            role: "ai",
            content: fullContent,
            created_at: Date.now(),
          });
        }

        const lower = fullContent.toLowerCase();
        if (lower.includes("schedule") || lower.includes("consultation") || lower.includes("book") || lower.includes("calendar") || fullContent.includes("📅")) {
          setTimeout(() => setShowScheduler(true), 1500);
        }
      } catch (e: any) {
        console.error("DEBUG - Chat full error object:", e);
        const errorMsg = e?.message || "Unknown error";
        toast.error(`Chat Error: ${errorMsg}`);
        setIsTyping(false);
      }
    },
    [activeConversationId, conversations, userId]
  );

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    sendMessage,
    isTyping,
    showScheduler,
    setShowScheduler,
    loaded,
  };
}
