"use client";

import React, { useState, useEffect } from "react";
import "../app/globals.css";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  tasks: Task[];
}

export default function Dashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({ name: "", role: "", bio: "" });
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "To Do" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showTaskManagement, setShowTaskManagement] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false); // State to toggle visibility of the form

  // Load team members from local storage
  useEffect(() => {
    const storedMembers = localStorage.getItem("teamMembers");
    if (storedMembers) setTeamMembers(JSON.parse(storedMembers));
  }, []);

  // Save team members to local storage whenever they are updated
  useEffect(() => {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Filter team members based on search query
  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addMember = () => {
    if (newMember.name && newMember.role && newMember.bio) {
      const newMemberWithId = { id: Date.now(), ...newMember, tasks: [] };
      setTeamMembers([...teamMembers, newMemberWithId]);
      setNewMember({ name: "", role: "", bio: "" });
      setIsAddMemberVisible(false); // Hide form after adding member
    }
  };

  const addTask = (memberId: number) => {
    if (newTask.title && newTask.description) {
      setTeamMembers((prev) =>
        prev.map((member) =>
          member.id === memberId
            ? {
                ...member,
                tasks: [...member.tasks, { id: Date.now(), ...newTask }],
              }
            : member
        )
      );
      setNewTask({ title: "", description: "", status: "To Do" });
    }
  };

  const deleteMember = (memberId: number) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== memberId));
    if (selectedMemberId === memberId) setSelectedMemberId(null); // Close the card if it's the selected member
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

  const toggleTasksVisibility = (memberId: number) => {
    if (selectedMemberId === memberId) {
      setSelectedMemberId(null);
    } else {
      setSelectedMemberId(memberId);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-purple-600 text-white h-screen p-6">
        <h2 className="text-3xl font-semibold mb-8">Team Manager</h2>
        <input
          type="text"
          placeholder="Search by Name or Role"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded mb-6 w-full bg-gray-100 text-black"
        />
        <nav className="space-y-5">
          <button
            onClick={() => setShowTaskManagement(false)}
            className={`block w-full text-left text-lg px-4 py-2 rounded ${!showTaskManagement ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            Home
          </button>
          <button
            onClick={() => setShowTaskManagement(true)}
            className={`block w-full text-left text-lg px-4 py-2 rounded ${showTaskManagement ? 'bg-indigo-700' : 'hover:bg-indigo-700'}`}
          >
            Task Management
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50 relative">
        {/* Add Member Button */}
        <button
          onClick={() => setIsAddMemberVisible(true)}
          className="absolute top-4 right-4 bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700"
        >
          Add Member
        </button>

        {!showTaskManagement ? (
          <>
            <h1 className="text-4xl font-semibold mb-10">Manage Your Team</h1>

            {/* Add Member Form (only visible if isAddMemberVisible is true) */}
            {isAddMemberVisible && (
              <section className="mb-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-5">Add New Member</h2>
                <div className="flex gap-6 mb-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="border p-3 rounded w-full focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="border p-3 rounded w-full focus:ring focus:ring-blue-300"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Bio"
                  value={newMember.bio}
                  onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  className="border p-3 rounded mb-4 w-full focus:ring focus:ring-blue-300"
                />
                <div className="flex justify-between">
                  <button
                    onClick={addMember}
                    className="bg-indigo-600 text-white px-5 py-3 rounded hover:bg-indigo-700"
                  >
                    Add Member
                  </button>
                  <button
                    onClick={() => setIsAddMemberVisible(false)}
                    className="bg-red-500 text-white px-5 py-3 rounded hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>
              </section>
            )}

            {/* Team Members List */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                >
                  <p className="text-lg">
                    <span className="font-bold">Name:</span> {member.name}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Role:</span> {member.role}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Bio:</span> {member.bio}
                  </p>
                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => deleteMember(member.id)}
                      className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove Member
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </>
        ) : (
          <TaskManagement
            teamMembers={teamMembers}
            deleteTask={deleteTask}
            deleteMember={deleteMember}
            addTask={addTask}
            newTask={newTask}
            setNewTask={setNewTask}
            selectedMemberId={selectedMemberId}
            setSelectedMemberId={setSelectedMemberId}
          />
        )}
      </main>
    </div>
  );
}

function TaskManagement({
  teamMembers,
  deleteTask,
  deleteMember,
  addTask,
  newTask,
  setNewTask,
  selectedMemberId,
  setSelectedMemberId,
}: {
  teamMembers: TeamMember[];
  deleteTask: (memberId: number, taskId: number) => void;
  deleteMember: (memberId: number) => void;
  addTask: (memberId: number) => void;
  newTask: Task;
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
  selectedMemberId: number | null;
  setSelectedMemberId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const toggleTasksVisibility = (memberId: number) => {
    if (selectedMemberId === memberId) {
      setSelectedMemberId(null);
    } else {
      setSelectedMemberId(memberId);
    }
  };

  return (
    <section className="flex flex-col">
      <h1 className="text-4xl font-semibold mb-10">Task Management</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
          >
            <p className="text-lg">
              <span className="font-bold">Name:</span> {member.name}
            </p>
            <p className="text-lg">
              <span className="font-bold">Role:</span> {member.role}
            </p>
            <p className="text-lg">
              <span className="font-bold">Bio:</span> {member.bio}
            </p>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => toggleTasksVisibility(member.id)}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                {selectedMemberId === member.id ? "Hide Tasks" : "View Tasks"}
              </button>
              <button
                onClick={() => deleteMember(member.id)}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Remove Member
              </button>
            </div>

            {/* Task List and Add Task Form */}
            {selectedMemberId === member.id && (
              <div className="mt-6 bg-white p-4 rounded-lg text-black">
                <ul className="space-y-4 mb-6">
                  {member.tasks.map((task) => (
                    <li
                      key={task.id}
                      className="bg-gray-100 p-4 rounded-lg shadow-md flex justify-between"
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
                    </li>
                  ))}
                </ul>

                {/* Add Task Form */}
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="border p-3 rounded w-full mb-4"
                />
                <textarea
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="border p-3 rounded w-full mb-4"
                />
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value as Task["status"] })
                  }
                  className="border p-3 rounded w-full mb-4"
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
        ))}
      </div>
    </section>
  );
}