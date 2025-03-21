import { useState } from "react";
import { api } from "../services/api";

export const TaskForm = ({ storyId, onTaskAdded }) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("low");
	const [estimatedTime, setEstimatedTime] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const newTask = {
			id: Date.now(),
			name,
			description,
			priority,
			storyId,
			estimatedTime,
			state: "todo",
			createdAt: new Date().toISOString(),
		};
		api.addTask(newTask);
		onTaskAdded();
		setName("");
		setDescription("");
		setEstimatedTime("");
	};

	return (
		<form onSubmit={handleSubmit} className="mb-4">
			<input
				type="text"
				placeholder="Task Name"
				value={name}
				onChange={(e) =>
					setName(e.target.value)
				}
				className="border p-2 mr-2"
				required
			/>
			<input
				type="text"
				placeholder="Description"
				value={description}
				onChange={(e) =>
					setDescription(e.target.value)
				}
				className="border p-2 mr-2"
				required
			/>
			<select
				value={priority}
				onChange={(e) =>
					setPriority(e.target.value)
				}
				className="border p-2 mr-2"
			>
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
			<input
				type="text"
				placeholder="Estimated Time"
				value={estimatedTime}
				onChange={(e) =>
					setEstimatedTime(
						e.target.value
					)
				}
				className="border p-2 mr-2"
				required
			/>
			<button
				type="submit"
				className="bg-blue-500 text-white p-2"
			>
				Add Task
			</button>
		</form>
	);
};
