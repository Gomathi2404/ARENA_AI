import { useEffect, useState } from "react";

const initFeed = [
  { color: "blue", icon: "📧", title: "Inbox scanned", desc: "14 emails processed", time: "just now" },
  { color: "green", icon: "✅", title: "Reply drafted", desc: "Prof. Ramesh email", time: "1 min ago" },
  { color: "purple", icon: "📅", title: "Focus block added", desc: "2pm to 4pm today", time: "3 min ago" },
  { color: "amber", icon: "🔔", title: "Reminder set", desc: "deadline tomorrow 11:59pm", time: "5 min ago" },
];

const autoFeed = [
  { color: "blue", icon: "📧", title: "Email checked", desc: "no new urgent items" },
  { color: "green", icon: "✅", title: "Task updated", desc: "progress logged" },
  { color: "purple", icon: "📅", title: "Schedule clear", desc: "tomorrow looks good" },
  { color: "amber", icon: "⚡", title: "Proactive check", desc: "all systems running" },
];

const colorMap = {
  blue: { bg: "#0C447C", text: "#85B7EB", border: "#378ADD" },
  green: { bg: "#085041", text: "#5DCAA5", border: "#1D9E75" },
  purple: { bg: "#3C3489", text: "#AFA9EC", border: "#534AB7" },
  amber: { bg: "#633806", text: "#EF9F27", border: "#BA7517" },
};

function FeedEntry({ item }) {
  const [show, setShow] = useState(false);
  const c = colorMap[item.color];
  useEffect(() => { setTimeout(() => setShow(true), 50); }, []);
  return (
    <div style={{
      display: "flex", gap: 10, padding: "10px 16px",
      borderBottom: "0.5px solid #111", alignItems: "flex-start",
      opacity: show ? 1 : 0, transform: show ? "translateX(0)" : "translateX(10px)",
      transition: "all 0.35s ease",
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 6, background: c.bg,
        border: `0.5px solid ${c.border}`, display: "flex",
        alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0,
      }}>{item.icon}</div>
      <div>
        <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5 }}>
          <b style={{ color: "#fff", fontWeight: 500 }}>{item.title}</b> — {item.desc}
        </div>
        <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{item.time || "just now"}</div>
      </div>
    </div>
  );
}

const navItems = [
  { icon: "🏠", label: "Dashboard", id: "dash" },
  { icon: "📧", label: "Inbox", id: "inbox" },
  { icon: "📅", label: "Calendar", id: "cal" },
  { icon: "✅", label: "Tasks", id: "tasks" },
];

const agentItems = [
  { icon: "⚙️", label: "Activity feed", id: "feed" },
  { icon: "💬", label: "Chat with ARENA", id: "chat" },
  { icon: "🧠", label: "Memory", id: "mem" },
];

