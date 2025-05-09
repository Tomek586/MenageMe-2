import React from "react";
import { deleteProject as deleteProjectService } from "../services/projectService";

const ProjectList = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onEditProject,
  onProjectDeleted,
}) => {
  const handleDeleteProject = async (id) => {
    try {
      await deleteProjectService(id);
      onProjectDeleted();
    } catch (err) {
      console.error("Nie udało się usunąć projektu:", err);
      alert("Błąd przy usuwaniu projektu.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <ul>
        {projects.map((project) => (
          <li
            key={project._id}
            className={`mb-4 border p-4 rounded-lg transition-colors cursor-pointer ${
              selectedProjectId === project._id
                ? "bg-blue-100 dark:bg-sky-800"
                : "bg-white dark:bg-gray-800"
            } dark:text-white`}
          >
            <div onClick={() => onSelectProject(project)}>
              <h3 className="font-bold text-blue-500">{project.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {project.description}
              </p>
            </div>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => onSelectProject(project)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Select
              </button>
              <button
                onClick={() => onEditProject(project)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteProject(project._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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

export default ProjectList;
