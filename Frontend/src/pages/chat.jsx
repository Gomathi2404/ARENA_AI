import { useState, useEffect, useRef } from "react";

const SUGGESTIONS = [
  "What's urgent today?",
  "Summarize my inbox",
  "Clear my Friday afternoon",
  "What meetings do I have tomorrow?",
  "Draft a reply to Prof. Ramesh",
  "What tasks are due today?",
];

function TypingDots() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 16px" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:7, height:7, borderRadius:"50%", background:"#378ADD",
          animation:`bounce 1.2s infinite`,
          animationDelay:`${i*0.2}s`,
        }}/>
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display:"flex", flexDirection: isUser ? "row-reverse" : "row",
      alignItems:"flex-end", gap:10, marginBottom:20,
    }}>
      {/* Avatar */}
      {!isUser && (
        <div style={{
          width:36, height:36, borderRadius:"50%", flexShrink:0,
          background:"linear-gradient(135deg, #185FA5, #534AB7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, fontWeight:700, color:"#fff", letterSpacing:0.5,
          boxShadow:"0 0 12px #378ADD44",
        }}>A</div>
      )}
      {isUser && (
        <div style={{
          width:36, height:36, borderRadius:"50%", flexShrink:0,
          background:"#1e1e2e", border:"0.5px solid #333",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12, fontWeight:600, color:"#888",
        }}>MG</div>
      )}

      {/* Bubble */}
      <div style={{ maxWidth:"65%", display:"flex", flexDirection:"column", alignItems: isUser ? "flex-end" : "flex-start" }}>
        {!isUser && (
          <div style={{ fontSize:11, color:"#378ADD", fontWeight:500, marginBottom:4, letterSpacing:0.5 }}>ARENA</div>
        )}
        <div style={{
          padding:"12px 16px", borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: isUser ? "#378ADD" : "#0d0d1a",
          border: isUser ? "none" : "0.5px solid #1e1e2e",
          fontSize:14, color: isUser ? "#fff" : "#ddd", lineHeight:1.7,
          boxShadow: isUser ? "0 4px 12px #378ADD33" : "none",
        }}>
          {msg.text}
        </div>
        <div style={{ fontSize:10, color:"#333", marginTop:4 }}>{msg.time}</div>
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role:"assistant",
      text:"Good morning. I'm ARENA, your personal assistant. I've already reviewed your inbox, optimised your schedule, and flagged two urgent items requiring your attention today. How may I assist you?",
      time: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
    }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  function now() {
    return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  }

  async function send(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setShowSugg(false);

    setMessages(prev => [...prev, { role:"user", text:msg, time:now() }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role:m.role, content:m.text }));

      const response = await fetch("http://localhost:8000/api/chat/", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ message:msg, history }),
      });

      const data = await response.json();
      const reply = data.reply || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role:"assistant", text:reply, time:now() }]);
    } catch {
      setMessages(prev => [...prev, {
        role:"assistant",
        text:"I'm unable to reach the server at the moment. Please ensure the backend is running on port 8000.",
        time:now(),
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column",
      background:"#09090f", overflow:"hidden",
    }}>

      {/* Top bar */}
      <div style={{
        display:"flex", alignItems:"center", gap:14,
        padding:"16px 28px", borderBottom:"0.5px solid #1e1e2e",
        background:"#0a0a14",
      }}>
        <div style={{
          width:42, height:42, borderRadius:"50%",
          background:"linear-gradient(135deg, #185FA5, #534AB7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16, fontWeight:700, color:"#fff",
          boxShadow:"0 0 16px #378ADD55",
        }}>A</div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, color:"#fff" }}>ARENA</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#1D9E75", display:"inline-block", animation:"pulse 1.5s infinite" }}></span>
            <span style={{ fontSize:11, color:"#1D9E75" }}>Active — working in background</span>
          </div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:8 }}>
          <div style={{ fontSize:11, color:"#555", background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:8, padding:"5px 12px" }}>
            📧 14 handled
          </div>
          <div style={{ fontSize:11, color:"#555", background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:8, padding:"5px 12px" }}>
            📅 4 meetings
          </div>
          <div style={{ fontSize:11, color:"#555", background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:8, padding:"5px 12px" }}>
            ✅ 7 tasks
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"28px 10%", display:"flex", flexDirection:"column" }}>

        {messages.map((m, i) => <Message key={i} msg={m}/>)}

        {loading && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:10, marginBottom:20 }}>
            <div style={{
              width:36, height:36, borderRadius:"50%", flexShrink:0,
              background:"linear-gradient(135deg, #185FA5, #534AB7)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:14, fontWeight:700, color:"#fff",
            }}>A</div>
            <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:"16px 16px 16px 4px" }}>
              <TypingDots/>
            </div>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Suggestions */}
      {showSugg && (
        <div style={{ padding:"0 10% 16px", display:"flex", gap:8, flexWrap:"wrap" }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} style={{
              background:"#0d0d1a", border:"0.5px solid #1e1e2e",
              borderRadius:20, padding:"7px 14px", fontSize:12,
              color:"#666", cursor:"pointer", transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.borderColor="#378ADD"; e.target.style.color="#378ADD"; }}
            onMouseLeave={e => { e.target.style.borderColor="#1e1e2e"; e.target.style.color="#666"; }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding:"16px 10%", borderTop:"0.5px solid #1e1e2e",
        background:"#0a0a14", display:"flex", gap:10, alignItems:"center",
      }}>
        <div style={{
          flex:1, display:"flex", alignItems:"center",
          background:"#0d0d1a", border:"0.5px solid #1e1e2e",
          borderRadius:12, padding:"10px 16px", gap:10,
        }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask ARENA anything..."
            style={{
              flex:1, background:"transparent", border:"none",
              fontSize:14, color:"#fff", outline:"none",
            }}
          />
          {input && (
            <span style={{ fontSize:11, color:"#333", whiteSpace:"nowrap" }}>Enter ↵</span>
          )}
        </div>
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{
          width:44, height:44, borderRadius:"50%", flexShrink:0,
          background: loading || !input.trim() ? "#1a1a2a" : "#378ADD",
          border:"none", color:"#fff", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          fontSize:18, display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.2s", boxShadow: input.trim() ? "0 4px 12px #378ADD44" : "none",
        }}>→</button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        input::placeholder { color:#333; }
      `}</style>
    </div>
  );
}