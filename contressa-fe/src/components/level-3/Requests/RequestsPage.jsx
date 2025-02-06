"use client"
import AdminView from '../../level-2/Requests/AdminView';
import EmployeeView from '../../level-2/Requests/EmployeeView';
const RequestsPage = () => {
  // Mock data for time off requests
  const timeOffRequests = [
    {
      type: 'Personal',
      startsOn: '25/2/2024',
      endsOn: '28/2/2024',
      createdAt: '18/2/2024',
      status: 'Pending',
      notes: 'Annual leave in advance',
    },
    {
      type: 'Sick Leave',
      startsOn: '15/3/2024',
      endsOn: '16/3/2024',
      createdAt: '10/3/2024',
      status: 'Approved',
      notes: 'Medical appointment',
    },
    {
      type: 'Vacation',
      startsOn: '1/4/2024',
      endsOn: '7/4/2024',
      createdAt: '15/2/2024',
      status: 'Approved',
      notes: 'Family vacation',
    },
    {
      type: 'Personal',
      startsOn: '12/3/2024',
      endsOn: '12/3/2024',
      createdAt: '1/3/2024',
      status: 'Rejected',
      notes: 'Personal errands',
    },
    {
      type: 'Work From Home',
      startsOn: '20/3/2024',
      endsOn: '22/3/2024',
      createdAt: '5/3/2024',
      status: 'Pending',
      notes: 'Internet installation at home',
    },
    {
      type: 'Sick Leave',
      startsOn: '8/3/2024',
      endsOn: '9/3/2024',
      createdAt: '7/3/2024',
      status: 'Approved',
      notes: 'Not feeling well',
    },
    {
      type: 'Personal',
      startsOn: '18/3/2024',
      endsOn: '19/3/2024',
      createdAt: '1/3/2024',
      status: 'Pending',
      notes: 'Family event',
    },
    {
      type: 'Vacation',
      startsOn: '15/4/2024',
      endsOn: '22/4/2024',
      createdAt: '1/3/2024',
      status: 'Approved',
      notes: 'Spring break vacation',
    },
  ];

  const pendingApprovals = [
    {
      user: 'Vincy',
      type: 'Personal',
      startsOn: '25/2/2024',
      endsOn: '28/2/2024',
      createdAt: '18/2/2024',
      notes: 'Annual leave in advance',
    },
    {
      user: 'John Smith',
      type: 'Vacation',
      startsOn: '1/4/2024',
      endsOn: '7/4/2024',
      createdAt: '15/2/2024',
      notes: 'Family vacation planned',
    },
    {
      user: 'Sarah Johnson',
      type: 'Sick Leave',
      startsOn: '12/3/2024',
      endsOn: '14/3/2024',
      createdAt: '10/3/2024',
      notes: 'Doctor appointment',
    },
    {
      user: 'Mike Wilson',
      type: 'Work From Home',
      startsOn: '20/3/2024',
      endsOn: '22/3/2024',
      createdAt: '5/3/2024',
      notes: 'Home office setup',
    },
    {
      user: 'Emily Brown',
      type: 'Personal',
      startsOn: '18/3/2024',
      endsOn: '19/3/2024',
      createdAt: '1/3/2024',
      notes: 'Family event',
    },
    {
      user: 'David Lee',
      type: 'Vacation',
      startsOn: '15/4/2024',
      endsOn: '22/4/2024',
      createdAt: '1/3/2024',
      notes: 'Spring break plans',
    },
    {
      user: 'Lisa Anderson',
      type: 'Sick Leave',
      startsOn: '11/3/2024',
      endsOn: '11/3/2024',
      createdAt: '10/3/2024',
      notes: 'Dental appointment',
    },
    {
      user: 'James Wilson',
      type: 'Personal',
      startsOn: '13/3/2024',
      endsOn: '13/3/2024',
      createdAt: '1/3/2024',
      notes: 'Personal appointment',
    },
  ];

  // Add new mock data for approved and rejected requests
  const approvedRequests = [
    {
      user: 'Alex Thompson',
      type: 'Vacation',
      startsOn: '10/3/2024',
      endsOn: '15/3/2024',
      createdAt: '1/2/2024',
      notes: 'Annual vacation',
      approvedAt: '5/2/2024',
      approvedBy: 'Manager Smith',
    },
    {
      user: 'Emma Davis',
      type: 'Sick Leave',
      startsOn: '5/3/2024',
      endsOn: '6/3/2024',
      createdAt: '4/3/2024',
      notes: 'Fever',
      approvedAt: '4/3/2024',
      approvedBy: 'Manager Smith',
    },
  ];

  const rejectedRequests = [
    {
      user: 'Chris Wilson',
      type: 'Personal',
      startsOn: '8/3/2024',
      endsOn: '9/3/2024',
      createdAt: '1/3/2024',
      notes: 'Personal event',
      rejectedAt: '2/3/2024',
      rejectedBy: 'Manager Smith',
      reason: 'High workload during this period',
    },
    {
      user: 'Diana Miller',
      type: 'Work From Home',
      startsOn: '11/3/2024',
      endsOn: '11/3/2024',
      createdAt: '9/3/2024',
      notes: 'Home repairs',
      rejectedAt: '10/3/2024',
      rejectedBy: 'Manager Smith',
      reason: 'Critical on-site meeting scheduled',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminView 
        pendingApprovals={pendingApprovals}
        approvedRequests={approvedRequests}
        rejectedRequests={rejectedRequests}
      />
      {/* <EmployeeView timeOffRequests={timeOffRequests} /> */}
    </div>
  );
};

export default RequestsPage;
