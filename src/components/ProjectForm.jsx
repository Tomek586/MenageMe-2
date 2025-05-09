import { useState, useEffect } from "react";
import * as projectService from "../services/projectService";

export const ProjectForm = ({
  onProjectAdded,
  projectToEdit,
  onCancelEdit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // uzupelnia pola projektu przy edycji
  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [projectToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (projectToEdit) {
        await projectService.updateProject({
          _id: projectToEdit._id,
          name,
          description,
        });
      } else {
        await projectService.addProject({ name, description });
      }

      onProjectAdded();
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Nie udało się zapisać projektu:", err);
      alert("Wystąpił błąd podczas zapisywania projektu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {projectToEdit ? "Update Project" : "Add Project"}
          </button>
          {projectToEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
