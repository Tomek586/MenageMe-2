import { useEffect, useState } from "react";
import { api } from "../services/api";
import { getUsers } from "../services/userService";

export const StoryDetails = ({ story, onClose }) => {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const users = getUsers();
    const found = users.find((u) => u.id === story.ownerId);
    setOwner(found);
  }, [story]);

  const handleStatusChange = (newState) => {
    const updated = { ...story, state: newState };
    api.updateStory(updated);
    window.location.reload(); 
  };

  return (
    <div className="bg-white border p-6 mt-4 rounded-lg shadow-md dark:bg-gray-800 dark:text-white dark:border-black dark:border-3 ">
      <h2 className="text-xl font-bold mb-2">{story.name}</h2>
      <p className="text-gray-600 mb-2">{story.description}</p>
      <p><strong>Priorytet:</strong> {story.priority}</p>
      <p><strong>Status:</strong> {story.state}</p>
      <p><strong>Data utworzenia:</strong> {new Date(story.createdAt).toLocaleString()}</p>
      {owner && (
        <p><strong>Właściciel:</strong> {owner.firstName} {owner.lastName}</p>
      )}

      <div className="flex gap-4 mt-4">
        {story.state !== "doing" && (
          <button
            onClick={() => handleStatusChange("doing")}
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            Oznacz jako "doing"
          </button>
        )}
        {story.state !== "done" && (
          <button
            onClick={() => handleStatusChange("done")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Oznacz jako "done"
          </button>
        )}
        <button
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Zamknij
        </button>
      </div>
    </div>
  );
};
