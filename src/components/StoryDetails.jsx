import React, { useEffect, useState } from "react";
import * as storyService from "../services/storyService";
import { getUsers } from "../services/userService";

const StoryDetails = ({ story, onClose, onStatusChanged }) => {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const loadOwner = async () => {
      try {
        const us = await getUsers();
        if (Array.isArray(us)) {
          const found = us.find((u) => u.id === story.ownerId);
          setOwner(found || null);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    loadOwner();
  }, [story.ownerId]);

  const handleStatusChange = async (newState) => {
    try {
      const updated = { ...story, state: newState };
      const saved = await storyService.updateStory(updated);
      onStatusChanged(saved);
    } catch (err) {
      console.error("Failed to update story:", err);
      alert("Nie udało się zmienić statusu historyjki.");
    }
  };

  return (
    <div className="bg-white border p-6 mt-4 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{story.name}</h2>
        <button onClick={onClose} className="text-red-500 hover:underline">
          Zamknij
        </button>
      </div>

      <p className="mb-2 dark:text-gray-300">{story.description}</p>
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
            className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
          >
            Oznacz jako „doing”
          </button>
        )}
        {story.state !== "done" && (
          <button
            onClick={() => handleStatusChange("done")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Oznacz jako „done”
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryDetails;
