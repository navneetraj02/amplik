import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CheckCircle2 } from "lucide-react";

interface MeetingSchedulerProps {
  open: boolean;
  onClose: () => void;
}

const AVAILABLE_DATES = (() => {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) dates.push(d);
  }
  return dates;
})();

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM",
];

export function MeetingScheduler({ open, onClose }: MeetingSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
   const [clientName, setClientName] = useState("");
   const [clientEmail, setClientEmail] = useState("");
   const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !clientEmail) return;

    setLoading(true);
    try {
      const dateString = selectedDate.toISOString().slice(0, 10);
      const url = import.meta.env.VITE_SCHEDULE_MEETING_URL;

      if (!url) {
        console.error("VITE_SCHEDULE_MEETING_URL is not set");
        setLoading(false);
        return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateString,
          time: selectedTime,
          clientName,
          clientEmail,
          summary: "",
        }),
      });

      if (!response.ok) {
        console.error("Failed to schedule meeting", await response.text());
        setLoading(false);
        return;
      }

      setConfirmed(true);
    } catch (e) {
      console.error("Error calling scheduleMeeting", e);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    setSelectedDate(null);
    setSelectedTime(null);
    onClose();
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card border border-border rounded-2xl card-shadow overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-semibold text-foreground">Schedule Consultation</h2>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {confirmed ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-8 text-center">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">Consultation Confirmed!</h3>
                <p className="text-muted-foreground text-sm mb-1">
                  {selectedDate && formatDate(selectedDate)} at {selectedTime}
                </p>
                <p className="text-muted-foreground text-sm">
                  The Amplik team will reach out with a meeting link.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-6 px-6 py-2.5 rounded-xl gradient-bg text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
                    <Calendar className="w-4 h-4 text-primary" /> Select a Date
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVAILABLE_DATES.slice(0, 10).map((d) => (
                      <button
                        key={d.toISOString()}
                        onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                        className={`px-2 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          selectedDate?.toDateString() === d.toDateString()
                            ? "gradient-bg text-primary-foreground glow-shadow"
                            : "bg-secondary text-secondary-foreground hover:bg-muted"
                        }`}
                      >
                        <div>{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div className="text-base mt-0.5">{d.getDate()}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Your name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full rounded-lg bg-secondary text-secondary-foreground px-3 py-2 text-sm outline-none border border-border focus:border-primary"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Your email</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full rounded-lg bg-secondary text-secondary-foreground px-3 py-2 text-sm outline-none border border-border focus:border-primary"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {selectedDate && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
                      <Clock className="w-4 h-4 text-primary" /> Select a Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`px-2 py-2 rounded-xl text-xs font-medium transition-all ${
                            selectedTime === slot
                              ? "gradient-bg text-primary-foreground glow-shadow"
                              : "bg-secondary text-secondary-foreground hover:bg-muted"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedTime || !clientEmail || loading}
                  className="w-full py-3 rounded-xl gradient-bg text-primary-foreground text-sm font-semibold disabled:opacity-30 hover:opacity-90 transition-opacity"
                >
                  {loading ? "Booking..." : "Confirm Consultation"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
