import { useState } from "react";

const initialTasks = [
  { id:1,  text:"Submit quarterly project report",        done:true,  priority:"high",   due:"Done",     tag:"Work",      notes:"All sections filled including demo video" },
  { id:2,  text:"Review pull request #142",               done:true,  priority:"high",   due:"Done",     tag:"Dev",       notes:"Landing + Dashboard + Inbox + Calendar done" },
  { id:3,  text:"Integrate API client SDK",               done:false, priority:"high",   due:"Today",    tag:"Dev",       notes:"Backend ready, just wire frontend fetch call" },
  { id:4,  text:"Prepare board presentation",             done:false, priority:"high",   due:"Today",    tag:"Work",      notes:"Cover: problem, solution, demo, tech stack" },
  { id:5,  text:"Deploy frontend to Vercel",              done:false, priority:"medium", due:"Today",    tag:"Dev",       notes:"Run: vercel --prod in frontend folder" },
  { id:6,  text:"Deploy backend to staging",              done:false, priority:"medium", due:"Today",    tag:"Dev",       notes:"Connect GitHub repo, set env vars" },
  { id:7,  text:"Update .env.example file",               done:false, priority:"medium", due:"Today",    tag:"Dev",       notes:"Never push API keys to GitHub!" },
  { id:8,  text:"Record product demo video",              done:false, priority:"medium", due:"Tomorrow", tag:"Work",      notes:"2 min max — show live ARENA chat working" },
  { id:9,  text:"Write project README",                   done:false, priority:"low",    due:"Tomorrow", tag:"Dev",       notes:"Include setup steps and tech stack" },
  { id:10, text:"Team retrospective notes",               done:false, priority:"low",    due:"Jun 28",   tag:"Team",      notes:"What went well, what to improve" },
];

const tagColors = {
  Work:      { bg:"#0C447C", text:"#85B7EB" },
  Dev:       { bg:"#085041", text:"#5DCAA5" },
  Team:      { bg:"#3C3489", text:"#AFA9EC" },
};

const priorityColors = {
  high:   { color:"#F09595", bg:"#501313" },
  medium: { color:"#EF9F27", bg:"#412402" },
  low:    { color:"#5DCAA5", bg:"#04342C" },
};

