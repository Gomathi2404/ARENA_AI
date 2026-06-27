import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      {page === "landing" && <Landing onEnter={() => setPage("login")} />}
      {page === "login" && <Login onLogin={() => setPage("dashboard")} onBack={() => setPage("landing")} />}
      {page === "dashboard" && <Dashboard onLogout={() => setPage("landing")} />}
    </>
  );
}
