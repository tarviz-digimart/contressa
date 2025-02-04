"use client"

import React, { useState } from "react";

function Projects() {
  const [showAll, setShowAll] = useState(false);
  const data = [
    {
      title: "Poster for Republic Day",
      author: "Tarviz Digimart",
      date: "28 January 2025",
    },
    {
      title: "You’re a contressa pro. What’s next?",
      author: "Learn contressa in 10 minutes 🔥",
      date: "28 January 2025",
    },
    {
      title:
        "Workflows 101: How to work smart with insights and automations 🧠",
      author: "Learn contressa in 10 minutes 🔥",
      date: "28 January 2025",
    },
    {
      title:
        "Teams 101: How to boost teamwork using invites and permissions 👬",
      author: "Learn contressa in 10 minutes 🔥",
      date: "28 January 2025",
    },
    {
      title: "Issues 101: How to write excellent tasks your team will love ✨",
      author: "Learn contressa in 10 minutes 🔥",
      date: "28 January 2025",
    },
    {
      title: "Extra Item (Shouldn't Show)",
      author: "Hidden Item",
      date: "28 January 2025",
    },
  ];

  return (
    <div className="p-6 w-full space-y-6">
      <div className="flex justify-between">
        <div>
          <h2 className="text-b3 font-semibold">Projects</h2>
          <p className="text-b2 font-thin">
            Others will see what they can access
          </p>
        </div>
        <h3>View all</h3>
      </div>
      <div className="bg-white p-4 shadow-lg rounded-md border border-gray-200">
        {data.slice(0, showAll ? data.length : 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 border-b py-3 last:border-b-0"
          >
            <div>
              <p className="font-medium text-gray-800">{item.title}</p>
              <p className="text-sm text-gray-500">
                {item.author} • {item.date}
              </p>
            </div>
          </div>
        ))}
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-blue-600 text-sm hover:underline"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}

export default Projects;
