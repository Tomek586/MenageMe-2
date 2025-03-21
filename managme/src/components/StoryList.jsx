import { api } from "../services/api";
import { useState } from "react";
import { useEffect } from "react";

export const StoryList = ({ projectId, onSelectStory, onStoryAdded }) => {
	const [stories, setStories] = useState([]);

	useEffect(() => {
		const allStories = api.getStories();
		const projectStories = allStories.filter(
			(story) => story.projectId === projectId
		);
		setStories(projectStories);
	}, [projectId, onStoryAdded]);

	const handleDeleteStory = (id) => {
		api.deleteStory(id);
		setStories(
			api
				.getStories()
				.filter(
					(story) =>
						story.projectId ===
						projectId
				)
		);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold mb-4">
				Stories
			</h2>
			<ul>
				{stories.map((story) => (
					<li
						key={story.id}
						className="mb-2 flex justify-between items-center"
					>
						<button
							onClick={() =>
								onSelectStory(
									story
								)
							}
							className="text-blue-500 hover:text-blue-700"
						>
							{
								story.name
							}
						</button>
						<button
							onClick={() =>
								handleDeleteStory(
									story.id
								)
							}
							className="text-red-500 hover:text-red-700"
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};
