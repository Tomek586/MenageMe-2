import { api } from "../services/api";
import { useState } from "react";
import { useEffect } from "react";
export const ProjectList = ({
	onSelectProject,
	onProjectAdded,
	onEditProject,
}) => {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		setProjects(api.getProjects());
	}, [onProjectAdded]);

	const handleDeleteProject = (id) => {
		api.deleteProject(id);
		setProjects(api.getProjects()); // Odśwież listę projektów
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold mb-4">
				Projects
			</h2>
			<ul>
				{projects.map((project) => (
					<li
						key={project.id}
						className="mb-4 border p-4 rounded-lg"
					>
						<div>
							<h3 className="font-bold text-blue-500">
								{
									project.name
								}
							</h3>
							<p className="text-gray-600">
								{
									project.description
								}
							</p>
						</div>
						<div className="mt-2 flex space-x-2">
							<button
								onClick={() =>
									onSelectProject(
										project
									)
								}
								className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
							>
								Select
							</button>
							<button
								onClick={() =>
									onEditProject(
										project
									)
								}
								className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
							>
								Edit
							</button>
							<button
								onClick={() =>
									handleDeleteProject(
										project.id
									)
								}
								className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
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
