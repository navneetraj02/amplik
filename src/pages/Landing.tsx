import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 0.61, 0.36, 1],
    },
  }),
};

const Landing = () => {
  const navigate = useNavigate();

  const handleStartConversation = useCallback(() => {
    navigate("/chat");
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ai-grid-mask" />
        <div className="ai-gradient-orb ai-gradient-orb--primary" />
        <div className="ai-gradient-orb ai-gradient-orb--secondary" />
        <div className="ai-orbit ai-orbit--lg">
          <span className="ai-node" />
          <span className="ai-node" />
          <span className="ai-node" />
        </div>
        <div className="ai-orbit ai-orbit--sm">
          <span className="ai-node" />
          <span className="ai-node" />
        </div>
        <div className="ai-scanline" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar / logo */}
        <header className="flex items-center justify-between px-6 py-4 sm:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/80 via-sky-500/80 to-violet-500/80 shadow-[0_0_24px_rgba(56,189,248,0.65)]">
              <Sparkles className="h-4 w-4 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                Amplik Consultant
              </span>
              <span className="text-xs text-muted-foreground">AI-native consultation platform</span>
            </div>
          </div>
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
            <span>AI consultant is online</span>
          </div>
        </header>

        {/* Hero */}
        <main className="flex flex-1 flex-col">
          <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 pt-6 sm:px-10 sm:pt-12 lg:flex-row lg:items-center lg:gap-12">
            {/* Left column */}
            <div className="flex flex-1 flex-col gap-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={0}
                className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 shadow-[0_0_24px_rgba(16,185,129,0.35)] backdrop-blur"
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                <span>Start a conversation — no signup</span>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={0.1}
                className="space-y-5"
              >
                <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-muted-foreground">AI-Native</span>
                  <span className="gradient-text block">
                    Business Consultation
                  </span>
                </h1>
                <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                  Talk with our AI consultant to explore solutions for your product, platform, or digital business.
                  Get clarity on where to focus before you speak with human experts.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={0.2}
                className="flex flex-col gap-4 sm:flex-row sm:items-center"
              >
                <Button
                  size="lg"
                  className="group relative h-12 gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 px-6 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.55)] transition-[filter,transform] hover:scale-[1.02] hover:brightness-110"
                  onClick={handleStartConversation}
                >
                  <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.55),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
                  <MessageCircle className="h-4 w-4" />
                  <span>Start Conversation</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <div className="flex flex-col text-xs text-muted-foreground">
                  <span>Start instantly. No signup required.</span>
                  <span>Directly in the browser. No friction.</span>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={0.3}
                className="grid gap-4 text-xs text-muted-foreground sm:grid-cols-3"
              >
                <div className="rounded-xl border border-emerald-500/10 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent px-4 py-3 backdrop-blur">
                  <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
                    For builders
                  </div>
                  <div className="text-[13px] text-foreground">
                    Founders, product teams, and digital businesses.
                  </div>
                </div>
                <div className="rounded-xl border border-cyan-500/10 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent px-4 py-3 backdrop-blur">
                  <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-cyan-300/80">
                    AI-first
                  </div>
                  <div className="text-[13px] text-foreground">
                    The AI consultant is your primary interface.
                  </div>
                </div>
                <div className="rounded-xl border border-violet-500/10 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent px-4 py-3 backdrop-blur">
                  <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-violet-300/80">
                    Human-ready
                  </div>
                  <div className="text-[13px] text-foreground">
                    Transition to expert consultation when you&apos;re ready.
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column: AI preview panel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
              className="mt-10 flex flex-1 items-center justify-center lg:mt-0"
            >
              <Card className="relative w-full max-w-md border border-slate-700/70 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-950/98 shadow-[0_24px_80px_rgba(0,0,0,0.9)]">
                <div className="pointer-events-none absolute -right-20 top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 -bottom-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
                <CardContent className="relative space-y-4 p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                        <Sparkles className="h-4 w-4 text-cyan-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">Amplik AI Consultant</span>
                        <span className="text-[11px] text-emerald-300/80">Online · responding in real-time</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                      <span>Live</span>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/80 p-3 text-[11px] text-foreground">
                    <div className="rounded-md bg-slate-800/80 p-2">
                      <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        You
                      </div>
                      <p className="text-[11px] text-slate-50">
                        We&apos;re building a new AI feature for our SaaS platform. Where should we start?
                      </p>
                    </div>
                    <div className="rounded-md bg-emerald-500/5 p-2">
                      <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                        AI Consultant
                      </div>
                      <p className="text-[11px] text-emerald-50/90">
                        Let&apos;s map your goals, constraints, and user flows. I&apos;ll ask a few questions, propose options,
                        and then connect you with the right experts for implementation.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 pt-1 text-[10px] text-slate-400">
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span className="pl-1">Thinking about next best question…</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-900/80 px-3 py-2">
                    <div className="flex flex-col text-[10px] text-slate-400">
                      <span>Ready to explore solutions tailored to your business?</span>
                      <span className="text-emerald-300/90">Start a live conversation in one click.</span>
                    </div>
                    <Button
                      size="sm"
                      className="h-8 rounded-full bg-slate-100 text-slate-900 hover:bg-white"
                      onClick={handleStartConversation}
                    >
                      Open chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          {/* How it works */}
          <section className="border-t border-slate-800/80 bg-gradient-to-b from-slate-950/40 via-slate-950/80 to-slate-950/95">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 sm:px-10 lg:flex-row lg:items-start lg:justify-between">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                custom={0}
                className="max-w-sm"
              >
                <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  How it works
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  A lightweight flow designed so you can start in seconds and get to clarity quickly.
                </p>
              </motion.div>

              <div className="grid flex-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    step: "Step 1",
                    title: "Talk with the AI consultant",
                    body: "Describe your business, product, or idea in natural language. The AI consultant adapts to your context.",
                  },
                  {
                    step: "Step 2",
                    title: "Share your challenges",
                    body: "Surface constraints, goals, and unknowns. The assistant will ask targeted questions to deepen understanding.",
                  },
                  {
                    step: "Step 3",
                    title: "Schedule expert time",
                    body: "When you’re ready, move from AI guidance into a focused session with human experts.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    variants={fadeInUp}
                    custom={0.1 * (index + 1)}
                  >
                    <Card className="group h-full border-slate-800/80 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950/95 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_18px_60px_rgba(8,47,73,0.9)]">
                      <CardContent className="flex h-full flex-col gap-3 p-5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="rounded-full border border-slate-800/80 px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase">
                            {item.step}
                          </span>
                          <span className="h-1 w-10 rounded-full bg-gradient-to-r from-cyan-400/70 via-emerald-400/70 to-violet-400/70 opacity-60 transition-opacity group-hover:opacity-100" />
                        </div>
                        <h3 className="text-sm font-medium text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {item.body}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Consultant section */}
          <section className="border-t border-slate-800/80 bg-slate-950/95">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10 lg:flex-row lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                custom={0}
                className="flex-1 space-y-4"
              >
                <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  Meet Your AI Consultant
                </h2>
                <p className="max-w-xl text-sm text-muted-foreground">
                  Our AI assistant helps you explore solutions for your business or product by understanding your
                  needs and guiding you toward the right expertise.
                </p>
                <p className="max-w-xl text-sm text-muted-foreground">
                  It keeps the experience focused, conversational, and tailored to how modern product teams actually
                  work.
                </p>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4">
                    <h3 className="mb-1 text-xs font-semibold tracking-[0.16em] text-slate-300 uppercase">
                      It can
                    </h3>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li>• understand your project needs</li>
                      <li>• ask intelligent questions</li>
                      <li>• suggest possible solutions</li>
                      <li>• guide you toward scheduling a consultation</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent p-4">
                    <h3 className="mb-1 text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
                      Designed for action
                    </h3>
                    <p className="text-xs text-emerald-50/90">
                      Instead of reading long case studies, you simply start a conversation. The assistant keeps
                      momentum, surfaces trade-offs, and prepares you for a high-signal expert session.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeInUp}
                custom={0.1}
                className="flex-1"
              >
                <Card className="border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950">
                  <CardContent className="space-y-4 p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/80 via-sky-500/80 to-violet-500/80">
                          <Sparkles className="h-4 w-4 text-slate-950" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-foreground">Conversation-first workflow</span>
                          <span className="text-[11px] text-slate-400">No decks. No forms. Just a live AI.</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3 text-xs text-muted-foreground">
                      <p>
                        Instead of forcing you into a funnel, the AI consultant gives you a sandbox to think, explore,
                        and refine what you actually need.
                      </p>
                      <p>
                        It helps you distinguish between experiments, v1 launches, and mature product improvements —
                        then points you to the right level of expertise.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Trust section */}
          <section className="border-t border-slate-800/80 bg-slate-950">
            <div className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                custom={0}
                className="max-w-3xl space-y-4"
              >
                <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  Designed for modern product teams and businesses
                </h2>
                <p className="text-sm text-muted-foreground">
                  This platform helps founders, product teams, and digital businesses quickly explore solutions for
                  improving their products, platforms, and digital experiences.
                </p>
                <p className="text-sm text-muted-foreground">
                  The AI consultant helps identify the right approach before connecting you with the appropriate
                  experts. You get a clear problem statement, aligned expectations, and a sharper brief — without
                  meetings or back-and-forth emails.
                </p>
              </motion.div>
            </div>
          </section>

          {/* CTA section */}
          <section className="border-t border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-950 to-black">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                custom={0}
                className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-r from-cyan-500/15 via-violet-500/10 to-sky-500/15 p-[1px]"
              >
                <div className="relative flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-950/90 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
                  <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
                  <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
                  <div className="relative space-y-3">
                    <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      Start Your Consultation
                    </h2>
                    <p className="max-w-xl text-sm text-muted-foreground">
                      Talk with the AI consultant and explore solutions tailored to your business. No forms, no sales
                      calls — just a focused conversation built for modern teams.
                    </p>
                  </div>
                  <div className="relative flex flex-col gap-2 sm:items-end">
                    <Button
                      size="lg"
                      className="group h-11 gap-2 rounded-full bg-slate-50 px-6 text-sm font-semibold text-slate-900 shadow-[0_18px_50px_rgba(148,163,184,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-white"
                      onClick={handleStartConversation}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Start Conversation</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                    <span className="text-[11px] text-slate-400">
                      Start instantly. No signup required.
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Landing;

