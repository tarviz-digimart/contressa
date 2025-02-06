"use client"
import { useState } from 'react';

const AdminView = ({ pendingApprovals, approvedRequests, rejectedRequests }) => {
  const [activeApprovalTab, setActiveApprovalTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Get the appropriate requests based on active tab
  const getActiveRequests = () => {
    switch (activeApprovalTab) {
      case 'approved':
        return approvedRequests;
      case 'rejected':
        return rejectedRequests;
      default:
        return pendingApprovals;
    }
  };

  // Get the appropriate columns based on active tab
  const getColumns = () => {
    const baseColumns = [
      { key: 'user', label: 'User' },
      { key: 'type', label: 'Type' },
      { key: 'startsOn', label: 'Starts on' },
      { key: 'endsOn', label: 'Ends on' },
      { key: 'createdAt', label: 'Created at' },
      { key: 'notes', label: 'Notes' },
    ];

    if (activeApprovalTab === 'approved') {
      return [
        ...baseColumns,
        { key: 'approvedAt', label: 'Approved at' },
        { key: 'approvedBy', label: 'Approved by' },
      ];
    } else if (activeApprovalTab === 'rejected') {
      return [
        ...baseColumns,
        { key: 'rejectedAt', label: 'Rejected at' },
        { key: 'rejectedBy', label: 'Rejected by' },
        { key: 'reason', label: 'Reason' },
      ];
    }
    return [...baseColumns, { key: 'action', label: 'Action' }];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Time Off Requests</h1>

      <div className="flex gap-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${
            activeApprovalTab === 'pending' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''
          }`}
          onClick={() => setActiveApprovalTab('pending')}
        >
          Pending
        </button>
        <button
          className={`pb-2 px-4 ${
            activeApprovalTab === 'approved' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''
          }`}
          onClick={() => setActiveApprovalTab('approved')}
        >
          Approved
        </button>
        <button
          className={`pb-2 px-4 ${
            activeApprovalTab === 'rejected' ? 'border-b-2 border-indigo-600 text-indigo-600' : ''
          }`}
          onClick={() => setActiveApprovalTab('rejected')}
        >
          Rejected
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg px-4 py-2 w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {getColumns().map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {getActiveRequests().map((request, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{request.user}</td>
                <td className="px-6 py-4">{request.type}</td>
                <td className="px-6 py-4">{request.startsOn}</td>
                <td className="px-6 py-4">{request.endsOn}</td>
                <td className="px-6 py-4">{request.createdAt}</td>
                <td className="px-6 py-4">{request.notes}</td>
                {activeApprovalTab === 'approved' && (
                  <>
                    <td className="px-6 py-4">{request.approvedAt}</td>
                    <td className="px-6 py-4">{request.approvedBy}</td>
                  </>
                )}
                {activeApprovalTab === 'rejected' && (
                  <>
                    <td className="px-6 py-4">{request.rejectedAt}</td>
                    <td className="px-6 py-4">{request.rejectedBy}</td>
                    <td className="px-6 py-4">{request.reason}</td>
                  </>
                )}
                {activeApprovalTab === 'pending' && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50">
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminView;
