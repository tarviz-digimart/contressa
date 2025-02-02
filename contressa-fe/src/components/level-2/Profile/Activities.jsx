import React from "react";

function Activities() {
  const workPlaces = [
    { id: 1, name: "Tarviz Digimart", logo: "/jira-logo-1.png" },
    { id: 2, name: "Learn Jira in 10 minutes 👋", logo: "/jira-logo-2.png" },
  ];

  return (
    <div className="mx-auto p-6">
      <h2 className="text-b3 font-semibold">Activities</h2>
      <div className="mt-4">
        {workPlaces.map((place) => (
          <div
            key={place.id}
            className="flex items-center bg-white border-8 shadow-sm p-3"
          >
            <img src={"/next.svg"} alt="Jira Logo" className="w-8 h-8 mr-3" />
            <div>
              <span className="text-sm text-gray-500">Jira</span>
              <h3 className="text-base font-medium text-blue-600 hover:underline">
                {place.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activities;
