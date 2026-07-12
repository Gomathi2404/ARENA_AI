import { useEffect, useRef, useState } from "react";

const EMAIL_WEBHOOK_URL = "https://gricelda-nondeclaratory-erasmo.ngrok-free.dev/webhook/emails";
const SYNC_API_URL = "http://localhost:8000/api/sync/";
// const FALLBACK_EMAILS = [
//   {
//     id: "19f55ea3daffc11b",
//     subject: "Get started with your new Analytics account",
//     from: "Google Analytics <analytics-noreply@google.com>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Sign up for setup help, recommendations, and more.",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f555775a5fb760",
//     subject: "PPIs with Logitech + ₹2.25 Lakhs | A Hiring Opportunity for Women",
//     from: "Ritika Sharma <noreply@unstop.news>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Apply Now",
//     labels: ["INBOX", "CATEGORY_UPDATES"],
//   },
//   {
//     id: "19f54c2349c2821d",
//     subject: "Earn stipend up to ₹50,000!",
//     from: "Jia from Unstop <noreply@unstop.news>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Top wfh opportunities!",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f52c56273da5c6",
//     subject: "Alert—Auto-shutdown of virtual machine new-n8n in 30 minutes",
//     from: "Microsoft Azure <azure-noreply@microsoft.com>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "You may postpone or skip this shutdown.",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f507b4f373becc",
//     subject: "Welcome to Firebase",
//     from: "Firebase <firebase-no-reply@google.com>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "View the web version if this email isn't displaying well.",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f4bd9df4f55004",
//     subject: "Cisco is hiring interns!",
//     from: "Jia from Unstop <noreply@unstop.news>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Earn INR 75k per month!",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f4b73a2cb248b0",
//     subject: "Your Microsoft invoice G169987110 is ready",
//     from: "Microsoft <microsoft-noreply@microsoft.com>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Sign in to review your latest invoice.",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f4ab6efbb6014a",
//     subject: "Learn how to build apps with TypeScript and React [Free 1-hour course]",
//     from: "Quincy Larson <quincy@freecodecamp.org>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Here are this week's five freeCodeCamp resources that are worth your time.",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f48ddbd7ed1b85",
//     subject: "OpenAI Build Week, new hackathons, Devpost heads to Brooklyn 🔥",
//     from: "Darlyze from Devpost <darlyze@devpost.com>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Build with GPT-5.6 and Codex.",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f4552bd9e60e0c",
//     subject: "Earn stipend up to ₹50,000!",
//     from: "Jia from Unstop <noreply@unstop.news>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Top wfh opportunities!",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f430cb45182c77",
//     subject: "Motion System is live & it lives where you already work",
//     from: "LottieFiles <hello@lottiefiles.com>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "One governed source of truth for your team's motion design.",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
//   {
//     id: "19f42705dda05a73",
//     subject: "Airbus is hiring interns!",
//     from: "Jia from Unstop <noreply@unstop.news>",
//     to: "mohanadharshini2404@gmail.com",
//     date: "",
//     snippet: "Your profile is a match!",
//     labels: ["INBOX", "CATEGORY_UPDATES", "UNREAD"],
//   },
// ];
const AVATAR_COLORS = [
  { bg: "#0C447C", fg: "#85B7EB" },
  { bg: "#085041", fg: "#5DCAA5" },
  { bg: "#3C3489", fg: "#AFA9EC" },
  { bg: "#633806", fg: "#EF9F27" },
  { bg: "#444441", fg: "#B4B2A9" },
  { bg: "#5B2A86", fg: "#E0B3FF" },
];

