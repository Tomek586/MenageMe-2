export const KanbanBoard = ({ tasks, onDeleteTask, onShowDetails }) => {
  const getTasksByState = (state) =>
    Array.isArray(tasks) ? tasks.filter((task) => task.state === state) : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <div className="flex space-x-4">
        {["todo", "doing", "done"].map((state) => (
          <div key={state} className="flex-1">
            <h3 className="text-lg font-bold mb-2">{state.toUpperCase()}</h3>
            <ul>
              {getTasksByState(state).map((task) => (
                <li
                  key={task._id}
                  className="mb-4 border p-4 rounded-lg dark:border-gray-700"
                >
                  <div>
                    <h4 className="font-bold text-blue-500">{task.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {task.description}
                    </p>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => onShowDetails(task)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onDeleteTask(task._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
