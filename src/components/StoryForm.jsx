import { useState, useEffect } from "react";
import { fetchUser } from "../services/authService";
import * as storyService from "../services/storyService";

export const StoryForm = ({ projectId, onStoryAdded, storyToEdit, onCancelEdit }) => {
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
  useEffect(() => {
  if (storyToEdit) {
    setName(storyToEdit.name);
    setDescription(storyToEdit.description);
    setPriority(storyToEdit.priority);
  } else {
    setName("");
    setDescription("");
    setPriority("medium");
  }
}, [storyToEdit]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    name,
    description,
    priority,
    projectId,
    state: storyToEdit ? storyToEdit.state : "todo",
    ownerId: user._id,
    _id: storyToEdit?._id
  };
  if (storyToEdit) {
    await storyService.updateStory(payload);
  } else {
    await storyService.addStory(payload);
  }
  onStoryAdded();
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
      <div className="flex space-x-2">
  <button
    type="submit"
    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
    disabled={!user}
  >
    {storyToEdit ? "Update Story" : "Add Story"}
  </button>
  {storyToEdit && (
    <button
      type="button"
      onClick={onCancelEdit}
      className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
    >
      Cancel
    </button>
  )}
</div>
      </div>
    </form>
  );
};

export default StoryForm;
