import { useState } from "react";

export default function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) onLogin();
  }

  return (
    <div style={{ background: "#09090f", minHeight: "100vh", color: "#fff", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", borderBottom: "0.5px solid #1e1e2e" }}>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
          AREN<span style={{ color: "#378ADD" }}>A</span>
        </div>
        <button onClick={onBack} style={{
          background: "transparent", color: "#666", border: "0.5px solid #333",
          padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer",
        }}>← Back</button>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{
          background: "#0d0d1a", border: "0.5px solid #1e1e2e",
          borderRadius: 16, padding: "48px 40px", width: 400, maxWidth: "100%",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
              AREN<span style={{ color: "#378ADD" }}>A</span>
            </div>
            <div style={{ fontSize: 13, color: "#555" }}>Sign in to your assistant</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%", background: "#111", border: "0.5px solid #222",
                  borderRadius: 8, padding: "11px 14px", fontSize: 13,
                  color: "#fff", outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", background: "#111", border: "0.5px solid #222",
                  borderRadius: 8, padding: "11px 14px", fontSize: 13,
                  color: "#fff", outline: "none",
                }}
              />
            </div>

            <button type="submit" style={{
              width: "100%", background: "#378ADD", color: "#fff", border: "none",
              padding: "12px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500,
            }}>Sign in</button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: "0.5px", background: "#1e1e2e" }}></div>
            <span style={{ fontSize: 11, color: "#444" }}>or</span>
            <div style={{ flex: 1, height: "0.5px", background: "#1e1e2e" }}></div>
          </div>

          <button style={{
            width: "100%", background: "transparent", color: "#ccc", border: "0.5px solid #333",
            padding: "11px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>G</span>
            Continue with Google
          </button>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#444" }}>
            Don't have an account?{" "}
            <span style={{ color: "#378ADD", cursor: "pointer" }}>Sign up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
