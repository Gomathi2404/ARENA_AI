import { useEffect, useRef, useState } from "react";

function Sidebar({ active, setActive, onBack }) {
  const itemStyle = (key) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 13,
    color: active === key ? "#378ADD" : "#777",
    background: active === key ? "#0f1629" : "transparent",
    cursor: "pointer",
    marginBottom: 6,
  });

  return (
    <div style={{ width: 220, background: "#0d0d1a", borderRight: "0.5px solid #1e1e2e", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ padding: 20, borderBottom: "0.5px solid #1e1e2e", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
        AREN<span style={{ color: "#378ADD" }}>A</span>
      </div>
      <div style={{ padding: 12, flex: 1 }}>
        <div onClick={() => setActive("dashboard")} style={itemStyle("dashboard")}>Dashboard</div>
        <div onClick={() => setActive("chat")} style={itemStyle("chat")}>Chat</div>
      </div>
      <div style={{ padding: "16px 20px", borderTop: "0.5px solid #1e1e2e" }}>
        <button onClick={onBack} style={{ width: "100%", background: "transparent", border: "0.5px solid #333", borderRadius: 10, padding: "8px 12px", color: "#666", cursor: "pointer", fontSize: 12 }}>
          ← Back
        </button>
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "70%",
          padding: "10px 14px",
          borderRadius: 12,
          fontSize: 13,
          lineHeight: 1.6,
          background: isUser ? "#378ADD" : "#0b0b14",
          color: isUser ? "#fff" : "#ccc",
          border: isUser ? "none" : "0.5px solid #1e1e2e",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {message.text}
      </div>
    </div>
  );
}

function ChatCard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const nextMessages = [...messages, { role: "user", text: userMsg }];

    setInput("");
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: nextMessages.map((message) => ({ role: message.role, content: message.text })),
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Sorry, something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "I'm unable to reach the backend server on port 8000." }]);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        width: "min(920px, 100%)",
        height: "min(760px, calc(100vh - 56px))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "0.5px solid #1e1e2e",
        borderRadius: 18,
        background: "rgba(13, 13, 26, 0.96)",
        boxShadow: "0 28px 80px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div style={{ padding: "18px 24px", borderBottom: "0.5px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Chat with ARENA</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Centered chat view with no placeholder tabs or seeded dashboard data.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#5DCAA5", fontSize: 12, background: "#0a1a0a", border: "0.5px solid #1D9E75", borderRadius: 999, padding: "6px 12px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }}></span>
          Ready
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#444", textAlign: "center", fontSize: 14, lineHeight: 1.7 }}>
            Start a chat with ARENA. Ask for a summary, a reply, or help with your day.
          </div>
        ) : (
          messages.map((message, index) => <ChatMessage key={index} message={message} />)
        )}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: 12, fontSize: 13, background: "#0b0b14", border: "0.5px solid #1e1e2e", color: "#555" }}>ARENA is thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: 10, padding: "18px 24px", borderTop: "0.5px solid #1e1e2e", background: "rgba(9, 9, 15, 0.72)" }}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && send()}
          placeholder="Ask ARENA anything..."
          style={{ flex: 1, background: "#111", border: "0.5px solid #222", borderRadius: 12, padding: "12px 14px", fontSize: 13, color: "#fff", outline: "none" }}
        />
        <button onClick={send} disabled={loading} style={{ background: loading ? "#1a2a3a" : "#378ADD", border: "none", borderRadius: 12, padding: "12px 18px", color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontSize: 14 }}>
          →
        </button>
      </div>
    </div>
  );
}

function DashboardCard() {
  const cards = [
    { title: "Assistant status", value: "Ready", detail: "ARENA is online and waiting for your next request." },
    { title: "Current view", value: "Dashboard", detail: "Use the sidebar to switch to the centered chat." },
    { title: "Layout", value: "Minimal", detail: "Only Dashboard and Chat are exposed in the sidebar." },
  ];

  return (
    <div style={{ width: "min(920px, 100%)", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 26, fontWeight: 700 }}>Dashboard</div>
      <div style={{ fontSize: 13, color: "#666" }}>This view stays simple so the only sidebar actions are Dashboard and Chat.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {cards.map((card) => (
          <div key={card.title} style={{ background: "rgba(13, 13, 26, 0.96)", border: "0.5px solid #1e1e2e", borderRadius: 16, padding: 18, minHeight: 140 }}>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>{card.title}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{card.value}</div>
            <div style={{ fontSize: 13, color: "#bbb", lineHeight: 1.6 }}>{card.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard({ onBack }) {
  const [active, setActive] = useState("dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(55, 138, 221, 0.12), transparent 35%), #09090f", color: "#fff", fontFamily: "system-ui, sans-serif", display: "grid", gridTemplateColumns: "220px 1fr" }}>
      <Sidebar active={active} setActive={setActive} onBack={onBack} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflow: "hidden" }}>
        {active === "chat" ? <ChatCard /> : <DashboardCard />}
      </div>
      <style>{`input::placeholder{color:#444}`}</style>
    </div>
  );
}
