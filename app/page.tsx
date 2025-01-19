"use client"
import { useState, useEffect } from "react";

interface Member {
  id: number;
  name: string;
  role: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed"; // Corrected type here
}

export default function TeamManagementApp() {
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState<{ name: string; role: string }>({
    name: "",
    role: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showTaskForm, setShowTaskForm] = useState<{ [key: number]: boolean }>({});
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "To Do",
  });

  useEffect(() => {
    const savedMembers = localStorage.getItem("teamMembers");
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
  }, [teamMembers]);

  const addMember = () => {
    if (newMember.name && newMember.role) {
      const newMemberData = {
        id: Date.now(),
        name: newMember.name,
        role: newMember.role,
        tasks: [],
      };
      setTeamMembers([...teamMembers, newMemberData]);
      setNewMember({ name: "", role: "" });
    }
  };

  const addTask = (memberId: number) => {
    if (newTask.title && newTask.description) {
      const updatedMembers = teamMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              tasks: [
                ...member.tasks,
                { ...newTask, id: Date.now(), status: newTask.status as "To Do" | "In Progress" | "Completed" }, // Correct type casting
              ],
            }
          : member
      );
      setTeamMembers(updatedMembers);
      setShowTaskForm({ ...showTaskForm, [memberId]: false });
      setNewTask({ id: 0, title: "", description: "", status: "To Do" });
    }
  };

  const deleteTask = (memberId: number, taskId: number) => {
    const updatedMembers = teamMembers.map((member) =>
      member.id === memberId
        ? {
            ...member,
            tasks: member.tasks.filter((task) => task.id !== taskId),
          }
        : member
    );
    setTeamMembers(updatedMembers);
  };

  const deleteMember = (id: number) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const toggleTaskForm = (id: number) => {
    setShowTaskForm({ ...showTaskForm, [id]: !showTaskForm[id] });
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
      <header className="w-full max-w-4xl mb-6">
        <input
          type="text"
          placeholder="Search by name or role"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 mb-4 border rounded focus:ring focus:ring-blue-300"
        />
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Member Name"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="w-full p-3 border rounded focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Role"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            className="w-full p-3 border rounded focus:ring focus:ring-blue-300"
          />
          <button
            onClick={addMember}
            className="bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700"
          >
            Add Member
          </button>
        </div>
      </header>

      {filteredMembers.map((member) => (
        <div key={member.id} className="w-full max-w-4xl p-6 mb-4 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{member.name} ({member.role})</h2>
            <button
              onClick={() => deleteMember(member.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Member
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-semibold">Tasks:</h3>
            {member.tasks.length === 0 ? (
              <p>No tasks assigned yet.</p>
            ) : (
              <ul>
                {member.tasks.map((task) => (
                  <li key={task.id} className="flex justify-between items-center mb-3">
                    <div>
                      <strong>{task.title}</strong>
                      <p>{task.description}</p>
                      <span className={`text-${task.status === "Completed" ? "green" : task.status === "In Progress" ? "yellow" : "red"}-600`}>
                        {task.status}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteTask(member.id, task.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete Task
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => toggleTaskForm(member.id)}
              className="mt-4 bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700"
            >
              {showTaskForm[member.id] ? "Cancel" : "Add Task"}
            </button>

            {showTaskForm[member.id] && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full p-3 mb-3 border rounded focus:ring focus:ring-blue-300"
                />
                <textarea
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full p-3 mb-3 border rounded focus:ring focus:ring-blue-300"
                ></textarea>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as "To Do" | "In Progress" | "Completed" })}
                  className="w-full p-3 mb-3 border rounded focus:ring focus:ring-blue-300"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={() => addTask(member.id)}
                  className="bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700"
                >
                  Add Task
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
