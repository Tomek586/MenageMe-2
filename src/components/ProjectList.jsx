import { api } from "../services/api";
import { useState } from "react";

export const ProjectList = ({ projects, onSelectProject, onEditProject, onProjectDeleted  }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleDeleteProject = (id) => {
	api.deleteProject(id);
	setSelectedProjectId(null);
	onProjectDeleted(); 
  };
  const handleSelectProject = (project) => {
    setSelectedProjectId(project.id);
    onSelectProject(project);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white  ">
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={`mb-4 border p-4 rounded-lg dark:bg-gray-800 dark:text-white dark:border-black dark:border-3 ${
              selectedProjectId === project.id ? "dark:bg-sky-800 bg-blue-100" : "bg-white"
            }`}
          >
            <div>
              <h3 className="font-bold text-blue-500">{project.name}</h3>
              <p className="text-gray-600 dark:text-white">{project.description}</p>
            </div>
            <div className="mt-2 flex space-x-4 ">
              <button
                onClick={() => handleSelectProject(project)}
                className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
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
                onClick={() => handleDeleteProject(project.id)}
                className="bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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
