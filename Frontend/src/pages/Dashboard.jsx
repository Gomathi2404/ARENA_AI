import { useEffect, useState, useRef } from "react";
import Inbox from "./Inbox";
import Calendar from "./Calendar";
import Tasks from "./Tasks";

const colorMap = {
  blue:   { bg: "#0C447C", text: "#85B7EB", border: "#378ADD" },
  green:  { bg: "#085041", text: "#5DCAA5", border: "#1D9E75" },
  purple: { bg: "#3C3489", text: "#AFA9EC", border: "#534AB7" },
  amber:  { bg: "#633806", text: "#EF9F27", border: "#BA7517" },
};

const initFeed = [
  { color: "blue",   title: "Inbox scanned",     desc: "14 emails processed",         time: "just now"  },
  { color: "green",  title: "Reply drafted",      desc: "Q3 report response",           time: "1 min ago" },
  { color: "purple", title: "Focus block added",  desc: "2pm–4pm today",               time: "3 min ago" },
  { color: "amber",  title: "Reminder set",       desc: "board meeting tomorrow",      time: "5 min ago" },
];

const autoFeed = [
  { color: "blue",   title: "Email checked",    desc: "no new urgent items"    },
  { color: "green",  title: "Task updated",     desc: "progress logged"        },
  { color: "purple", title: "Schedule clear",   desc: "tomorrow looks good"    },
  { color: "amber",  title: "Health check",     desc: "all systems running"    },
];

const emails = [
  { init: "SC", bg: "#0C447C", tc: "#85B7EB", name: "Dr. Sarah Chen",    subject: "Re: Q3 project report deadline extended",       time: "9:14 AM", urgent: true,  body: "Hi, just wanted to confirm the Q3 report deadline has been extended to Sunday midnight. Please ensure your submission is complete." },
  { init: "MT", bg: "#085041", tc: "#5DCAA5", name: "Marketing Team",    subject: "Campaign review — schedule confirmed",           time: "8:52 AM", urgent: false, body: "Campaign review confirmed for tomorrow at 10 AM. Please have your presentation ready." },
  { init: "AM", bg: "#3C3489", tc: "#AFA9EC", name: "Alex Morgan",       subject: "Pushed latest frontend changes to repo",          time: "8:30 AM", urgent: false, body: "Hey! Pushed the dashboard changes. Check the repo and let me know if anything needs fixing." },
  { init: "GH", bg: "#633806", tc: "#EF9F27", name: "GitHub",            subject: "Action run failed on branch main",                time: "7:45 AM", urgent: true,  body: "Your workflow 'CI' failed on push to main. Check the logs at github.com/arena-ai/actions for details." },
];

const calEvents = [
  { time: "10:00 AM", title: "Team standup",              meta: "Google Meet · 30 min",  bar: "#378ADD" },
  { time: "11:00 AM", title: "Sprint review with manager", meta: "Zoom · 1 hour",         bar: "#534AB7" },
  { time: "2:00 PM",  title: "Focus block — no meetings",  meta: "Blocked by ARENA",      bar: "#1D9E75" },
  { time: "4:00 PM",  title: "Project submission",         meta: "client deliverable",    bar: "#EF9F27" },
];