export default function Dashboard({ onBack }) {
  const [active, setActive] = useState("dash");
  const [feed, setFeed] = useState(initFeed);
  const [autoIdx, setAutoIdx] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Submit Devfolio project form", done: true, due: "Done" },
    { id: 2, text: "Finish dashboard frontend", done: false, due: "Today" },
    { id: 3, text: "Integrate Claude API", done: false, due: "Today" },
    { id: 4, text: "Prepare demo script for judges", done: false, due: "Tomorrow" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const msg = { ...autoFeed[autoIdx % autoFeed.length], time: "just now" };
      setFeed(prev => [msg, ...prev.slice(0, 5)]);
      setAutoIdx(i => i + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoIdx]);

  function sendMsg() {
    if (!chatInput.trim()) return;
    const msg = { color: "green", icon: "✅", title: "ARENA on it", desc: `Processing: "${chatInput}"`, time: "just now" };
    setFeed(prev => [msg, ...prev.slice(0, 5)]);
    setChatInput("");
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh", background: "#09090f", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ background: "#0d0d1a", borderRight: "0.5px solid #1e1e2e", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 20px 20px", borderBottom: "0.5px solid #1e1e2e", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
          AREN<span style={{ color: "#378ADD" }}>A</span>
        </div>

        <div style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(item => (
            <div key={item.id} onClick={() => setActive(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, fontSize: 13,
              color: active === item.id ? "#378ADD" : "#666",
              background: active === item.id ? "#0f1629" : "transparent",
              cursor: "pointer", marginBottom: 2,
            }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}

          <div style={{ fontSize: 10, color: "#333", padding: "12px 12px 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Agent</div>

          {agentItems.map(item => (
            <div key={item.id} onClick={() => setActive(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, fontSize: 13,
              color: active === item.id ? "#378ADD" : "#666",
              background: active === item.id ? "#0f1629" : "transparent",
              cursor: "pointer", marginBottom: 2,
            }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}

          <div style={{ fontSize: 10, color: "#333", padding: "12px 12px 6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Settings</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, fontSize: 13, color: "#666", cursor: "pointer" }}>
            ⚙️ Preferences
          </div>
        </div>

        <div style={{ padding: "16px 20px", borderTop: "0.5px solid #1e1e2e", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "#0C447C",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 500, color: "#85B7EB",
          }}>MG</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Mohana</div>
            <div style={{ fontSize: 11, color: "#1D9E75" }}>ARENA active</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "0.5px solid #1e1e2e" }}>
          <div style={{ fontSize: 15, fontWeight: 500 }}>
            Good morning, Mohana <span style={{ color: "#555", fontWeight: 400 }}>— here's your day</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#0a1a0a", border: "0.5px solid #1D9E75",
              borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "#5DCAA5",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }}></span>
              ARENA is working
            </div>
            <button onClick={onBack} style={{
              background: "transparent", border: "0.5px solid #333",
              borderRadius: 8, padding: "6px 12px", color: "#666", cursor: "pointer", fontSize: 12,
            }}>← Back</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", flex: 1, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { label: "Emails handled", val: "14", sub: "3 need your attention", subColor: "#1D9E75" },
                { label: "Meetings today", val: "4", sub: "Next at 11:00 AM", subColor: "#378ADD" },
                { label: "Tasks pending", val: "7", sub: "2 due today", subColor: "#EF9F27" },
              ].map(s => (
                <div key={s.label} style={{ background: "#0d0d1a", border: "0.5px solid #1e1e2e", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, color: "#444", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: s.subColor, marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Inbox */}
            <div style={{ background: "#0d0d1a", border: "0.5px solid #1e1e2e", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: "0.5px solid #1e1e2e" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>📧 Inbox — ARENA sorted this</span>
                <span style={{ fontSize: 11, color: "#378ADD", cursor: "pointer" }}>View all</span>
              </div>
              {[
                { init: "PR", bg: "#0C447C", tc: "#85B7EB", name: "Prof. Ramesh", subject: "Re: Project submission deadline extended", time: "9:14 AM", urgent: true },
                { init: "CS", bg: "#085041", tc: "#5DCAA5", name: "CSI VIT Chennai", subject: "Tech Genesis '26 — judging schedule confirmed", time: "8:52 AM" },
                { init: "TM", bg: "#3C3489", tc: "#AFA9EC", name: "Team Mate", subject: "Pushed latest frontend changes to repo", time: "8:30 AM" },
              ].map(e => (
                <div key={e.name} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", borderBottom: "0.5px solid #111", cursor: "pointer" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: e.tc, flexShrink: 0 }}>{e.init}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                      {e.name}
                      {e.urgent && <span style={{ background: "#A32D2D", color: "#F7C1C1", fontSize: 10, padding: "2px 7px", borderRadius: 10, marginLeft: 6 }}>urgent</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#555", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.subject}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#444", whiteSpace: "nowrap" }}>{e.time}</div>
                </div>
              ))}
            </div>

            {/* Calendar */}
            <div style={{ background: "#0d0d1a", border: "0.5px solid #1e1e2e", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: "0.5px solid #1e1e2e" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>📅 Today's schedule</span>
                <span style={{ fontSize: 11, color: "#378ADD", cursor: "pointer" }}>View calendar</span>
              </div>
              {[
                { time: "10AM", title: "Team standup", meta: "Google Meet · 30 min", bar: "#378ADD" },
                { time: "11AM", title: "Project review with mentor", meta: "Zoom · 1 hour", bar: "#534AB7" },
                { time: "2PM", title: "Focus block — no meetings", meta: "Blocked by ARENA", bar: "#1D9E75" },
              ].map(ev => (
                <div key={ev.time} style={{ display: "flex", gap: 12, padding: "11px 16px", borderBottom: "0.5px solid #111", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "#378ADD", fontWeight: 500, minWidth: 34 }}>{ev.time}</div>
                  <div style={{ width: 3, minHeight: 34, borderRadius: 2, background: ev.bar, flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{ev.title}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{ev.meta}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tasks */}
            <div style={{ background: "#0d0d1a", border: "0.5px solid #1e1e2e", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", borderBottom: "0.5px solid #1e1e2e" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>✅ Tasks</span>
                <span style={{ fontSize: 11, color: "#378ADD", cursor: "pointer" }}>Add task</span>
              </div>
              {tasks.map(t => (
                <div key={t.id} onClick={() => toggleTask(t.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "0.5px solid #111", cursor: "pointer" }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4, border: t.done ? "none" : "0.5px solid #333",
                    background: t.done ? "#085041" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#1D9E75", flexShrink: 0,
                  }}>{t.done ? "✓" : ""}</div>
                  <div style={{ flex: 1, fontSize: 12, color: t.done ? "#444" : "#ccc", textDecoration: t.done ? "line-through" : "none" }}>{t.text}</div>
                  <div style={{ fontSize: 11, color: t.done ? "#333" : "#EF9F27" }}>{t.due}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel */}
          <div style={{ borderLeft: "0.5px solid #1e1e2e", display: "flex", flexDirection: "column", gap: 0, overflow: "hidden" }}>
            {/* Live feed */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: "0.5px solid #1e1e2e", background: "#0a0a14" }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>⚙️ Live agent feed</span>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75", display: "inline-block", animation: "pulse 1.5s infinite" }}></span>
              </div>
              <div style={{ overflowY: "auto", flex: 1 }}>
                {feed.map((item, i) => <FeedEntry key={`${item.title}-${i}`} item={item} />)}
              </div>
            </div>

            {/* Chat */}
            <div style={{ borderTop: "0.5px solid #1e1e2e" }}>
              <div style={{ padding: "13px 16px", borderBottom: "0.5px solid #1e1e2e" }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>💬 Ask ARENA</div>
                <div style={{ fontSize: 11, color: "#444" }}>Try: "What's urgent today?" or "Clear my Friday"</div>
              </div>
              <div style={{ display: "flex", gap: 8, padding: "12px 16px" }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMsg()}
                  placeholder="Tell ARENA what to do..."
                  style={{
                    flex: 1, background: "#111", border: "0.5px solid #222",
                    borderRadius: 8, padding: "8px 12px", fontSize: 12,
                    color: "#fff", outline: "none",
                  }}
                />
                <button onClick={sendMsg} style={{
                  background: "#378ADD", border: "none", borderRadius: 8,
                  padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: 14,
                }}>→</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}