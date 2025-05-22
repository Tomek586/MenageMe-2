import React, { useState, useEffect } from "react";
import { getTasks, updateTask } from "../services/taskService";
import { getStories } from "../services/storyService";
import { getUsers } from "../services/userService";

const TaskDetails = ({ taskId, onClose, onTaskUpdated }) => {
  const [task, setTask] = useState(null);
  const [story, setStory] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUserId, setAssignedUserId] = useState("");
  const [workHours, setWorkHours] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const allTasks = await getTasks();
        const found = allTasks.find((t) => t._id === taskId);
        if (!found) return;
        setTask(found);
        setAssignedUserId(found.assignedUserId ?? "");
        setWorkHours(found.workHours ?? "");

        const allStories = await getStories();
        setStory(allStories.find((s) => s._id === found.storyId) || null);

        const us = await getUsers();
        setUsers(us);
      } catch (err) {
        console.error("Failed to load task details:", err);
      }
    };
    load();
  }, [taskId]);

  if (!task) return <div>Loading...</div>;

  const handleAssignUser = async () => {
    if (!assignedUserId) return;
    try {
      const updated = {
        ...task,
        assignedUserId,
        state: "doing",
        startDate: new Date().toISOString(),
      };
      const saved = await updateTask(updated);
      setTask(saved);
      onTaskUpdated();
    } catch (err) {
      console.error("Failed to assign user:", err);
      alert("Nie udało się przypisać użytkownika.");
    }
  };

  const handleCompleteTask = async () => {
    try {
      const updated = {
        ...task,
        state: "done",
        endDate: new Date().toISOString(),
        workHours: Number(workHours),
      };
      const saved = await updateTask(updated);
      setTask(saved);
      onTaskUpdated();
    } catch (err) {
      console.error("Failed to complete task:", err);
      alert("Nie udało się zakończyć zadania.");
    }
  };

  const assignedObj = users.find((u) => u.id === task.assignedUserId);

  return (
    <div className="border p-4 bg-white rounded shadow mt-4 dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{task.name}</h2>
        <button onClick={onClose} className="text-red-500 hover:underline">
          Close
        </button>
      </div>

      <p className="mb-2">{task.description}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.state}</p>
      <p><strong>Hours:</strong> {task.estimatedTime} h</p>
      <p><strong>Created at:</strong> {new Date(task.createdAt).toLocaleString()}</p>
      {task.startDate && (
        <p><strong>Started:</strong> {new Date(task.startDate).toLocaleString()}</p>
      )}
      {task.endDate && (
        <p><strong>Finished:</strong> {new Date(task.endDate).toLocaleString()}</p>
      )}
      {story && (
        <p><strong>Story:</strong> {story.name}</p>
      )}
      {assignedObj && (
        <p><strong>Assigned:</strong> {assignedObj.firstName} {assignedObj.lastName}</p>
      )}

      {task.state === "todo" && (
        <div className="mt-4">
          <label className="block mb-1">Assign to:</label>
          <select
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a user</option>
            {users
              .filter((u) => u.role !== "admin")
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.role})
                </option>
              ))}
          </select>
          <button
            onClick={handleAssignUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Assign and get started
          </button>
        </div>
      )}

      {task.state === "doing" && (
        <div className="mt-4">
          <label className="block mb-1">Working hours:</label>
          <input
            type="number"
            min="0"
            value={workHours}
            onChange={(e) => setWorkHours(e.target.value)}
            className="border p-2 rounded w-full mb-2 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleCompleteTask}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Finish the task
          </button>
        </div>
      )}

      {task.state === "done" && (
        <div className="mt-4">
          <p><strong>Working hours:</strong> {task.workHours} h</p>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
