import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const PAGE_STORAGE_KEY = "arena.currentPage";

function getInitialPage() {
  if (typeof window === "undefined") return "landing";

  const savedPage = window.localStorage.getItem(PAGE_STORAGE_KEY);
  return savedPage === "login" || savedPage === "dashboard" ? savedPage : "landing";
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);

  function navigate(nextPage) {
    setPage(nextPage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(PAGE_STORAGE_KEY, nextPage);
    }
  }

  return (
    <>
      {page === "landing" && <Landing onEnter={() => navigate("login")} />}
      {page === "login" && <Login onLogin={() => navigate("dashboard")} onBack={() => navigate("landing")} />}
      {page === "dashboard" && <Dashboard onHome={() => navigate("landing")} onLogout={() => navigate("landing")} />}
    </>
  );
}
