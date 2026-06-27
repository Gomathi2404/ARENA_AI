import { useEffect, useState } from "react";

const feedMessages = [
  { icon: "📧", color: "blue", text: <><b>Inbox scanned</b> — 12 emails read, 3 flagged as urgent</> },
  { icon: "✅", color: "green", text: <><b>Reply drafted</b> — responded to Prof. Ramesh re: deadline</> },
  { icon: "📅", color: "purple", text: <><b>Conflict resolved</b> — moved 2pm meeting to 4pm</> },
  { icon: "🔔", color: "amber", text: <><b>Reminder set</b> — project submission due tomorrow</> },
];

const cycleMessages = [
  { icon: "📧", color: "blue", text: <><b>New email</b> — from Team Lead, marked high priority</> },
  { icon: "✅", color: "green", text: <><b>Task done</b> — daily report sent to notes</> },
  { icon: "📅", color: "purple", text: <><b>Day planned</b> — 3 meetings, 2 focus blocks scheduled</> },
  { icon: "🔔", color: "amber", text: <><b>Nudge sent</b> — reminded about pending pull request</> },
];

const colorMap = {
  blue: { bg: "#0C447C", text: "#85B7EB", border: "#378ADD" },
  green: { bg: "#085041", text: "#5DCAA5", border: "#1D9E75" },
  purple: { bg: "#3C3489", text: "#AFA9EC", border: "#534AB7" },
  amber: { bg: "#633806", text: "#EF9F27", border: "#BA7517" },
};

function FeedItem({ item, visible }) {
  const c = colorMap[item.color];
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 18px",
      borderBottom: "0.5px solid #1e1e2e", opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: "all 0.4s ease",
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7, background: c.bg,
        border: `0.5px solid ${c.border}`, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
      }}>{item.icon}</div>
      <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.5 }}>{item.text}</div>
    </div>
  );
}

export default function Landing({ onEnter }) {
  const [visible, setVisible] = useState([false, false, false, false]);
  const [feed, setFeed] = useState(feedMessages);
  const [cycleIdx, setCycleIdx] = useState(0);

  useEffect(() => {
    feedMessages.forEach((_, i) => {
      setTimeout(() => {
        setVisible(v => { const n = [...v]; n[i] = true; return n; });
      }, i * 500 + 400);
    });
    const interval = setInterval(() => {
      setFeed(prev => {
        const msg = cycleMessages[cycleIdx % cycleMessages.length];
        setCycleIdx(c => c + 1);
        return [msg, ...prev.slice(0, 3)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: "#09090f", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", borderBottom: "0.5px solid #1e1e2e" }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
          AREN<span style={{ color: "#378ADD" }}>A</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Features", "How it works", "Demo"].map(l => (
            <span key={l} style={{ fontSize: 13, color: "#666", cursor: "pointer" }}>{l}</span>
          ))}
          <button onClick={onEnter} style={{
            background: "#378ADD", color: "#fff", border: "none",
            padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 500,
          }}>Sign in</button>
        </div>
      </nav>

      <div style={{ textAlign: "center", padding: "80px 32px 48px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#0f1629", border: "0.5px solid #378ADD",
          borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#85B7EB", marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, background: "#1D9E75", borderRadius: "50%", display: "inline-block" }}></span>
          AI Personal Assistant
        </div>

        <h1 style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, marginBottom: 20, letterSpacing: -2 }}>
          Your AI employee.<br />
          <span style={{ color: "#378ADD" }}>Always on the clock.</span>
        </h1>

        <p style={{ fontSize: 17, color: "#666", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
          ARENA manages your emails, calendar, and tasks proactively — like a real personal assistant who never sleeps.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 60 }}>
          <button onClick={onEnter} style={{
            background: "#378ADD", color: "#fff", border: "none",
            padding: "13px 30px", borderRadius: 10, fontSize: 15, cursor: "pointer", fontWeight: 500,
          }}>Meet ARENA</button>
          <button style={{
            background: "transparent", color: "#fff",
            border: "0.5px solid #333", padding: "13px 30px", borderRadius: 10, fontSize: 15, cursor: "pointer",
          }}>Watch demo</button>
        </div>

        <div style={{
          background: "#0d0d1a", border: "0.5px solid #1e1e2e",
          borderRadius: 14, maxWidth: 560, margin: "0 auto", overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 18px", borderBottom: "0.5px solid #1e1e2e",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", animation: "pulse 1.5s infinite" }}></div>
            <span style={{ fontSize: 13, color: "#888" }}><span style={{ color: "#fff", fontWeight: 500 }}>ARENA</span> is working right now</span>
          </div>
          {feed.map((item, i) => (
            <FeedItem key={i} item={item} visible={visible[i] !== undefined ? visible[i] : true} />
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "48px 40px", maxWidth: 800, margin: "0 auto" }}>
        {[
          { icon: "📧", title: "Email agent", desc: "Reads, prioritizes, and drafts replies in your tone. Zero inbox anxiety." },
          { icon: "📅", title: "Calendar handler", desc: "Detects conflicts, reschedules meetings, blocks your focus time." },
          { icon: "🧠", title: "Persistent memory", desc: "Remembers your preferences and habits. Gets smarter every day." },
          { icon: "✅", title: "Task tracking", desc: "Breaks goals into subtasks, follows up on overdue items automatically." },
          { icon: "⚡", title: "Proactive initiative", desc: "Doesn't wait. Spots problems and acts before you even notice them." },
          { icon: "💬", title: "Natural language", desc: '"Clear my Friday afternoon" — ARENA just does it. No forms, no clicks.' },
        ].map(f => (
          <div key={f.title} style={{
            background: "#0d0d1a", border: "0.5px solid #1e1e2e",
            borderRadius: 12, padding: "20px",
          }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", marginBottom: 6 }}>{f.title}</div>
            <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "24px", borderTop: "0.5px solid #1e1e2e", fontSize: 12, color: "#333" }}>
        ARENA — Adaptive Reasoning &amp; Execution Network Assistant
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
