import React from "react";

type TaskProps = {
  task: { id: number; title: string; description: string };
  deleteTask: (taskId: number) => void;
};

const Task = ({ task, deleteTask }: TaskProps) => (
  <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
    <h3 className="text-lg font-semibold">{task.title}</h3>
    <p>{task.description}</p>
    <button
      onClick={() => deleteTask(task.id)}
      className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
    >
      Delete Task
    </button>
  </div>
);

export default Task;