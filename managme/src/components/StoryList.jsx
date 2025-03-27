import { api } from "../services/api";
import { useEffect, useState } from "react";

export const StoryList = ({ projectId, onSelectStory, onStoryDetails, refreshKey }) => {
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const allStories = api.getStories();
    const filtered = allStories.filter((story) => story.projectId === projectId);
    setStories(filtered);
  }, [projectId, refreshKey]);

  const handleDeleteStory = (id) => {
    api.deleteStory(id);
    const updated = api.getStories().filter((s) => s.projectId === projectId);
    setStories(updated);
    setSelectedStoryId(null);
    onSelectStory(null);
  };

  const handleSelectStory = (story) => {
    setSelectedStoryId(story.id);
    onSelectStory(story);
  };

  const filteredStories =
    filter === "all" ? stories : stories.filter((story) => story.state === filter);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stories</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">Wszystkie</option>
          <option value="todo">Do zrobienia</option>
          <option value="doing">W trakcie</option>
          <option value="done">Zrobione</option>
        </select>
      </div>

      <ul>
        {filteredStories.map((story) => (
          <li
            key={story.id}
            className={`mb-4 border p-4 rounded-lg ${
              selectedStoryId === story.id ? "bg-blue-100" : "bg-white"
            }`}
          >
            <div>
              <h3 className="font-bold text-blue-500">{story.name}</h3>
              <p className="text-gray-600">{story.description}</p>
              <p className="text-sm text-gray-500">Status: {story.state}</p>
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleSelectStory(story)}
                className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Select
              </button>
              <button
                onClick={() => handleDeleteStory(story.id)}
                className="bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => onStoryDetails(story)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
