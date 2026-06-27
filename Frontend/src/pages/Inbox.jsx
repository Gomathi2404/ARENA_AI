import { useState } from "react";

const emails = [
  {
    id: 1,
    init: "SC",
    bg: "#0C447C",
    tc: "#85B7EB",
    name: "Dr. Sarah Chen",
    subject: "Re: Q3 project report deadline extended",
    time: "9:14 AM",
    urgent: true,
    tag: "Work",
    tagColor: "#185FA5",
    body: `Hi,

Just wanted to confirm that the Q3 project report deadline has been extended to Sunday midnight. Please ensure your submission is complete with all required sections.

Make sure you include:
- Project demo video
- GitHub repository link
- Team member details

Let me know if you have questions.

Regards,
Dr. Sarah Chen`,
  },
  {
    id: 2,
    init: "MT",
    bg: "#085041",
    tc: "#5DCAA5",
    name: "Marketing Team",
    subject: "Campaign review — schedule confirmed",
    time: "8:52 AM",
    urgent: false,
    tag: "Meeting",
    tagColor: "#085041",
    body: `Hi Everyone,

We've confirmed the campaign review meeting for tomorrow at 10:00 AM. Please have your presentations ready.

Agenda:
- Q3 campaign performance review (30%)
- Proposed strategy for Q4 (30%)
- Budget allocation update (25%)
- New initiatives (15%)

See you there.

Best,
Marketing Team`,
  },
  {
    id: 3,
    init: "AM",
    bg: "#3C3489",
    tc: "#AFA9EC",
    name: "Alex Morgan",
    subject: "Pushed latest frontend changes to repo",
    time: "8:30 AM",
    urgent: false,
    tag: "Dev",
    tagColor: "#3C3489",
    body: `Hey!

Just pushed the latest frontend changes to the repo. Here's what I updated:

- Fixed the sidebar navigation bug
- Added responsive styles for mobile
- Updated the dashboard animations

Can you review and let me know if anything needs fixing?

Also, don't forget to pull before making changes.

- Alex`,
  },
  {
    id: 4,
    init: "GH",
    bg: "#633806",
    tc: "#EF9F27",
    name: "GitHub",
    subject: "Action run failed on branch main",
    time: "7:45 AM",
    urgent: true,
    tag: "DevOps",
    tagColor: "#633806",
    body: `Hi there,

Your workflow 'CI' failed on push to main branch.

Run details:
- Branch: main
- Commit: a3f9b12
- Error: Module not found — 'anthropic'

Fix: Run 'pip install anthropic' and push again.

View full logs at: github.com/your-repo/actions

— GitHub Actions`,
  },
  {
    id: 5,
    init: "HR",
    bg: "#444441",
    tc: "#B4B2A9",
    name: "HR Department",
    subject: "Reminder: Submit attendance report",
    time: "7:00 AM",
    urgent: false,
    tag: "Admin",
    tagColor: "#444441",
    body: `Dear Employee,

This is a reminder to submit your monthly attendance report.

Please fill the form by end of day.

Thank you,
HR Administration`,
  },
];