export default function Tasks() {
  const [tasks, setTasks]       = useState(initialTasks);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");
  const [newTask, setNewTask]   = useState("");
  const [showAdd, setShowAdd]   = useState(false);

  function toggleDone(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: Date.now(), text: newTask.trim(), done: false,
      priority:"medium", due:"Today", tag:"Dev", notes:""
    }]);
    setNewTask("");
    setShowAdd(false);
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  const filtered = tasks.filter(t => {
    if (filter === "done")    return t.done;
    if (filter === "pending") return !t.done;
    if (filter === "high")    return t.priority === "high" && !t.done;
    return true;
  });

  const done    = tasks.filter(t => t.done).length;
  const total   = tasks.length;
  const percent = Math.round((done / total) * 100);

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", background:"#09090f" }}>

      {/* Left panel */}
      <div style={{ width:340, borderRight:"0.5px solid #1e1e2e", display:"flex", flexDirection:"column", flexShrink:0 }}>

        {/* Header */}
        <div style={{ padding:"16px 20px", borderBottom:"0.5px solid #1e1e2e" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontSize:14, fontWeight:500, color:"#fff" }}>Tasks</div>
            <button onClick={() => setShowAdd(true)} style={{ background:"#378ADD", border:"none", borderRadius:7, padding:"5px 12px", color:"#fff", cursor:"pointer", fontSize:12 }}>+ Add</button>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
              <div style={{ fontSize:11, color:"#555" }}>{done} of {total} done</div>
              <div style={{ fontSize:11, color:"#378ADD" }}>{percent}%</div>
            </div>
            <div style={{ height:4, background:"#1e1e2e", borderRadius:2 }}>
              <div style={{ height:"100%", width:`${percent}%`, background:"#378ADD", borderRadius:2, transition:"width 0.3s" }}/>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {[
              { key:"all",     label:"All" },
              { key:"pending", label:"Pending" },
              { key:"high",    label:"High priority" },
              { key:"done",    label:"Done" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                background: filter === f.key ? "#0f1629" : "transparent",
                border: `0.5px solid ${filter === f.key ? "#378ADD" : "#222"}`,
                borderRadius:6, padding:"4px 10px", fontSize:11,
                color: filter === f.key ? "#378ADD" : "#555", cursor:"pointer",
              }}>{f.label}</button>
            ))}
          </div>
        </div>

        {/* ARENA tip */}
        <div style={{ padding:"10px 14px", background:"#0a1a0a", borderBottom:"0.5px solid #1e1e2e", fontSize:12, color:"#5DCAA5", display:"flex", gap:8 }}>
          <span>ARENA flagged 4 high-priority tasks due today</span>
        </div>

        {/* Task list */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {filtered.map(t => {
            const pc = priorityColors[t.priority];
            const tc = tagColors[t.tag] || tagColors.Dev;
            return (
              <div key={t.id} onClick={() => setSelected(t)} style={{
                display:"flex", alignItems:"flex-start", gap:10, padding:"12px 16px",
                borderBottom:"0.5px solid #111", cursor:"pointer",
                background: selected?.id === t.id ? "#0f1629" : "transparent",
                borderLeft: selected?.id === t.id ? "2px solid #378ADD" : "2px solid transparent",
              }}>
                <div onClick={e => { e.stopPropagation(); toggleDone(t.id); }} style={{
                  width:17, height:17, borderRadius:5, flexShrink:0, marginTop:2,
                  border: t.done ? "none" : "0.5px solid #333",
                  background: t.done ? "#085041" : "transparent",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:10, color:"#1D9E75", cursor:"pointer",
                }}>{t.done ? "✓" : ""}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color: t.done ? "#444" : "#ccc", textDecoration: t.done ? "line-through" : "none", marginBottom:4 }}>{t.text}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, background:pc.bg, color:pc.color, padding:"2px 7px", borderRadius:8 }}>{t.priority}</span>
                    <span style={{ fontSize:10, background:tc.bg+"44", color:tc.text, padding:"2px 7px", borderRadius:8 }}>{t.tag}</span>
                    <span style={{ fontSize:10, color: t.due === "Today" ? "#EF9F27" : "#444" }}>{t.due}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — task detail */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {selected ? (
          <>
            <div style={{ padding:"20px 28px", borderBottom:"0.5px solid #1e1e2e", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:17, fontWeight:500, color: selected.done ? "#444" : "#fff", textDecoration: selected.done ? "line-through" : "none", marginBottom:10 }}>{selected.text}</div>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ fontSize:11, background:priorityColors[selected.priority].bg, color:priorityColors[selected.priority].color, padding:"3px 10px", borderRadius:8 }}>{selected.priority} priority</span>
                  <span style={{ fontSize:11, background:(tagColors[selected.tag]||tagColors.Dev).bg+"44", color:(tagColors[selected.tag]||tagColors.Dev).text, padding:"3px 10px", borderRadius:8 }}>{selected.tag}</span>
                  <span style={{ fontSize:11, color:"#EF9F27" }}>Due: {selected.due}</span>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => toggleDone(selected.id)} style={{ background: selected.done ? "transparent" : "#085041", border:`0.5px solid ${selected.done ? "#333" : "#1D9E75"}`, borderRadius:8, padding:"7px 14px", color: selected.done ? "#555" : "#5DCAA5", cursor:"pointer", fontSize:12 }}>
                  {selected.done ? "Mark pending" : "Mark done"}
                </button>
                <button onClick={() => deleteTask(selected.id)} style={{ background:"transparent", border:"0.5px solid #501313", borderRadius:8, padding:"7px 14px", color:"#F09595", cursor:"pointer", fontSize:12 }}>Delete</button>
              </div>
            </div>

            <div style={{ flex:1, padding:"24px 28px", overflowY:"auto" }}>
              <div style={{ fontSize:12, color:"#555", marginBottom:8 }}>Notes</div>
              <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:10, padding:"14px 16px", fontSize:13, color:"#aaa", lineHeight:1.7, marginBottom:20 }}>
                {selected.notes || "No notes added."}
              </div>

              {/* ARENA suggestion */}
              <div style={{ background:"#0a1a0a", border:"0.5px solid #1D9E75", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ fontSize:12, color:"#5DCAA5", fontWeight:500, marginBottom:6 }}>ARENA suggestion</div>
                <div style={{ fontSize:13, color:"#5DCAA5", opacity:0.8, lineHeight:1.6 }}>
                  {selected.priority === "high" && !selected.done
                    ? `This is high priority and due ${selected.due}. Want me to block time in your calendar to complete it?`
                    : selected.done
                    ? "Great job completing this task! Want me to update your team?"
                    : "Want me to set a reminder for this task?"}
                </div>
                <button style={{ marginTop:10, background:"transparent", border:"0.5px solid #1D9E75", borderRadius:7, padding:"5px 14px", color:"#5DCAA5", cursor:"pointer", fontSize:12 }}>
                  Yes, do it
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#333", fontSize:14 }}>
            Select a task to view details
          </div>
        )}
      </div>

      {/* Add task modal */}
      {showAdd && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99 }}>
          <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:14, padding:24, width:360 }}>
            <div style={{ fontSize:15, fontWeight:500, color:"#fff", marginBottom:16 }}>New task</div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:11, color:"#555", marginBottom:5 }}>Task</div>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="What needs to be done?" style={{ width:"100%", background:"#111", border:"0.5px solid #222", borderRadius:8, padding:"8px 12px", fontSize:13, color:"#fff", outline:"none" }}/>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button onClick={addTask} style={{ flex:1, background:"#378ADD", border:"none", borderRadius:8, padding:"9px", color:"#fff", cursor:"pointer", fontSize:13 }}>Add task</button>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, background:"transparent", border:"0.5px solid #222", borderRadius:8, padding:"9px", color:"#666", cursor:"pointer", fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
