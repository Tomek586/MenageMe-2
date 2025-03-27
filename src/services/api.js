class Api {
	constructor() {
		this.projectsKey = "projects";
		this.storiesKey = "stories";
		this.tasksKey = "tasks";
	}

	getItems(key) {
		const items = localStorage.getItem(key);
		return items ? JSON.parse(items) : [];
	}

	setItems(key, items) {
		localStorage.setItem(key, JSON.stringify(items));
	}

	// Projects CRUD
	getProjects() {
		return this.getItems(this.projectsKey);
	}

	addProject(project) {
		const projects = this.getProjects();
		projects.push(project);
		this.setItems(this.projectsKey, projects);
	}

	updateProject(updatedProject) {
		const projects = this.getProjects().map((p) =>
			p.id === updatedProject.id ? updatedProject : p
		);
		this.setItems(this.projectsKey, projects);
	}

	deleteProject(id) {
		const projects = this.getProjects().filter(
			(p) => p.id !== id
		);
		this.setItems(this.projectsKey, projects);
	}

	// Stories CRUD
	getStories() {
		return this.getItems(this.storiesKey);
	}

	addStory(story) {
		const stories = this.getStories();
		stories.push(story);
		this.setItems(this.storiesKey, stories);
	}

	updateStory(updatedStory) {
		const stories = this.getStories().map((s) =>
			s.id === updatedStory.id ? updatedStory : s
		);
		this.setItems(this.storiesKey, stories);
	}

	deleteStory(id) {
		const stories = this.getStories().filter(
			(s) => s.id !== id
		);
		this.setItems(this.storiesKey, stories);
	}

	// Tasks CRUD
	getTasks() {
		return this.getItems(this.tasksKey);
	}

	addTask(task) {
		const tasks = this.getTasks();
		tasks.push(task);
		this.setItems(this.tasksKey, tasks);
	}

	updateTask(updatedTask) {
		const tasks = this.getTasks().map((t) =>
			t.id === updatedTask.id ? updatedTask : t
		);
		this.setItems(this.tasksKey, tasks);
	}

	deleteTask(id) {
		const tasks = this.getTasks().filter((t) => t.id !== id);
		this.setItems(this.tasksKey, tasks);
	}
}

export const api = new Api();