export default function Inbox() {
  const [selected, setSelected] = useState(emails[0]);
  const [read, setRead] = useState(new Set([3, 5]));
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("all");

  function openEmail(email) {
    setSelected(email);
    setRead((prev) => new Set([...prev, email.id]));
    setDrafting(false);
    setDraft("");
  }

  const filtered = filter === "urgent"
    ? emails.filter((e) => e.urgent)
    : emails;

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: "#09090f" }}>

      {/* Email list */}
      <div style={{ width: 300, borderRight: "0.5px solid #1e1e2e", display: "flex", flexDirection: "column", flexShrink: 0 }}>

        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "0.5px solid #1e1e2e" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
              Inbox
              <span style={{ background: "#A32D2D", color: "#F7C1C1", fontSize: 10, padding: "2px 8px", borderRadius: 10, marginLeft: 8 }}>
                2 urgent
              </span>
            </div>
            <div style={{ fontSize: 11, color: "#378ADD", cursor: "pointer" }}>Compose</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "urgent"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: filter === f ? "#0f1629" : "transparent",
                border: `0.5px solid ${filter === f ? "#378ADD" : "#222"}`,
                borderRadius: 6, padding: "4px 10px", fontSize: 11,
                color: filter === f ? "#378ADD" : "#555", cursor: "pointer",
              }}>
                {f === "all" ? "All" : "Urgent"}
              </button>
            ))}
          </div>
        </div>

        {/* ARENA summary */}
        <div style={{ padding: "10px 14px", background: "#0a1a0a", borderBottom: "0.5px solid #1e1e2e", fontSize: 12, color: "#5DCAA5", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span>ARENA sorted your inbox — 2 urgent, 3 read, 2 drafts ready</span>
        </div>

        {/* Email list */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.map((e) => (
            <div key={e.id} onClick={() => openEmail(e)} style={{
              display: "flex", gap: 10, padding: "13px 16px",
              borderBottom: "0.5px solid #111", cursor: "pointer",
              background: selected?.id === e.id ? "#0f1629" : "transparent",
              borderLeft: selected?.id === e.id ? "2px solid #378ADD" : "2px solid transparent",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: e.tc, flexShrink: 0 }}>{e.init}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <div style={{ fontSize: 12, fontWeight: read.has(e.id) ? 400 : 600, color: read.has(e.id) ? "#666" : "#fff" }}>{e.name}</div>
                  <div style={{ fontSize: 10, color: "#444" }}>{e.time}</div>
                </div>
                <div style={{ fontSize: 11, color: "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.subject}</div>
                <div style={{ marginTop: 5, display: "flex", gap: 5 }}>
                  {e.urgent && <span style={{ background: "#A32D2D", color: "#F7C1C1", fontSize: 9, padding: "1px 6px", borderRadius: 8 }}>urgent</span>}
                  <span style={{ background: e.bg + "44", color: e.tc, fontSize: 9, padding: "1px 6px", borderRadius: 8 }}>{e.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email viewer */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selected ? (
          <>
            {/* Email header */}
            <div style={{ padding: "20px 28px", borderBottom: "0.5px solid #1e1e2e" }}>
              <div style={{ fontSize: 17, fontWeight: 500, color: "#fff", marginBottom: 12 }}>{selected.subject}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: selected.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: selected.tc }}>{selected.init}</div>
                  <div>
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: 500 }}>{selected.name}</div>
                    <div style={{ fontSize: 11, color: "#444" }}>To: user@arena.ai · {selected.time}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setDrafting(true)} style={{ background: "#378ADD", border: "none", borderRadius: 8, padding: "7px 16px", color: "#fff", cursor: "pointer", fontSize: 12 }}>Reply</button>
                  <button style={{ background: "transparent", border: "0.5px solid #222", borderRadius: 8, padding: "7px 16px", color: "#666", cursor: "pointer", fontSize: 12 }}>Forward</button>
                  <button style={{ background: "#0a1a0a", border: "0.5px solid #1D9E75", borderRadius: 8, padding: "7px 16px", color: "#5DCAA5", cursor: "pointer", fontSize: 12 }}>Draft with ARENA</button>
                </div>
              </div>
            </div>

            {/* Email body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              <pre style={{ fontSize: 14, color: "#aaa", lineHeight: 1.8, fontFamily: "system-ui, sans-serif", whiteSpace: "pre-wrap" }}>{selected.body}</pre>
            </div>

            {/* Reply box */}
            {drafting && (
              <div style={{ borderTop: "0.5px solid #1e1e2e", padding: "16px 28px" }}>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>Reply to {selected.name}</div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  style={{ width: "100%", background: "#0d0d1a", border: "0.5px solid #1e1e2e", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fff", outline: "none", resize: "none", fontFamily: "system-ui, sans-serif" }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button style={{ background: "#378ADD", border: "none", borderRadius: 8, padding: "8px 20px", color: "#fff", cursor: "pointer", fontSize: 13 }}>Send</button>
                  <button onClick={() => setDrafting(false)} style={{ background: "transparent", border: "0.5px solid #222", borderRadius: 8, padding: "8px 16px", color: "#666", cursor: "pointer", fontSize: 13 }}>Cancel</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#333", fontSize: 14 }}>
            Select an email to read
          </div>
        )}
      </div>
    </div>
  );
}