function FeedEntry({ item }) {
  const [show, setShow] = useState(false);
  const c = colorMap[item.color];
  useEffect(() => { setTimeout(() => setShow(true), 50); }, []);
  return (
    <div style={{ display:"flex", gap:10, padding:"10px 16px", borderBottom:"0.5px solid #111", alignItems:"flex-start", opacity:show?1:0, transform:show?"translateX(0)":"translateX(10px)", transition:"all 0.35s ease" }}>
      <div style={{ width:26, height:26, borderRadius:6, background:c.bg, border:`0.5px solid ${c.border}`, flexShrink:0 }}></div>
      <div>
        <div style={{ fontSize:12, color:"#ccc", lineHeight:1.5 }}><b style={{ color:"#fff", fontWeight:500 }}>{item.title}</b> — {item.desc}</div>
        <div style={{ fontSize:10, color:"#444", marginTop:2 }}>{item.time||"just now"}</div>
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, onBack }) {
  const nav  = [{ label:"Dashboard", id:"dash" },{ label:"Inbox", id:"inbox" },{ label:"Calendar", id:"cal" },{ label:"Tasks", id:"tasks" }];
  const agent= [{ label:"Activity feed", id:"feed" },{ label:"Assistant", id:"chat" },{ label:"Memory", id:"mem" }];
  const item = (it) => (
    <div key={it.id} onClick={()=>setActive(it.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, fontSize:13, color:active===it.id?"#378ADD":"#666", background:active===it.id?"#0f1629":"transparent", cursor:"pointer", marginBottom:2 }}>
      {it.label}
    </div>
  );
  return (
    <div style={{ background:"#0d0d1a", borderRight:"0.5px solid #1e1e2e", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"20px", borderBottom:"0.5px solid #1e1e2e", fontSize:18, fontWeight:700, letterSpacing:2 }}>AREN<span style={{ color:"#378ADD" }}>A</span></div>
      <div style={{ padding:"16px 12px", flex:1 }}>
        {nav.map(item)}
        <div style={{ fontSize:10, color:"#333", padding:"12px 12px 6px", letterSpacing:"0.08em", textTransform:"uppercase" }}>Agent</div>
        {agent.map(item)}
        <div style={{ fontSize:10, color:"#333", padding:"12px 12px 6px", letterSpacing:"0.08em", textTransform:"uppercase" }}>Settings</div>
        <div onClick={()=>setActive("settings")} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, fontSize:13, color:active==="settings"?"#378ADD":"#666", background:active==="settings"?"#0f1629":"transparent", cursor:"pointer" }}>Preferences</div>
      </div>
      <div style={{ padding:"16px 20px", borderTop:"0.5px solid #1e1e2e", display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:"50%", background:"#0C447C", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:500, color:"#85B7EB" }}>US</div>
        <div><div style={{ fontSize:13, fontWeight:500 }}>User</div><div style={{ fontSize:11, color:"#1D9E75" }}>ARENA active</div></div>
      </div>
    </div>
  );
}

function Topbar({ onBack }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 24px", borderBottom:"0.5px solid #1e1e2e" }}>
      <div style={{ fontSize:15, fontWeight:500 }}>Good morning <span style={{ color:"#555", fontWeight:400 }}>— here's your day</span></div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#0a1a0a", border:"0.5px solid #1D9E75", borderRadius:20, padding:"5px 12px", fontSize:12, color:"#5DCAA5" }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#1D9E75", display:"inline-block" }}></span>
          ARENA is working
        </div>
        <button onClick={onBack} style={{ background:"transparent", border:"0.5px solid #333", borderRadius:8, padding:"6px 12px", color:"#666", cursor:"pointer", fontSize:12 }}>← Back</button>
      </div>
    </div>
  );
}

