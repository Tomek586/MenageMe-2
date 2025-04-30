const API_URL = "http://localhost:3001";

export const login = async (login, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials");

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
};

export const fetchUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Token nieważny lub błąd serwera.");
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Błąd pobierania użytkownika:", err);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("accessToken");
};
