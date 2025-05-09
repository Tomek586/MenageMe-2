import { API_URL } from "./config";

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const { accessToken, refreshToken } = await res.json();
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const loginWithGoogle = async (token) => {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Google login failed");
  const { accessToken, refreshToken } = await res.json();
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const fetchUser = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
};

export const refreshToken = async () => {
  const token = localStorage.getItem("refreshToken");
  if (!token) return;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (res.ok) {
    const { accessToken } = await res.json();
    localStorage.setItem("accessToken", accessToken);
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isLoggedIn = () => !!localStorage.getItem("accessToken");
