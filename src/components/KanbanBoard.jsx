export const KanbanBoard = ({tasks, onDeleteTask, onShowDetails }) => {
  const getTasksByState = (state) => {
    return tasks.filter((task) => task.state === state);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <div className="flex space-x-4">
        {["todo", "doing", "done"].map((state) => (
          <div key={state} className="flex-1">
            <h3 className="text-lg font-bold mb-2">{state.toUpperCase()}</h3>
            <ul>
              {getTasksByState(state).map((task) => (
                <li key={task.id} className="mb-4 border p-4 rounded-lg">
                  <div>
                    <h4 className="font-bold text-blue-500">{task.name}</h4>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  <div className="mt-2 flex space-x-4">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="bg-red-500 text-black px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => onShowDetails(task)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Details
                  </button>
                </li>
                
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
