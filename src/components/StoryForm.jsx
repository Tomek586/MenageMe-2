import { useState, useEffect } from "react";
import { fetchUser } from "../services/authService";
import * as storyService from "../services/storyService";

export const StoryForm = ({ projectId, onStoryAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      const u = await fetchUser();
      setUser(u);
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Nie załadowano użytkownika");

    const newStory = {
      name,
      description,
      priority,
      projectId,
      state: "todo",
      ownerId: user._id,
    };

    try {
      await storyService.addStory(newStory);
      onStoryAdded();
      setName("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      console.error("Błąd dodawania story:", err);
      alert("Nie udało się dodać historyjki.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Story Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <label class="block text-sm font-medium text-gray-700 dark:text-white">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={!user}
        >
          Add Story
        </button>
      </div>
    </form>
  );
};

export default StoryForm;
