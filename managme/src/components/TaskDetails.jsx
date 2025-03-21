import { useState, useEffect } from "react";
import { api } from "../services/api";
import { getUsers } from "../services/userService";

export const TaskDetails = ({ taskId }) => {
	const [task, setTask] = useState(null);
	const [users, setUsers] = useState([]);
	const [assignedUser, setAssignedUser] = useState("");

	useEffect(() => {
		const task = api.getTasks().find((t) => t.id === taskId);
		setTask(task);
		setUsers(getUsers());
	}, [taskId]);

	const handleAssignUser = (userId) => {
		const updatedTask = {
			...task,
			assignedUserId: userId,
			state: "doing",
			startDate: new Date().toISOString(),
		};
		api.updateTask(updatedTask);
		setTask(updatedTask);
	};

	const handleCompleteTask = () => {
		const updatedTask = {
			...task,
			state: "done",
			endDate: new Date().toISOString(),
		};
		api.updateTask(updatedTask);
		setTask(updatedTask);
	};

	if (!task) return <div>Loading...</div>;

	return (
		<div className="border p-4">
			<h2 className="text-xl font-bold">{task.name}</h2>
			<p>{task.description}</p>
			<p>Priority: {task.priority}</p>
			<p>State: {task.state}</p>
			<p>Estimated Time: {task.estimatedTime}</p>
			<p>
				Created At:{" "}
				{new Date(
					task.createdAt
				).toLocaleString()}
			</p>
			{task.startDate && (
				<p>
					Start Date:{" "}
					{new Date(
						task.startDate
					).toLocaleString()}
				</p>
			)}
			{task.endDate && (
				<p>
					End Date:{" "}
					{new Date(
						task.endDate
					).toLocaleString()}
				</p>
			)}
			<div className="mt-4">
				<label>Assign to:</label>
				<select
					value={assignedUser}
					onChange={(e) =>
						setAssignedUser(
							e.target
								.value
						)
					}
					className="border p-2 mr-2"
				>
					<option value="">
						Select User
					</option>
					{users.map((user) => (
						<option
							key={
								user.id
							}
							value={
								user.id
							}
						>
							{
								user.firstName
							}{" "}
							{
								user.lastName
							}
						</option>
					))}
				</select>
				<button
					onClick={() =>
						handleAssignUser(
							assignedUser
						)
					}
					className="bg-blue-500 text-white p-2"
				>
					Assign
				</button>
			</div>
			<button
				onClick={handleCompleteTask}
				className="bg-green-500 text-white p-2 mt-4"
			>
				Complete Task
			</button>
		</div>
	);
};
