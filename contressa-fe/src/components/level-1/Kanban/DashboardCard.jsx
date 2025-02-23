import React from 'react';

function DashboardCard({ count, title, label, icon, amount, color }) {
  return (
    <div className="w-[22rem] h-[10rem] rounded-xl shadow-md border bg-white cursor-pointer hover:shadow-xl transition-all duration-400">
      <div
        style={{ backgroundColor: color }}
        className="p-4 rounded-t-xl flex justify-between items-center"
      >
        <div>
          <p className="text-xl font-semibold">{count}</p>
          <p className="text-sm font-medium">{title}</p>
        </div>
        {icon}
      </div>
      <div className="p-4 rounded-b-xl">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-bold">{amount}</p>
      </div>
    </div>
  );
}

export default DashboardCard;
