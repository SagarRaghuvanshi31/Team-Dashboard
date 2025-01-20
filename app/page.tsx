"use client";
import { useState, useEffect } from "react";
import "./globals.css";

interface Member {
  id: number;
  name: string;
  role: string;
  bio?: string;
  tasks: Task[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
}

export default function TeamManagementApp() {
  const [teamMembers, setTeamMembers] = useState<Member[]>([]);
  const [newMember, setNewMember] = useState<{ name: string; role: string; bio: string }>({
    name: "",
    role: "",
    bio: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "To Do",
  });
  const [currentTab, setCurrentTab] = useState("Home");

  // State to track which member's tasks are expanded
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

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
        bio: newMember.bio,
        tasks: [],
      };
      setTeamMembers([...teamMembers, newMemberData]);
      setNewMember({ name: "", role: "", bio: "" });
    }
  };

  const deleteMember = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this member?");
    if (confirmDelete) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id));
    }
  };

  const addTask = (memberId: number) => {
    if (newTask.title) {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === memberId
            ? { ...member, tasks: [...member.tasks, { ...newTask, id: Date.now() }] }
            : member
        )
      );
      setNewTask({ id: 0, title: "", description: "", status: "To Do" });
    }
  };

  const deleteTask = (memberId: number, taskId: number) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? { ...member, tasks: member.tasks.filter((task) => task.id !== taskId) }
          : member
      )
    );
  };

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTaskVisibility = (memberId: number) => {
    // Toggle visibility of tasks for the clicked member
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Team Manager</h1>
        <input
          type="text"
          placeholder="Search by Name or Role"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded mb-4 text-black"
        />
        <div>
          <button
            className={`w-full text-left py-2 px-4 rounded mb-2 ${
              currentTab === "Home" ? "bg-purple-800" : "hover:bg-purple-700"
            }`}
            onClick={() => setCurrentTab("Home")}
          >
            Home
          </button>
          <button
            className={`w-full text-left py-2 px-4 rounded mb-2 ${
              currentTab === "Task Management" ? "bg-purple-800" : "hover:bg-purple-700"
            }`}
            onClick={() => setCurrentTab("Task Management")}
          >
            Task Management
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-gray-100">
        {currentTab === "Home" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Manage Your Team</h2>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Role"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Bio"
                value={newMember.bio}
                onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={addMember}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded bg-purple-600 text-white shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p>{member.role}</p>
                  <p className="text-sm mt-2">{member.bio}</p>
                  <button
                    onClick={() => deleteMember(member.id)}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Remove Member
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === "Task Management" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Task Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded bg-purple-600 text-white shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p>{member.role}</p>
                  <p className="text-sm mt-2">{member.bio}</p>

                  {/* View Task Button */}
                  <button
                    onClick={() => toggleTaskVisibility(member.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
                  >
                    {expandedMember === member.id ? "Hide Tasks" : "View Tasks"}
                  </button>

                  {/* View Tasks (Expanded) */}
                  {expandedMember === member.id && (
                    <div className="mt-4">
                      {member.tasks.length > 0 ? (
                        member.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="bg-gray-100 text-black p-2 rounded mb-2 flex justify-between"
                          >
                            <div>
                              <h4 className="font-semibold">{task.title}</h4>
                              <p className="text-sm">{task.description}</p>
                              <p className="text-xs text-gray-500">{task.status}</p>
                            </div>
                            <button
                              onClick={() => deleteTask(member.id, task.id)}
                              className="text-red-500 hover:underline"
                            >
                              Delete Task
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-300">No tasks found. Add a new task below.</p>
                      )}
                    </div>
                  )}

                  {/* Add Task Form */}
                  {expandedMember === member.id && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Add a Task</h4>
                      <input
                        type="text"
                        placeholder="Task Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full p-2 border rounded mb-2 text-black"
                      />
                      <textarea
                        placeholder="Task Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full p-2 border rounded mb-2 text-black"
                      />
                      <select
                        value={newTask.status}
                        onChange={(e) =>
                          setNewTask({ ...newTask, status: e.target.value as Task["status"] })
                        }
                        className="w-full p-2 border rounded mb-2 text-black"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        onClick={() => addTask(member.id)}
                        className="bg-blue-500 w-full text-white py-2 rounded hover:bg-blue-600"
                      >
                        Add Task
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