function getInitials(name = "Email") {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return "EM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function hashString(value = "") {
  return String(value).split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function pickAvatar(name = "") {
  const index = Math.abs(hashString(name)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function formatEmailTime(value) {
  if (!value) return "Just now";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getFirstText(...values) {
  for (const value of values) {
    if (typeof value !== "string") continue;

    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }

  return "";
}

function formatLabelList(labels) {
  if (!Array.isArray(labels)) return [];

  return labels
    .map((label) => (typeof label === "string" ? label.trim() : String(label ?? "").trim()))
    .filter(Boolean);
}

function parseWebhookPayload(payload) {
  if (typeof payload !== "string") return payload;

  const trimmed = payload.trim();
  if (!trimmed) return [];

  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

function getEmailPreview(email) {
  const content = email.body || email.text || email.message || email.content || email.snippet || "";
  const cleaned = String(content).replace(/\s+/g, " ").trim();

  if (!cleaned) return "No preview available.";
  return cleaned.length > 180 ? `${cleaned.slice(0, 177)}...` : cleaned;
}

function normalizeEmail(rawEmail, index) {
  const sender = getFirstText(rawEmail.sender, rawEmail.from, rawEmail.name, rawEmail.author, rawEmail.email) || `Email ${index + 1}`;
  const recipient = getFirstText(rawEmail.to, rawEmail.recipient, rawEmail.mailbox);
  const subject = getFirstText(rawEmail.subject, rawEmail.title, rawEmail.summary, rawEmail.snippet) || `Message ${index + 1}`;
  const receivedAt = getFirstText(rawEmail.receivedAt, rawEmail.date, rawEmail.createdAt, rawEmail.timestamp, rawEmail.time, rawEmail.sentAt);
  const labels = formatLabelList(rawEmail.labels);
  const tag = rawEmail.tag || rawEmail.label || rawEmail.category || rawEmail.folder || labels[0] || (rawEmail.urgent ? "Urgent" : "Inbox");

  return {
    id: rawEmail.id || rawEmail.emailId || rawEmail.messageId || `${index}-${sender}-${subject}`,
    sender,
    recipient,
    subject,
    receivedAt,
    preview: getEmailPreview(rawEmail),
    urgent: Boolean(rawEmail.urgent || rawEmail.isUrgent || rawEmail.priority === "high" || rawEmail.severity === "high"),
    tag,
    labels,
  };
}

function extractEmails(payload) {
  const parsedPayload = parseWebhookPayload(payload);

  if (Array.isArray(parsedPayload)) return parsedPayload;

  if (parsedPayload && typeof parsedPayload === "object") {
    const list = parsedPayload.emails || parsedPayload.data || parsedPayload.items || parsedPayload.results || parsedPayload.messages || parsedPayload.payload;
    if (Array.isArray(list)) return list;

    if (typeof list === "string") {
      const parsedList = parseWebhookPayload(list);
      if (Array.isArray(parsedList)) return parsedList;
    }
  }

  return [];
}

function looksLikeTaskEmail(email) {
  const text = `${email.subject || ""} ${email.preview || ""}`.toLowerCase();
  return /\b(action required|todo|to-do|task|deadline|due|follow up|follow-up|submit|reminder|review|apply|complete|respond)\b/.test(text);
}

function looksLikeCalendarEmail(email) {
  const text = `${email.subject || ""} ${email.preview || ""}`.toLowerCase();
  return /\b(meeting|calendar|invite|schedule|reschedule|appointment|call|standup|sync|demo|workshop|interview|event)\b/.test(text);
}

function buildTaskCandidate(email) {
  return {
    title: email.subject,
    from: email.sender,
    snippet: email.preview,
    sourceId: email.id,
  };
}

function buildCalendarCandidate(email) {
  return {
    title: email.subject,
    from: email.sender,
    snippet: email.preview,
    sourceId: email.id,
  };
}

function Sidebar({ active, setActive, onHome, onLogout, onSync, syncing }) {
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={onSync}
            disabled={syncing}
            style={{
              width: "100%",
              background: syncing ? "#15253a" : "#0f1629",
              border: "0.5px solid #378ADD",
              borderRadius: 10,
              padding: "8px 12px",
              color: syncing ? "#7ea8d8" : "#85B7EB",
              cursor: syncing ? "not-allowed" : "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {syncing ? "Syncing..." : "Sync inbox"}
          </button>
          <button onClick={onHome} style={{ width: "100%", background: "transparent", border: "0.5px solid #333", borderRadius: 10, padding: "8px 12px", color: "#666", cursor: "pointer", fontSize: 12 }}>
            ← Home
          </button>
          <button onClick={onLogout} style={{ width: "100%", background: "#1b1320", border: "0.5px solid #5c2b3a", borderRadius: 10, padding: "8px 12px", color: "#f0b3bc", cursor: "pointer", fontSize: 12 }}>
            Logout
          </button>
        </div>
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
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadEmails() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(EMAIL_WEBHOOK_URL, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "1",
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const rawBody = await response.text();
        const payload = parseWebhookPayload(rawBody);
        const normalized = extractEmails(payload).map(normalizeEmail);

        if (normalized.length === 0) {
          setEmails(FALLBACK_EMAILS.map(normalizeEmail));
          setError("Webhook returned an acknowledgement only, so the dashboard is showing the local fallback inbox.");
          return;
        }

        setEmails(normalized);
      } catch (fetchError) {
        if (fetchError.name !== "AbortError") {
          setError("Unable to load emails from the webhook right now.");
          setEmails([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadEmails();

    return () => controller.abort();
  }, []);

  const stats = [
    { title: "Source", value: "Webhook", detail: EMAIL_WEBHOOK_URL.replace(/^https?:\/\//, "") },
    { title: "Loaded", value: loading ? "..." : String(emails.length), detail: loading ? "Fetching latest messages" : `${emails.length} email${emails.length === 1 ? "" : "s"} ready` },
    { title: "Status", value: error ? "Offline" : "Live", detail: error || "Showing the most recent webhook response" },
  ];

  const visibleEmails = emails.slice(0, 12);

  return (
    <div style={{ width: "min(1120px, 100%)", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>Dashboard</div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>Latest emails pulled from the webhook are shown below as individual cards.</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {stats.map((stat) => (
            <div key={stat.title} style={{ background: "rgba(13, 13, 26, 0.96)", border: "0.5px solid #1e1e2e", borderRadius: 14, padding: "12px 14px", minWidth: 150 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>{stat.title}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>{stat.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ background: "rgba(13, 13, 26, 0.96)", border: "0.5px solid #1e1e2e", borderRadius: 16, padding: 18, color: "#666", fontSize: 13 }}>
          Loading emails from the webhook...
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(43, 17, 20, 0.96)", border: "0.5px solid #7d2c39", borderRadius: 16, padding: 18, color: "#f0b3bc", fontSize: 13 }}>
          {error} Check that the webhook workflow is active and returns a JSON array or an object with an <span style={{ color: "#fff" }}>emails</span> field.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {visibleEmails.map((email) => {
          const avatar = pickAvatar(email.sender);

          return (
            <div key={email.id} style={{ background: "rgba(13, 13, 26, 0.96)", border: "0.5px solid #1e1e2e", borderRadius: 18, padding: 18, display: "flex", flexDirection: "column", gap: 14, minHeight: 220 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: avatar.bg, color: avatar.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {getInitials(email.sender)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email.sender}</div>
                    <div style={{ fontSize: 11, color: "#555", flexShrink: 0 }}>{formatEmailTime(email.receivedAt)}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4, lineHeight: 1.4 }}>
                    {email.recipient ? `To: ${email.recipient}` : "To: not provided"}
                  </div>
                  <div style={{ fontSize: 12, color: "#bbb", marginTop: 6, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {email.subject}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#999", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {email.preview}
              </div>

              <div style={{ marginTop: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {email.urgent && (
                  <span style={{ background: "#A32D2D", color: "#F7C1C1", fontSize: 10, padding: "3px 8px", borderRadius: 999 }}>
                    urgent
                  </span>
                )}
                <span style={{ background: `${avatar.bg}44`, color: avatar.fg, fontSize: 10, padding: "3px 8px", borderRadius: 999 }}>
                  {email.tag}
                </span>
                {email.labels.slice(0, 2).map((label) => (
                  <span key={label} style={{ background: "#111827", color: "#9ca3af", fontSize: 10, padding: "3px 8px", borderRadius: 999 }}>
                    {label}
                  </span>
                ))}
                <span style={{ marginLeft: "auto", color: "#555", fontSize: 10 }}>#{String(email.id)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !error && visibleEmails.length === 0 && (
        <div style={{ background: "rgba(13, 13, 26, 0.96)", border: "0.5px solid #1e1e2e", borderRadius: 16, padding: 18, color: "#666", fontSize: 13 }}>
          No emails were returned by the webhook response.
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ onHome, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  async function handleSync() {
    if (syncing) return;

    setSyncing(true);
    setSyncMessage("Pulling recent emails...");

    try {
      const emailsResponse = await fetch(EMAIL_WEBHOOK_URL, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "1",
          Accept: "application/json",
        },
      });

      if (!emailsResponse.ok) {
        throw new Error(`Email fetch failed with status ${emailsResponse.status}`);
      }

      const emailsPayload = parseWebhookPayload(await emailsResponse.text());
      const recentEmails = extractEmails(emailsPayload).slice(0, 20).map(normalizeEmail);

      const tasks = recentEmails.filter(looksLikeTaskEmail).map(buildTaskCandidate);
      const calendarEvents = recentEmails.filter(looksLikeCalendarEmail).map(buildCalendarCandidate);

      setSyncMessage(`Sending ${tasks.length} task${tasks.length === 1 ? "" : "s"} and ${calendarEvents.length} calendar item${calendarEvents.length === 1 ? "" : "s"} to the workflow...`);

      const syncResponse = await fetch(SYNC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          emails: recentEmails,
          tasks,
          calendarEvents,
        }),
      });

      if (!syncResponse.ok) {
        throw new Error(`Sync request failed with status ${syncResponse.status}`);
      }

      const syncPayload = parseWebhookPayload(await syncResponse.text());
      const syncSummary = typeof syncPayload === "object" && syncPayload !== null && typeof syncPayload.message === "string"
        ? syncPayload.message
        : typeof syncPayload === "string" && syncPayload.trim()
          ? syncPayload.trim()
          : "Sync completed.";

      setSyncMessage(`${syncSummary} ${tasks.length || calendarEvents.length ? `Queued ${tasks.length} task${tasks.length === 1 ? "" : "s"} and ${calendarEvents.length} calendar item${calendarEvents.length === 1 ? "" : "s"}.` : "No task or calendar items found in the latest emails."}`.trim());
    } catch (syncError) {
      setSyncMessage(`Sync failed: ${syncError instanceof Error ? syncError.message : "Unable to reach the workflow."}`);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at top, rgba(55, 138, 221, 0.12), transparent 35%), #09090f", color: "#fff", fontFamily: "system-ui, sans-serif", display: "grid", gridTemplateColumns: "220px 1fr" }}>
      <Sidebar active={active} setActive={setActive} onHome={onHome ?? onLogout} onLogout={onLogout ?? onHome} onSync={handleSync} syncing={syncing} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, overflow: "hidden" }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          {syncMessage && (
            <div style={{ width: "min(1120px, 100%)", background: "rgba(13, 13, 26, 0.96)", border: "0.5px solid #1e1e2e", borderRadius: 14, padding: "12px 14px", color: "#85B7EB", fontSize: 12, lineHeight: 1.5 }}>
              {syncMessage}
            </div>
          )}
          {active === "chat" ? <ChatCard /> : <DashboardCard />}
        </div>
      </div>
      <style>{`input::placeholder{color:#444}`}</style>
    </div>
  );
}
