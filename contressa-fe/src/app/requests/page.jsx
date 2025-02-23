import Sidebar from '@/components/level-3/SideBar';
import RequestsPage from '@/components/level-3/Requests/RequestsPage';

export default function Requests() {
  const menuItems = [
    { name: 'Members', route: '/members' },
    { name: 'Pending requests', route: '/pending-requests' },
  ];

  return (
    <div className="flex">
      {/* <Sidebar menuItems={menuItems} /> */}
      <div className="ms-64">
        <RequestsPage />
      </div>
    </div>
  );
}
