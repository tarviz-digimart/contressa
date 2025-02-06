"use client"
import { useState } from 'react';
import TimeOffRequest from '@/components/level-2/Requests/TimeOffRequest';

const EmployeeView = ({ timeOffRequests }) => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Time off summary</h1>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          onClick={() => setIsTimeOffDialogOpen(true)}
        >
          + Request Time Off
        </button>
      </div>

      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'list' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''
          }`}
          onClick={() => setActiveTab('list')}
        >
          List
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'calendar' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''
          }`}
          onClick={() => setActiveTab('calendar')}
        >
          Calendar
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg px-4 py-2 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Starts on</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ends on</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created at</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {timeOffRequests.map((request, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{request.type}</td>
                <td className="px-6 py-4">{request.startsOn}</td>
                <td className="px-6 py-4">{request.endsOn}</td>
                <td className="px-6 py-4">{request.createdAt}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-xs text-sm w-20 text-center ${
                      request.status === 'Approved'
                        ? 'bg-[#24b472] text-white font-semibold'
                        : request.status === 'Pending'
                        ? 'bg-[#ffc83c] text-white font-semibold'
                        : 'bg-red-400 text-white font-semibold'
                    }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-4">{request.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TimeOffRequest 
        open={isTimeOffDialogOpen} 
        onClose={() => setIsTimeOffDialogOpen(false)}
      />
    </div>
  );
};

export default EmployeeView;
