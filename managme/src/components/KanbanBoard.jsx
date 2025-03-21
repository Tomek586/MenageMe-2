import { api } from "../services/api";
import { useState } from "react";
import { useEffect } from "react";
export const KanbanBoard = ({ projectId }) => {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		const allTasks = api.getTasks();
		const projectTasks = allTasks.filter((task) => {
			const story = api
				.getStories()
				.find((s) => s.id === task.storyId);
			return story && story.projectId === projectId;
		});
		setTasks(projectTasks);
	}, [projectId]);

	const handleDeleteTask = (id) => {
		api.deleteTask(id);
		setTasks(
			api.getTasks().filter((task) => {
				const story = api
					.getStories()
					.find(
						(s) =>
							s.id ===
							task.storyId
					);
				return (
					story &&
					story.projectId === projectId
				);
			})
		);
	};

	const getTasksByState = (state) => {
		return tasks.filter((task) => task.state === state);
	};

	return (
		<div className="flex space-x-4">
			{["todo", "doing", "done"].map((state) => (
				<div key={state} className="flex-1">
					<h2 className="text-xl font-bold mb-4">
						{state.toUpperCase()}
					</h2>
					{getTasksByState(state).map(
						(task) => (
							<div
								key={
									task.id
								}
								className="border p-2 mb-2 flex justify-between items-center"
							>
								<div>
									<h3 className="font-bold">
										{
											task.name
										}
									</h3>
									<p>
										{
											task.description
										}
									</p>
								</div>
								<button
									onClick={() =>
										handleDeleteTask(
											task.id
										)
									}
									className="text-red-500 hover:text-red-700"
								>
									Delete
								</button>
							</div>
						)
					)}
				</div>
			))}
		</div>
	);
};
