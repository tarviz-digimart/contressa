'use client';

import { useState } from 'react';
import { ChevronDown, Users } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4 fixed left-0 top-0">
      {/* Dropdown Selector */}
      <div className="relative w-full">
        <button className="w-full flex items-center justify-between px-4 py-2 border rounded-md bg-gray-100">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" /> Evolve Design
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Collapsible Menu */}
      <div className="mt-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between w-full px-4 py-2 text-gray-800 font-semibold hover:bg-gray-100 rounded-md"
        >
          Organization
          <ChevronDown className={`w-4 h-4 transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <ul className="pl-6 mt-2 text-gray-600">
            <li className="py-1 hover:text-gray-900 cursor-pointer">Members</li>
            <li className="py-1 hover:text-gray-900 cursor-pointer">Pending requests</li>
          </ul>
        )}
      </div>
    </aside>
  );
}
