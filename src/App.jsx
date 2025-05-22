import { useState, useEffect, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { ProjectForm } from "./components/ProjectForm";
import  ProjectList  from "./components/ProjectList";
import { StoryForm } from "./components/StoryForm";
import StoryList from "./components/StoryList";
import { TaskForm } from "./components/TaskForm";
import  TaskDetails  from "./components/TaskDetails";
import { KanbanBoard } from "./components/KanbanBoard";
import { Login } from "./components/Login";
import StoryDetails from "./components/StoryDetails";

import {
  fetchUser,
  logout,
  isLoggedIn,
} from "./services/authService";

import * as projectService from "./services/projectService";
import * as storyService from "./services/storyService";
import * as taskService from "./services/taskService";

export const App = () => {
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
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

  //ładowanie użytkownika
  useEffect(() => {
    const init = async () => {
      if (isLoggedIn()) {
        const me = await fetchUser();
        if (!me) return logout();
        setUser(me);
      }
    };
    init();
  }, []);

  //ładowanie projektów po zalogowaniu
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load projects:", err);
        setProjects([]);
      }
    };
    if (user) loadProjects();
  }, [user]);

  //ładowanie historyjek po wyborze projektu
  useEffect(() => {
    const loadStories = async () => {
      if (!selectedProject) return setStories([]);
      try {
        const all = await storyService.getStories();
        const arr = Array.isArray(all) ? all : [];
        setStories(arr.filter((s) => s.projectId === selectedProject._id));
      } catch (err) {
        console.error("Failed to load stories:", err);
        setStories([]);
      }
    };
    loadStories();
  }, [selectedProject, storyRefreshKey]);

  //ładowanie zadań po wyborze historyjki
  useEffect(() => {
    const loadTasks = async () => {
      if (!selectedStory) {
        setTasks([]);
        return;
      }
      try {
        const all = await taskService.getTasks();
        const arr = Array.isArray(all) ? all : [];
        setTasks(arr.filter((t) => t.storyId === selectedStory._id));
        console.log("Loaded tasks:", arr);
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setTasks([]);
      }
    };
    loadTasks();
  }, [selectedStory]);

  const handleLoginSuccess = () => {
    fetchUser().then((me) => {
      if (!me) return logout();
      setUser(me);
    });
  };

  const handleProjectAdded = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
      setProjectToEdit(null);
    } catch {
      setProjects([]);
    }
  };

  const handleCancelEdit = () => {
    setProjectToEdit(null);
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedStory(null);
    setSelectedTask(null);
    setSelectedStoryDetails(null);
  };

  const handleProjectDeleted = async () => {
    try {
      const data = await projectService.getProjects();
      setProjects(Array.isArray(data) ? data : []);
      setSelectedProject(null);
      setSelectedProject(null);
      setStories([]);
      setSelectedStory(null);
      setTasks([]);
      setSelectedTask(null);
      setSelectedStoryDetails(null);
    } catch {
      setProjects([]);
    }
  };

  const handleShowStoryDetails = (story) => {
    setSelectedStoryDetails(story);
    setTimeout(() => {
      storyDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    
    
  };

  const handleSelectStory = (story) => {
    setSelectedStory(story);
    setSelectedTask(null);
  };

  const handleShowTaskDetails = (task) => {
    setSelectedTask(task);
    setTimeout(() => {
      taskDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Projekty */}
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
                  selectedProjectId={selectedProject?._id}
                  onSelectProject={handleSelectProject}
                  onEditProject={setProjectToEdit}
                  onProjectDeleted={handleProjectDeleted}
                />
              </>
            )}
          </div>

          {/* Stories*/}
          <div>
            {selectedProject && (
              <>
                <StoryForm
                  projectId={selectedProject._id}
                  onStoryAdded={() => setStoryRefreshKey((k) => k + 1)}
                />
                <StoryList
                  projectId={selectedProject._id}
                  stories={stories}
                  onSelectStory={handleSelectStory}
                  onStoryDetails={handleShowStoryDetails}
                  refreshKey={storyRefreshKey}
                  
                />
               {selectedStoryDetails && (
  <div ref={storyDetailsRef}>
    <StoryDetails
      story={selectedStoryDetails}
      onClose={() => setSelectedStoryDetails(null)}
      onStatusChanged={(updated) => {
        setSelectedStoryDetails(updated);
        setStoryRefreshKey(k => k + 1);
      }}
    />
  </div>
)}
              </>
            )}
          </div>

          {/* taski */}
          <div>
            {selectedStory && (
              <>
                <TaskForm
                  storyId={selectedStory._id}
                  onTaskAdded={async () => {
                    try {
                      const all = await taskService.getTasks();
                      const arr = Array.isArray(all) ? all : [];
                      setTasks(arr.filter((t) => t.storyId === selectedStory._id));
                      setSelectedTask(null);
                    } catch {
                      setTasks([]);
                    }
                  }}
                />
                <KanbanBoard
                  storyId={selectedStory._id}
                  tasks={tasks}
                  onDeleteTask={async (id) => {
                    await taskService.deleteTask(id);
                    const all = await taskService.getTasks();
                    const arr = Array.isArray(all) ? all : [];
                    setTasks(arr.filter((t) => t.storyId === selectedStory._id));
                  }}
                  onShowDetails={handleShowTaskDetails}
                />
                {selectedTask && (
                  <div ref={taskDetailsRef}>
                    <TaskDetails
     taskId={selectedTask._id}
      onClose={() => setSelectedTask(null)}
      onTaskUpdated={async () => {
        const all = await taskService.getTasks();
        setTasks(all.filter((t) => t.storyId === selectedStory._id));
      }}
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

export default App;
