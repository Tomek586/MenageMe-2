import { API_URL } from "./config";
import { logout } from "./authService";


export const getProjects = async () => {
    const res = await fetch(`${API_URL}/projects`, {
      headers: authHeader(),
    });
    if (res.status === 401) {
      logout();
      return [];
    }
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    return res.json(); 
  };

  export const addProject = async (p) => {
    const res = await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (res.status === 401) {
      logout(); 
      throw new Error("Unauthorized");
    }
    return res.json();
  };

export const updateProject = (p) =>
  fetch(`${API_URL}/projects/${p._id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(p),
  }).then((r) => r.json());

export const deleteProject = (id) =>
  fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  function authHeader() {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
