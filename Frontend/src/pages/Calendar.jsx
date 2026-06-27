import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const events = {
  26: [
    { id:1, time:"10:00 AM", end:"10:30 AM", title:"Team standup",              meta:"Google Meet",  color:"#378ADD", bg:"#0C447C" },
    { id:2, time:"11:00 AM", end:"12:00 PM", title:"Sprint review with manager", meta:"Zoom",         color:"#534AB7", bg:"#3C3489" },
    { id:3, time:"2:00 PM",  end:"4:00 PM",  title:"Focus block",               meta:"Blocked by ARENA", color:"#1D9E75", bg:"#085041", arena: true },
    { id:4, time:"4:00 PM",  end:"5:00 PM",  title:"Project submission deadline", meta:"Client deliverable", color:"#EF9F27", bg:"#633806" },
  ],
  27: [
    { id:5, time:"9:00 AM",  end:"10:00 AM", title:"Quarterly review prep",     meta:"Board room",    color:"#378ADD", bg:"#0C447C" },
    { id:6, time:"11:00 AM", end:"12:00 PM", title:"Client presentation",        meta:"Google Meet",   color:"#534AB7", bg:"#3C3489" },
    { id:7, time:"3:00 PM",  end:"4:00 PM",  title:"Team sync",                  meta:"Slack huddle",  color:"#1D9E75", bg:"#085041" },
  ],
  28: [
    { id:8, time:"10:00 AM", end:"11:00 AM", title:"Team retrospective",         meta:"Google Meet",  color:"#378ADD", bg:"#0C447C" },
  ],
  25: [
    { id:9, time:"9:00 AM",  end:"10:00 AM", title:"Project kickoff",            meta:"Conference room A", color:"#EF9F27", bg:"#633806" },
    { id:10,time:"2:00 PM",  end:"6:00 PM",  title:"Strategy & planning",        meta:"Team session", color:"#534AB7", bg:"#3C3489" },
  ],
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function Calendar() {
  const today = new Date();
  const [year, setYear]   = useState(2026);
  const [month, setMonth] = useState(5);
  const [selectedDay, setSelectedDay] = useState(26);
  const [showAdd, setShowAdd] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDay(year, month);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const dayEvents = events[selectedDay] || [];

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", background:"#09090f" }}>

      {/* Left — calendar grid */}
      <div style={{ width:320, borderRight:"0.5px solid #1e1e2e", display:"flex", flexDirection:"column", padding:20, flexShrink:0 }}>

        {/* Month nav */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <button onClick={prevMonth} style={{ background:"transparent", border:"0.5px solid #222", borderRadius:7, padding:"5px 10px", color:"#666", cursor:"pointer", fontSize:13 }}>←</button>
          <div style={{ fontSize:14, fontWeight:500, color:"#fff" }}>{MONTHS[month]} {year}</div>
          <button onClick={nextMonth} style={{ background:"transparent", border:"0.5px solid #222", borderRadius:7, padding:"5px 10px", color:"#666", cursor:"pointer", fontSize:13 }}>→</button>
        </div>

        {/* Day headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:8 }}>
          {DAYS.map(d => (
            <div key={d} style={{ fontSize:11, color:"#444", textAlign:"center", padding:"4px 0" }}>{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
          {Array(firstDay).fill(null).map((_,i) => <div key={"e"+i}/>)}
          {Array(daysInMonth).fill(null).map((_,i) => {
            const day = i + 1;
            const hasEvent = !!events[day];
            const isToday  = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = day === selectedDay;
            return (
              <div key={day} onClick={() => setSelectedDay(day)} style={{
                position:"relative", textAlign:"center", padding:"7px 4px",
                borderRadius:8, cursor:"pointer", fontSize:13,
                background: isSelected ? "#378ADD" : isToday ? "#0f1629" : "transparent",
                color: isSelected ? "#fff" : isToday ? "#378ADD" : "#888",
                border: isToday && !isSelected ? "0.5px solid #378ADD" : "0.5px solid transparent",
              }}>
                {day}
                {hasEvent && (
                  <div style={{ position:"absolute", bottom:3, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background: isSelected ? "#fff" : "#378ADD" }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* ARENA tip */}
        <div style={{ marginTop:20, padding:"12px 14px", background:"#0a1a0a", border:"0.5px solid #1D9E75", borderRadius:10, fontSize:12, color:"#5DCAA5" }}>
          ARENA blocked focus time on June 26 based on your schedule
        </div>

        {/* Add event */}
        <button onClick={() => setShowAdd(true)} style={{ marginTop:12, background:"#378ADD", border:"none", borderRadius:9, padding:"10px", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:500 }}>
          + Add event
        </button>
      </div>

      {/* Right — day view */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Day header */}
        <div style={{ padding:"16px 24px", borderBottom:"0.5px solid #1e1e2e", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:18, fontWeight:500, color:"#fff" }}>
              {MONTHS[month]} {selectedDay}, {year}
            </div>
            <div style={{ fontSize:12, color:"#555", marginTop:2 }}>
              {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""} scheduled
            </div>
          </div>
          {selectedDay === 26 && (
            <div style={{ fontSize:12, color:"#5DCAA5", background:"#0a1a0a", border:"0.5px solid #1D9E75", borderRadius:8, padding:"5px 12px" }}>
              Submission day
            </div>
          )}
        </div>

        {/* Timeline */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
          {dayEvents.length === 0 ? (
            <div style={{ textAlign:"center", color:"#333", fontSize:14, marginTop:60 }}>
              No events — ARENA kept this day free
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {dayEvents.map(ev => (
                <div key={ev.id} style={{ display:"flex", gap:16, alignItems:"stretch" }}>
                  {/* Time */}
                  <div style={{ minWidth:72, textAlign:"right", paddingTop:4 }}>
                    <div style={{ fontSize:12, color:"#378ADD", fontWeight:500 }}>{ev.time}</div>
                    <div style={{ fontSize:10, color:"#333", marginTop:2 }}>{ev.end}</div>
                  </div>
                  {/* Bar */}
                  <div style={{ width:3, borderRadius:2, background:ev.color, flexShrink:0 }}/>
                  {/* Card */}
                  <div style={{ flex:1, background:"#0d0d1a", border:`0.5px solid ${ev.color}33`, borderRadius:10, padding:"12px 16px" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      <div style={{ fontSize:14, fontWeight:500, color:"#fff" }}>{ev.title}</div>
                      {ev.arena && (
                        <span style={{ fontSize:10, background:"#085041", color:"#5DCAA5", padding:"2px 8px", borderRadius:8 }}>by ARENA</span>
                      )}
                    </div>
                    <div style={{ fontSize:12, color:"#555", marginTop:4 }}>{ev.meta}</div>
                    <div style={{ display:"flex", gap:8, marginTop:10 }}>
                      <button style={{ background:"transparent", border:`0.5px solid ${ev.color}55`, borderRadius:6, padding:"4px 10px", fontSize:11, color:ev.color, cursor:"pointer" }}>Edit</button>
                      <button style={{ background:"transparent", border:"0.5px solid #222", borderRadius:6, padding:"4px 10px", fontSize:11, color:"#555", cursor:"pointer" }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add event modal */}
      {showAdd && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:99 }}>
          <div style={{ background:"#0d0d1a", border:"0.5px solid #1e1e2e", borderRadius:14, padding:24, width:360 }}>
            <div style={{ fontSize:15, fontWeight:500, color:"#fff", marginBottom:16 }}>Add event</div>
            {[
              { label:"Title", placeholder:"e.g. Team meeting" },
              { label:"Date",  placeholder:"June 26, 2026" },
              { label:"Time",  placeholder:"10:00 AM" },
              { label:"Meet link", placeholder:"meet.google.com/..." },
            ].map(f => (
              <div key={f.label} style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"#555", marginBottom:5 }}>{f.label}</div>
                <input placeholder={f.placeholder} style={{ width:"100%", background:"#111", border:"0.5px solid #222", borderRadius:8, padding:"8px 12px", fontSize:13, color:"#fff", outline:"none" }}/>
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, background:"#378ADD", border:"none", borderRadius:8, padding:"9px", color:"#fff", cursor:"pointer", fontSize:13 }}>Save</button>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, background:"transparent", border:"0.5px solid #222", borderRadius:8, padding:"9px", color:"#666", cursor:"pointer", fontSize:13 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
