import { useState } from "react";
import * as taskService from "../services/taskService";

export const TaskForm = ({ storyId, onTaskAdded }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      name,
      description,
      priority,
      estimatedTime: Number(estimatedTime),
      storyId,
      // backend ustawia reszte
    };

    try {
      await taskService.addTask(newTask);
      onTaskAdded();
      setName("");
      setDescription("");
      setPriority("medium");
      setEstimatedTime("");
    } catch (err) {
      console.error("Nie udało się dodać zadania:", err);
      alert("Wystąpił błąd podczas dodawania zadania.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
          <label class="block text-sm font-medium text-gray-700 dark:text-white">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="number"
          placeholder="Hours"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 "
          required
          min="0"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
