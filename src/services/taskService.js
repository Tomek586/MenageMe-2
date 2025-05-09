// src/services/taskService.js
import { API_URL } from "./config";
import { logout } from "./authService";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET /api/tasks
export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: authHeader(),
  });
  if (res.status === 401) {
    logout();
    return [];
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// POST /api/tasks
export const addTask = async (task) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// PUT /api/tasks/:id
export const updateTask = async (task) => {
  const res = await fetch(`${API_URL}/tasks/${task._id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// DELETE /api/tasks/:id
export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (res.status === 401) {
    logout();
    return;
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};
