import React, { useState } from "react";
import Task from "./Task"; // Import the Task component

// Defining Task type
type Task = {
  id: number;
  title: string;
  description: string;
};

const Index = () => {
  // State to hold the list of tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Task 1", description: "This is the first task" },
    { id: 2, title: "Task 2", description: "This is the second task" },
  ]);

  // Function to delete a task by id
  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>
      <div>
        {tasks.map((task) => (
          <Task key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      </div>
    </div>
  );
};

export default Index;
