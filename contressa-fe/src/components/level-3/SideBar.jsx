'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LabelIcon from '@mui/icons-material/Label';
import CategoryIcon from '@mui/icons-material/Category';

// Define menu items for different paths
const menuConfig = {
  '/inventory': [
    { name: 'Members', route: '/members' },
    { name: 'Pending requests', route: '/pending-requests' },
    { name: 'Inventory', route: '/inventory' },
    { name: 'Sales', route: '/sales' },
    { name: 'Invoice', route: '/invoice' },
    { name: 'Performance', route: '/performance' },
  ],
  '/sales': [
    { name: 'Leads', route: '/sales/leads' },
    { name: 'Customers', route: '/customers' },
    { name: 'Quotes', route: '/quotes' },
    { name: 'Sales Orders', route: '/sales-orders' },
    { name: 'Sales Invoices', route: '/sales-invoices' },
    { name: 'Returns', route: '/returns' },
    { name: 'Discounts & Offers', route: '/discounts-offers' },
    { name: 'Payments Received', route: '/payments-received' },
    { name: 'Meetings', route: '/meetings' },
    { name: 'Tickets', route: '/tickets' },
    { name: 'Forms', route: '/forms' },
  ],
  '/reports': [
    { name: 'Sales Report', route: '/reports/sales' },
    { name: 'Inventory Report', route: '/reports/inventory' },
    { name: 'Performance Report', route: '/reports/performance' },
  ],
  '/settings': [
    { name: 'Profile', route: '/settings/profile' },
    { name: 'Security', route: '/settings/security' },
    { name: 'Notifications', route: '/settings/notifications' },
  ],
};

export default function Sidebar() {
  const path = usePathname();

  // Find the menu that matches the current path
  const menuItems = Object.keys(menuConfig).find((key) => path.startsWith(key))
    ? menuConfig[Object.keys(menuConfig).find((key) => path.startsWith(key))]
    : [];

  if (menuItems.length === 0) return null; // Hide sidebar if no menu items exist for the path

  return (
    <div className="w-[20rem] bg-white border-r min-h-screen p-4">
      <div className="mt-6">
        <ul className="pl-6 mt-2 text-gray-600">
          {menuItems.map((item, index) => (
            <li key={index} className="py-1 hover:text-gray-900 cursor-pointer">
              {item.icon} <Link href={item.route}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
