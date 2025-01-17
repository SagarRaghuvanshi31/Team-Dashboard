// app/pages/dashboard.tsx

import React from "react";

const Dashboard = () => {
  const teamMembers = [
    { id: 1, name: "Alice", role: "Developer", bio: "Loves coding." },
    { id: 2, name: "Bob", role: "Designer", bio: "Creates amazing UI." },
    { id: 3, name: "Charlie", role: "Manager", bio: "Keeps the team on track." },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-blue-500 text-white h-screen p-4">
        <h2 className="text-2xl font-bold mb-6">Team Dashboard</h2>
        <nav className="space-y-4">
          <button className="block w-full text-left">Home</button>
          <button className="block w-full text-left">Task Management</button>
          <button className="block w-full text-left">Add Member</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <input
          type="text"
          placeholder="Search by name or role..."
          className="w-full p-2 border border-gray-300 rounded mb-6"
        />
        <div className="grid grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="border rounded-lg p-4 shadow hover:shadow-md"
            >
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
              <p className="text-sm text-gray-500">{member.bio}</p>
              <div className="mt-4 flex justify-between">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  View Tasks
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
