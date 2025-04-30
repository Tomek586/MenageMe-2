import { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectList } from "./components/ProjectList";
import { StoryForm } from "./components/StoryForm";
import { StoryList } from "./components/StoryList";
import { TaskForm } from "./components/TaskForm";
import { TaskDetails } from "./components/TaskDetails";
import { KanbanBoard } from "./components/KanbanBoard";
import { Login } from "./components/Login";
import { StoryDetails } from "./components/StoryDetails";

import { fetchUser, isLoggedIn, logout } from "./services/authService";
import { api } from "./services/api";

export const App = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState(api.getProjects());
  const [stories, setStories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [storyRefreshKey, setStoryRefreshKey] = useState(0);
  const [selectedStoryDetails, setSelectedStoryDetails] = useState(null);

  const taskDetailsRef = useRef(null);
  const storyDetailsRef = useRef(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await fetchUser();
      if (data) setUser(data);
      else logout();
    };
    if (isLoggedIn()) loadUser();
  }, []);

  // ⬇️ automatyczne wczytanie zadań po wyborze historii
  useEffect(() => {
    if (selectedStory) {
      const storyTasks = api.getTasks().filter(task => task.storyId === selectedStory.id);
      setTasks(storyTasks);
    } else {
      setTasks([]);
    }
  }, [selectedStory]);

  const handleLoginSuccess = async () => {
    const data = await fetchUser();
    setUser(data);
  };

  const handleProjectAdded = () => {
    setProjects(api.getProjects());
    setProjectToEdit(null);
  };

  const handleCancelEdit = () => {
    setProjectToEdit(null);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedStory(null);
    setSelectedTask(null);
    setSelectedStoryDetails(null);
    setTasks([]);
  };

  const handleSelectStory = (story) => {
    setSelectedStory(story);
    setSelectedTask(null);
  };

  const handleProjectDeleted = () => {
    setProjects(api.getProjects());
    setSelectedProject(null);
    setStories([]);
    setSelectedStory(null);
  };

  const handleShowTaskDetails = (task) => {
    setSelectedTask(task);
    setTimeout(() => {
      taskDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleShowStoryDetails = (story) => {
    setSelectedStoryDetails(story);
    setTimeout(() => {
      storyDetailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 bg-white dark:bg-gray-800 dark:text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* LEWA KOLUMNA – Projekty */}
          <div>
            {projectToEdit ? (
              <ProjectForm
                onProjectAdded={handleProjectAdded}
                projectToEdit={projectToEdit}
                onCancelEdit={handleCancelEdit}
              />
            ) : (
              <>
                <ProjectForm onProjectAdded={handleProjectAdded} />
                <ProjectList
                  projects={projects}
                  onSelectProject={handleSelectProject}
                  onProjectAdded={handleProjectAdded}
                  onEditProject={setProjectToEdit}
                  onProjectDeleted={handleProjectDeleted}
                />
              </>
            )}
          </div>

          {/* ŚRODKOWA KOLUMNA – Historie */}
          <div>
            {selectedProject && (
              <>
                <StoryForm
                  projectId={selectedProject.id}
                  onStoryAdded={() => {
                    setSelectedStory(null);
                    setStoryRefreshKey(prev => prev + 1);
                  }}
                />
                <StoryList
                  projectId={selectedProject.id}
                  onSelectStory={handleSelectStory}
                  onStoryDetails={handleShowStoryDetails}
                  refreshKey={storyRefreshKey}
                />
                {selectedStoryDetails && (
                  <div ref={storyDetailsRef}>
                    <StoryDetails
                      story={selectedStoryDetails}
                      onClose={() => setSelectedStoryDetails(null)}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* PRAWA KOLUMNA – Taski */}
          <div>
            {selectedStory && (
              <>
                <TaskForm
                  storyId={selectedStory.id}
                  onTaskAdded={() => {
                    const updated = api.getTasks().filter(task => task.storyId === selectedStory.id);
                    setTasks(updated);
                    setSelectedTask(null);
                  }}
                />
                <KanbanBoard
                  storyId={selectedStory.id}
                  tasks={tasks}
                  onDeleteTask={(id) => {
                    api.deleteTask(id);
                    const updated = api.getTasks().filter(task => task.storyId === selectedStory.id);
                    setTasks(updated);
                  }}
                  onShowDetails={handleShowTaskDetails}
                />
                {selectedTask && (
                  <div ref={taskDetailsRef}>
                    <TaskDetails
                      taskId={selectedTask.id}
                      onClose={() => setSelectedTask(null)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
