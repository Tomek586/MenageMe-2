import { useState } from "react";
import { api } from "../services/api";

export const StoryForm = ({ projectId, onStoryAdded }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("low");

	const handleSubmit = (e) => {
		e.preventDefault();
		const newStory = {
			id: Date.now(),
			name,
			description,
			priority,
			projectId,
			state: "todo",
			createdAt: new Date().toISOString(),
			ownerId: 1, // Mocked user ID
		};
		api.addStory(newStory);
		onStoryAdded(); // Wywołaj tę funkcję, aby odświeżyć listę historii
		setName("");
		setDescription("");
	};

	return (
		<form onSubmit={handleSubmit} className="mb-6">
			<div className="grid grid-cols-1 gap-4">
				<input
					type="text"
					placeholder="Story Name"
					value={name}
					onChange={(e) =>
						setName(
							e.target
								.value
						)
					}
					className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<input
					type="text"
					placeholder="Description"
					value={description}
					onChange={(e) =>
						setDescription(
							e.target
								.value
						)
					}
					className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<select
					value={priority}
					onChange={(e) =>
						setPriority(
							e.target
								.value
						)
					}
					className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="low">
						Low
					</option>
					<option value="medium">
						Medium
					</option>
					<option value="high">
						High
					</option>
				</select>
				<button
					type="submit"
					className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
				>
					Add Story
				</button>
			</div>
		</form>
	);
};
