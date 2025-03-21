import { api } from "../services/api";
import { useState, useEffect } from "react";

export const ProjectList = ({ onSelectProject, onProjectAdded, onEditProject }) => {
	const [projects, setProjects] = useState([]);
	const [selectedProjectId, setSelectedProjectId] = useState(null); // Stan dla wybranego projektu
  
	useEffect(() => {
	  setProjects(api.getProjects());
	}, [onProjectAdded]);
  
	const handleDeleteProject = (id) => {
	  api.deleteProject(id);
	  setProjects(api.getProjects()); // Odśwież listę projektów
	};
  
	const handleSelectProject = (project) => {
	  setSelectedProjectId(project.id); // Ustaw ID wybranego projektu
	  onSelectProject(project); // Przekaż wybrany projekt do komponentu nadrzędnego
	};
  
	return (
	  <div className="bg-white p-6 rounded-lg shadow-md">
		<h2 className="text-xl font-bold mb-4">Projects</h2>
		<ul>
		  {projects.map((project) => (
			<li
			  key={project.id}
			  className={`mb-4 border p-4 rounded-lg ${
				selectedProjectId === project.id ? 'bg-blue-100' : 'bg-white' // Zmień tło, jeśli projekt jest wybrany
			  }`}
			>
			  <div>
				<h3 className="font-bold text-blue-500">{project.name}</h3>
				<p className="text-gray-600">{project.description}</p>
			  </div>
			  <div className="mt-2 flex space-x-4">
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