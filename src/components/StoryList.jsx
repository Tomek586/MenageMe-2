import { useEffect, useState } from "react";
import {
  getStories,
  deleteStory as deleteStoryService,
} from "../services/storyService";

export const StoryList = ({
  projectId,
  onSelectStory,
  onStoryDetails,
  refreshKey,
}) => {
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      if (!projectId) {
        setStories([]);
        return;
      }
      try {
        const all = await getStories();
        setStories(
          (Array.isArray(all) ? all : []).filter((s) => s.projectId === projectId)
        );
      } catch (err) {
        console.error("Failed to load stories:", err);
        setStories([]);
      }
    };
    load();
  }, [projectId, refreshKey]);

  const handleDeleteStory = async (id) => {
    try {
      await deleteStoryService(id);
      const all = await getStories();
      setStories(
        (Array.isArray(all) ? all : []).filter((s) => s.projectId === projectId)
      );
      setSelectedStoryId(null);
      onSelectStory(null);
    } catch (err) {
      console.error("Failed to delete story:", err);
    }
  };

  const handleSelectStory = (story) => {
    setSelectedStoryId(story._id);
    onSelectStory(story);
  };

  const filteredStories =
    filter === "all" ? stories : stories.filter((s) => s.state === filter);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stories</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All</option>
          <option value="todo">To do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
      </div>
      <ul>
        {filteredStories.map((story) => (
          <li
            key={story._id}
            className={`mb-4 border p-4 rounded-lg transition-colors ${
              selectedStoryId === story._id
                ? "bg-blue-100 dark:bg-sky-800"
                : "bg-white dark:bg-gray-800"
            } dark:text-white`}
          >
            <h3 className="font-bold text-blue-500">{story.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">{story.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <strong>Status:</strong> {story.state}
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleSelectStory(story)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Select
              </button>
              <button
                onClick={() => handleDeleteStory(story._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => onStoryDetails(story)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default StoryList;
