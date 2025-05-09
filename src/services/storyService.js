import { API_URL } from "./config";
import { logout } from "./authService";

// helper to build the auth header
function authHeader() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// GET /api/stories
export const getStories = async () => {
  const res = await fetch(`${API_URL}/stories`, {
    headers: { ...authHeader() },
  });
  if (res.status === 401) {
    logout();           
    return [];
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// POST /api/stories
export const addStory = async (story) => {
  const res = await fetch(`${API_URL}/stories`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(story),
  });
  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// PUT /api/stories/:id
export const updateStory = async (story) => {
  const res = await fetch(`${API_URL}/stories/${story._id}`, {
    method: "PUT",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify(story),
  });
  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// DELETE /api/stories/:id
export const deleteStory = async (id) => {
  const res = await fetch(`${API_URL}/stories/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (res.status === 401) {
    logout();
    return;
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};
