import { api } from "../services/api";
import { useState } from "react";
import { useEffect } from "react";

export const StoryList = ({ projectId, onSelectStory, onStoryAdded }) => {
	const [stories, setStories] = useState([]);
	const [selectedStoryId, setSelectedStoryId] = useState(null); // Stan dla wybranej historii
  
	useEffect(() => {
	  const allStories = api.getStories();
	  const projectStories = allStories.filter(story => story.projectId === projectId);
	  setStories(projectStories);
	}, [projectId, onStoryAdded]);
  
	const handleDeleteStory = (id) => {
	  api.deleteStory(id);
	  setStories(api.getStories().filter(story => story.projectId === projectId)); // Odśwież listę historii
	};
  
	const handleSelectStory = (story) => {
	  setSelectedStoryId(story.id); // Ustaw ID wybranej historii
	  onSelectStory(story); // Przekaż wybraną historię do komponentu nadrzędnego
	};
  
	return (
	  <div className="bg-white p-6 rounded-lg shadow-md">
		<h2 className="text-xl font-bold mb-4">Stories</h2>
		<ul>
		  {stories.map((story) => (
			<li
			  key={story.id}
			  className={`mb-4 border p-4 rounded-lg ${
				selectedStoryId === story.id ? 'bg-blue-100' : 'bg-white' // Zmień tło, jeśli historia jest wybrana
			  }`}
			>
			  <div>
				<h3 className="font-bold text-blue-500">{story.name}</h3>
				<p className="text-gray-600">{story.description}</p>
			  </div>
			  <div className="mt-2 flex space-x-4">
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
			  </div>
			</li>
		  ))}
		</ul>
	  </div>
	);
  };