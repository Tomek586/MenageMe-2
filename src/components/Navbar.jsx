import { useEffect, useState } from "react";
import { fetchUser, logout } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [sessionTimeLeft, setSessionTimeLeft] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await fetchUser();
      setUser(u);
      const token = localStorage.getItem("accessToken");
      if (token) {
        const { exp } = jwtDecode(token);
        updateTimeLeft(exp * 1000);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const { exp } = jwtDecode(token);
        updateTimeLeft(exp * 1000);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const updateTimeLeft = (expireAt) => {
    const diff = expireAt - Date.now();
    if (diff <= 0) return logout() && window.location.reload();
    const m = Math.floor(diff / 60000),
      s = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, "0");
    setSessionTimeLeft(`${m}:${s}`);
  };

  useEffect(() => {
    const html = document.documentElement;
    isDark ? html.classList.add("dark") : html.classList.remove("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">ManagMe</h1>
          {user ? (
            <>
              <p>
                Welcome, {user.firstName} {user.lastName} ({user.role})
              </p>
              {sessionTimeLeft && (
                <p className="text-sm">Sesja wygasa za: {sessionTimeLeft}</p>
              )}
            </>
          ) : (
            <p>Ładowanie...</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark((d) => !d)}
            className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded"
          >
            {isDark ? "Jasny" : "Ciemny"}
          </button>
          <button onClick={() => (logout(), window.location.reload())} className="bg-red-500 px-4 py-2 rounded">
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
  );
};
