import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectList } from "./components/ProjectList";
import { StoryForm } from "./components/StoryForm";
import { StoryList } from "./components/StoryList";
import { TaskForm } from "./components/TaskForm";
import { TaskDetails } from "./components/TaskDetails";
import { KanbanBoard } from "./components/KanbanBoard";

export const App = () => {
	const [selectedProject, setSelectedProject] = useState(null);
	const [selectedStory, setSelectedStory] = useState(null);
	const [selectedTask, setSelectedTask] = useState(null);
	const [projectToEdit, setProjectToEdit] = useState(null);

	const handleProjectAdded = () => {
		setSelectedProject(null);
		setProjectToEdit(null); // Resetuj edycję po dodaniu/edycji projektu
	};

	const handleCancelEdit = () => {
		setProjectToEdit(null); // Anuluj edycję
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar />
			<div className="container mx-auto p-4">
				<div className="grid grid-cols-3 gap-4">
					<div>
						{projectToEdit ? (
							<ProjectForm
								onProjectAdded={
									handleProjectAdded
								}
								projectToEdit={
									projectToEdit
								}
								onCancelEdit={
									handleCancelEdit
								}
							/>
						) : (
							<>
								<ProjectForm
									onProjectAdded={
										handleProjectAdded
									}
								/>
								<ProjectList
									onSelectProject={
										setSelectedProject
									}
									onProjectAdded={
										handleProjectAdded
									}
									onEditProject={
										setProjectToEdit
									}
								/>
							</>
						)}
					</div>
					<div>
						{selectedProject && (
							<>
								<StoryForm
									projectId={
										selectedProject.id
									}
									onStoryAdded={() =>
										setSelectedStory(
											null
										)
									}
								/>
								<StoryList
									projectId={
										selectedProject.id
									}
									onSelectStory={
										setSelectedStory
									}
								/>
							</>
						)}
					</div>
					<div>
						{selectedStory && (
							<>
								<TaskForm
									storyId={
										selectedStory.id
									}
									onTaskAdded={() =>
										setSelectedTask(
											null
										)
									}
								/>
								<KanbanBoard
									projectId={
										selectedProject.id
									}
								/>
							</>
						)}
					</div>
				</div>
				{selectedTask && (
					<TaskDetails
						taskId={
							selectedTask.id
						}
					/>
				)}
			</div>
		</div>
	);
};
