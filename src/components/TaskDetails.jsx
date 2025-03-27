import { useState, useEffect } from "react";
import { api } from "../services/api";
import { getUsers } from "../services/userService";

export const TaskDetails = ({ taskId, onClose }) => {
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState("");
  const [workHours, setWorkHours] = useState("");

  useEffect(() => {
    const loadedTask = api.getTasks().find((t) => t.id === taskId);
    setTask(loadedTask);
    setUsers(getUsers());
    setAssignedUser(loadedTask?.assignedUserId || "");
    setWorkHours(loadedTask?.workHours || "");
  }, [taskId]);

  const handleAssignUser = () => {
    if (!assignedUser) return;
    const updatedTask = {
      ...task,
      assignedUserId: assignedUser,
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
      workHours: workHours,
    };
    api.updateTask(updatedTask);
    setTask(updatedTask);
  };

  if (!task) return <div>Loading...</div>;

  const assignedUserObj = users.find((u) => u.id === Number(task.assignedUserId));
  const story = api.getStories().find((s) => s.id === task.storyId);

  return (
    <div className="border p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-2">{task.name}</h2>
      <p className="text-gray-700 mb-2">{task.description}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Status:</strong> {task.state}</p>
      <p><strong>Estimated Time:</strong> {task.estimatedTime}</p>
      <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
      {task.startDate && (
        <p><strong>Start Date:</strong> {new Date(task.startDate).toLocaleString()}</p>
      )}
      {task.endDate && (
        <p><strong>End Date:</strong> {new Date(task.endDate).toLocaleString()}</p>
      )}
      {story && (
        <p><strong>Related Story:</strong> {story.name}</p>
      )}
      {assignedUserObj && (
        <p><strong>Assigned To:</strong> {assignedUserObj.firstName} {assignedUserObj.lastName}</p>
      )}

      {task.state === "todo" && (
        <div className="mt-4">
          <label className="block mb-1">Assign to:</label>
          <select
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
            className="border p-2 rounded mb-2"
          >
            <option value="">Select User</option>
            {users
              .filter((u) => u.role !== "admin")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName} ({user.role})
                </option>
              ))}
          </select>
          <button
            onClick={handleAssignUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Assign & Start
          </button>
        </div>
      )}

      {task.state === "doing" && (
        <div className="mt-4">
          <label className="block mb-1">Work Hours:</label>
          <input
            type="number"
            min="0"
            value={workHours}
            onChange={(e) => setWorkHours(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleCompleteTask}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Complete Task
          </button>
        </div>
      )}

      {task.state === "done" && (
        <div className="mt-4">
          <p><strong>Work Hours:</strong> {task.workHours} h</p>
        </div>
      )}

      <div className="mt-6">
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