function RightPanel({ feed, chatInput, setChatInput, sendMsg }) {
  return (
    <div style={{ borderLeft:"0.5px solid #1e1e2e", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", borderBottom:"0.5px solid #1e1e2e", background:"#0a0a14" }}>
          <span style={{ fontSize:13, fontWeight:500 }}>Live agent feed</span>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#1D9E75", display:"inline-block", animation:"pulse 1.5s infinite" }}></span>
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>{feed.map((item,i)=><FeedEntry key={`${item.title}-${i}`} item={item}/>)}</div>
      </div>
      <div style={{ borderTop:"0.5px solid #1e1e2e" }}>
        <div style={{ padding:"13px 16px", borderBottom:"0.5px solid #1e1e2e" }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>Ask ARENA</div>
          <div style={{ fontSize:11, color:"#444" }}>Try: "What's urgent?" or "Clear my Friday"</div>
        </div>
        <div style={{ display:"flex", gap:8, padding:"12px 16px" }}>
          <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Tell ARENA what to do..." style={{ flex:1, background:"#111", border:"0.5px solid #222", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#fff", outline:"none" }}/>
          <button onClick={sendMsg} style={{ background:"#378ADD", border:"none", borderRadius:8, padding:"8px 12px", color:"#fff", cursor:"pointer", fontSize:14 }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function PageDashboard({ feed, chatInput, setChatInput, sendMsg, tasks, toggleTask }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", flex:1, overflow:"hidden" }}>
      <div style={{ padding:"20px 24px", overflowY:"auto", display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          {[
            { label:"Emails handled", val:"14", sub:"3 need your attention", subColor:"#1D9E75" },
            { label:"Meetings today", val:"4",  sub:"Next at 11:00 AM",       subColor:"#378ADD" },
            { label:"Tasks pending",  val:"7",  sub:"2 due today",             subColor:"#EF9F27" },
          ].map(s=>(
            <div key={s.label} style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:10, padding:14 }}>
              <div style={{ fontSize:11, color:"#444", marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:26, fontWeight:700 }}>{s.val}</div>
              <div style={{ fontSize:11, color:s.subColor, marginTop:4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:12, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"13px 16px", borderBottom:"0.5px solid #1e1e2e" }}>
            <span style={{ fontSize:13, fontWeight:500 }}>Inbox — ARENA sorted this</span>
          </div>
          {emails.slice(0,3).map(e=>(
            <div key={e.name} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px", borderBottom:"0.5px solid #111" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:e.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500, color:e.tc, flexShrink:0 }}>{e.init}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:500 }}>{e.name}{e.urgent&&<span style={{ background:"#A32D2D", color:"#F7C1C1", fontSize:10, padding:"2px 7px", borderRadius:10, marginLeft:6 }}>urgent</span>}</div>
                <div style={{ fontSize:12, color:"#555", marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.subject}</div>
              </div>
              <div style={{ fontSize:11, color:"#444", whiteSpace:"nowrap" }}>{e.time}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"13px 16px", borderBottom:"0.5px solid #1e1e2e", fontSize:13, fontWeight:500 }}>Today's schedule</div>
          {calEvents.slice(0,3).map(ev=>(
            <div key={ev.time} style={{ display:"flex", gap:12, padding:"11px 16px", borderBottom:"0.5px solid #111", alignItems:"center" }}>
              <div style={{ fontSize:11, color:"#378ADD", fontWeight:500, minWidth:50 }}>{ev.time}</div>
              <div style={{ width:3, minHeight:34, borderRadius:2, background:ev.bar, flexShrink:0 }}></div>
              <div><div style={{ fontSize:12, fontWeight:500 }}>{ev.title}</div><div style={{ fontSize:11, color:"#555", marginTop:2 }}>{ev.meta}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:12, overflow:"hidden" }}>
          <div style={{ padding:"13px 16px", borderBottom:"0.5px solid #1e1e2e", fontSize:13, fontWeight:500 }}>Tasks</div>
          {tasks.map(t=>(
            <div key={t.id} onClick={()=>toggleTask(t.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderBottom:"0.5px solid #111", cursor:"pointer" }}>
              <div style={{ width:16, height:16, borderRadius:4, border:t.done?"none":"0.5px solid #333", background:t.done?"#085041":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#1D9E75", flexShrink:0 }}>{t.done?"✓":""}</div>
              <div style={{ flex:1, fontSize:12, color:t.done?"#444":"#ccc", textDecoration:t.done?"line-through":"none" }}>{t.text}</div>
              <div style={{ fontSize:11, color:t.done?"#333":"#EF9F27" }}>{t.due}</div>
            </div>
          ))}
        </div>
      </div>
      <RightPanel feed={feed} chatInput={chatInput} setChatInput={setChatInput} sendMsg={sendMsg}/>
    </div>
  );
}

function PageInbox() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", flex:1, overflow:"hidden" }}>
      <div style={{ borderRight:"0.5px solid #1e1e2e", overflowY:"auto" }}>
        <div style={{ padding:"16px 20px", borderBottom:"0.5px solid #1e1e2e", fontSize:13, fontWeight:500, color:"#fff" }}>Inbox <span style={{ background:"#A32D2D", color:"#F7C1C1", fontSize:10, padding:"2px 8px", borderRadius:10, marginLeft:8 }}>2 urgent</span></div>
        {emails.map((e,i)=>(
          <div key={i} onClick={()=>setSelected(e)} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 20px", borderBottom:"0.5px solid #111", cursor:"pointer", background:selected===e?"#0f1629":"transparent" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:e.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:500, color:e.tc, flexShrink:0 }}>{e.init}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500 }}>{e.name}{e.urgent&&<span style={{ background:"#A32D2D", color:"#F7C1C1", fontSize:10, padding:"2px 7px", borderRadius:10, marginLeft:6 }}>urgent</span>}</div>
              <div style={{ fontSize:12, color:"#555", marginTop:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.subject}</div>
              <div style={{ fontSize:11, color:"#333", marginTop:2 }}>{e.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"24px", overflowY:"auto" }}>
        {selected ? (
          <>
            <div style={{ fontSize:16, fontWeight:500, marginBottom:8 }}>{selected.subject}</div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:selected.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:500, color:selected.tc }}>{selected.init}</div>
              <div><div style={{ fontSize:13, color:"#fff" }}>{selected.name}</div><div style={{ fontSize:11, color:"#444" }}>{selected.time}</div></div>
            </div>
            <div style={{ fontSize:14, color:"#aaa", lineHeight:1.8, borderTop:"0.5px solid #1e1e2e", paddingTop:16 }}>{selected.body}</div>
            <div style={{ marginTop:20, display:"flex", gap:10 }}>
              <button style={{ background:"#378ADD", border:"none", borderRadius:8, padding:"8px 18px", color:"#fff", cursor:"pointer", fontSize:13 }}>Reply</button>
              <button style={{ background:"transparent", border:"0.5px solid #333", borderRadius:8, padding:"8px 18px", color:"#666", cursor:"pointer", fontSize:13 }}>Draft with ARENA</button>
            </div>
          </>
        ) : (
          <div style={{ color:"#333", fontSize:14, marginTop:40, textAlign:"center" }}>Select an email to read</div>
        )}
      </div>
    </div>
  );
}

function PageCalendar() {
  return (
    <div style={{ padding:"24px", overflowY:"auto", flex:1 }}>
      <div style={{ fontSize:15, fontWeight:500, marginBottom:20 }}>Today — June 26, 2026</div>
      <div style={{ display:"flex", flexDirection:"column", gap:0, background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:12, overflow:"hidden" }}>
        {calEvents.map(ev=>(
          <div key={ev.time} style={{ display:"flex", gap:16, padding:"16px 20px", borderBottom:"0.5px solid #111", alignItems:"center" }}>
            <div style={{ fontSize:12, color:"#378ADD", fontWeight:500, minWidth:60 }}>{ev.time}</div>
            <div style={{ width:4, minHeight:40, borderRadius:2, background:ev.bar, flexShrink:0 }}></div>
            <div>
              <div style={{ fontSize:14, fontWeight:500 }}>{ev.title}</div>
              <div style={{ fontSize:12, color:"#555", marginTop:3 }}>{ev.meta}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, padding:"14px 16px", background:"#0a1a0a", border:"0.5px solid #1D9E75", borderRadius:10, fontSize:13, color:"#5DCAA5" }}>
        ARENA blocked 2pm–4pm as focus time based on your schedule. Want to change it?
      </div>
    </div>
  );
}

function PageTasks({ tasks, toggleTask }) {
  return (
    <div style={{ padding:"24px", overflowY:"auto", flex:1 }}>
      <div style={{ fontSize:15, fontWeight:500, marginBottom:20 }}>Tasks</div>
      <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:12, overflow:"hidden" }}>
        {tasks.map(t=>(
          <div key={t.id} onClick={()=>toggleTask(t.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 20px", borderBottom:"0.5px solid #111", cursor:"pointer" }}>
            <div style={{ width:18, height:18, borderRadius:5, border:t.done?"none":"0.5px solid #333", background:t.done?"#085041":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#1D9E75", flexShrink:0 }}>{t.done?"✓":""}</div>
            <div style={{ flex:1, fontSize:14, color:t.done?"#444":"#ccc", textDecoration:t.done?"line-through":"none" }}>{t.text}</div>
            <div style={{ fontSize:12, padding:"3px 10px", borderRadius:8, background:t.done?"#0a1a0a":"#13100a", color:t.done?"#333":"#EF9F27", border:`0.5px solid ${t.done?"#1a1a1a":"#633806"}` }}>{t.due}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageChat() {
  const [messages, setMessages] = useState([
    { role:"assistant", text:"Good morning, boss. I've already scanned your overnight inbox — 14 new emails, 3 flagged as urgent. Want a quick summary?" },
    { role:"user", text:"Yes, give me the highlights." },
    { role:"assistant", text:"**Dr. Sarah Chen** — Q3 report deadline extended to Sunday, needs confirmation.\n**GitHub** — CI pipeline failed on main, looks like a missing dependency.\n**Marketing** — Campaign review tomorrow at 10, confirmed.\n\nI drafted a reply to Dr. Chen confirming the extension and pushed a fix for the CI build. Also blocked 2pm–4pm for focus time today." },
    { role:"user", text:"Perfect. What's on my calendar today?" },
    { role:"assistant", text:"**10:00 AM** — Team standup (Google Meet, 30 min)\n**11:00 AM** — Sprint review with manager (Zoom, 1 hr)\n**2:00 PM** — Focus block (I blocked this)\n**4:00 PM** — Project submission deadline\n\nYou have 7 pending tasks — 2 due today. The board presentation is the highest priority. Want me to draft the slides?" },
    { role:"user", text:"Not yet, I'll handle that after standup. Just remind me at 11." },
    { role:"assistant", text:"Got it. I'll ping you after the sprint review. By the way, I noticed the CI fix is already passing — tests are green. One less thing to worry about. Anything else?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role:"user", text:userMsg }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.text }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are ARENA, a smart AI personal assistant. You manage emails, calendar, and tasks for the user. 
You speak like a real PA — proactive, concise, and human. You call the user "boss" occasionally. 
Keep replies short and action-oriented. Current context: 14 emails handled, 4 meetings today, 7 pending tasks.`,
          messages: [...history, { role:"user", content:userMsg }],
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, something went wrong.";
      setMessages(prev => [...prev, { role:"assistant", text:reply }]);
    } catch {
      setMessages(prev => [...prev, { role:"assistant", text:"Couldn't reach the server. Check your API key." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
      <div style={{ padding:"14px 24px", borderBottom:"0.5px solid #1e1e2e", fontSize:13, fontWeight:500 }}>Chat with ARENA</div>
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", display:"flex", flexDirection:"column", gap:12 }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{
              maxWidth:"70%", padding:"10px 14px", borderRadius:12, fontSize:13, lineHeight:1.6,
              background:m.role==="user"?"#378ADD":"#0d0d1a",
              color:m.role==="user"?"#fff":"#ccc",
              border:m.role==="user"?"none":"0.5px solid #1e1e2e",
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-start" }}>
            <div style={{ padding:"10px 14px", borderRadius:12, fontSize:13, background:"#0d0d1a", border:"0.5px solid #1e1e2e", color:"#555" }}>ARENA is thinking...</div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{ display:"flex", gap:10, padding:"16px 24px", borderTop:"0.5px solid #1e1e2e" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder='Ask ARENA anything...' style={{ flex:1, background:"#111", border:"0.5px solid #222", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#fff", outline:"none" }}/>
        <button onClick={send} disabled={loading} style={{ background:loading?"#1a2a3a":"#378ADD", border:"none", borderRadius:10, padding:"10px 18px", color:"#fff", cursor:loading?"not-allowed":"pointer", fontSize:14 }}>→</button>
      </div>
    </div>
  );
}

function PageMemory() {
  const prefs = [
    "Hates back-to-back meetings",
    "Prefers focus time in the afternoon (2pm–4pm)",
    "Always checks urgent emails first",
    "Deadline reminders 24 hours in advance",
    "Short replies preferred — bullet points over paragraphs",
  ];
  return (
    <div style={{ padding:"24px", flex:1, overflowY:"auto" }}>
      <div style={{ fontSize:15, fontWeight:500, marginBottom:6 }}>ARENA's memory</div>
      <div style={{ fontSize:13, color:"#555", marginBottom:20 }}>Things ARENA has learned about you</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {prefs.map((p,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:10, fontSize:13, color:"#ccc" }}>
            <span style={{ color:"#378ADD", fontSize:16 }}>✦</span> {p}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Dashboard({ onBack }) {
  const [active, setActive] = useState("dash");
  const [feed, setFeed]     = useState(initFeed);
  const [autoIdx, setAutoIdx] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [tasks, setTasks] = useState([
    { id:1, text:"Submit quarterly project report",        done:true,  due:"Done"     },
    { id:2, text:"Review pull request #142",               done:true,  due:"Done"     },
    { id:3, text:"Integrate API client SDK",               done:false, due:"Today"    },
    { id:4, text:"Prepare board presentation",             done:false, due:"Today"    },
  ]);

  useEffect(()=>{
    const iv = setInterval(()=>{
      const msg = { ...autoFeed[autoIdx % autoFeed.length], time:"just now" };
      setFeed(prev => [msg, ...prev.slice(0,5)]);
      setAutoIdx(i=>i+1);
    }, 3500);
    return ()=>clearInterval(iv);
  }, [autoIdx]);

  function sendMsg() {
    if (!chatInput.trim()) return;
    const msg = { color:"green", title:"ARENA on it", desc:`"${chatInput}"`, time:"just now" };
    setFeed(prev=>[msg,...prev.slice(0,5)]);
    setChatInput("");
  }

  function toggleTask(id) { setTasks(prev=>prev.map(t=>t.id===id?{...t,done:!t.done}:t)); }

  const renderPage = () => {
    switch(active) {
      case "dash":     return <PageDashboard feed={feed} chatInput={chatInput} setChatInput={setChatInput} sendMsg={sendMsg} tasks={tasks} toggleTask={toggleTask}/>;
      case "inbox":    return <Inbox/>;
      case "cal":      return <Calendar/>;
      case "tasks":    return <Tasks/>;
      case "chat":     return <PageChat/>;
      case "mem":      return <PageMemory/>;
      case "feed":     return <div style={{ padding:24, flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:4 }}><div style={{ fontSize:15, fontWeight:500, marginBottom:16 }}>Full activity feed</div>{feed.map((item,i)=><FeedEntry key={i} item={item}/>)}</div>;
      case "settings": return <div style={{ padding:24, flex:1, color:"#555", fontSize:14 }}>Settings coming soon...</div>;
      default:         return null;
    }
  };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"100vh", background:"#09090f", color:"#fff", fontFamily:"system-ui, sans-serif" }}>
      <Sidebar active={active} setActive={setActive} onBack={onBack}/>
      <div style={{ display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar onBack={onBack}/>
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>{renderPage()}</div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}} input::placeholder{color:#444}`}</style>
    </div>
  );
}
