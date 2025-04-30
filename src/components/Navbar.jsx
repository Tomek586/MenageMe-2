import { useEffect, useState } from "react";
import { fetchUser, logout } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [sessionTimeLeft, setSessionTimeLeft] = useState(null);

  // Pobierz użytkownika i oblicz czas do końca sesji
  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUser();
      setUser(data);

      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp) {
          const expireAt = decoded.exp * 1000;
          updateTimeLeft(expireAt);
        }
      }
    };
    loadUser();
  }, []);

  // Ustaw interwał odliczania
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token);
        const expireAt = decoded.exp * 1000;
        updateTimeLeft(expireAt);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Aktualizuj licznik
  const updateTimeLeft = (expireAt) => {
    const now = Date.now();
    const diff = expireAt - now;

    if (diff <= 0) {
      logout();
      window.location.reload();
    } else {
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setSessionTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }
  };

  // Obsługa trybu ciemnego
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

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
                <p className="text-sm text-white/80">
                  Sesja wygaśnie za: {sessionTimeLeft}
                </p>
              )}
            </>
          ) : (
            <p>Ładowanie użytkownika...</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
          >
            {isDark ? " Jasny" : " Ciemny"}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
  );
};
