import { FileText, Network, Users } from 'lucide-react';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

//--------------Profile----------------
export const ProfileData = {
  name: 'Alexandar',
  email: 'alexandar.the.great@gmail.com',
  phone: '+91 98562 54789',
};

//--------------Dashboard--------------

export const cardData = [
  {
    color: '#daebfe',
    count: '100',
    title: 'Customers',
    amount: '$78,456',
    label: 'Total Purchase Due',
    icon: <Users size={50} />, // Adjust size here
  },
  {
    color: '#EADCFD',
    count: '110',
    title: 'Suppliers',
    amount: '$307,144',
    label: 'Total Purchase Due',
    icon: <Network size={50} />,
  },
  {
    color: '#FEF4D9',
    count: '150',
    title: 'Purchase Invoice',
    amount: '$307,144',
    label: 'Total Purchase Due',
    icon: <FileText size={50} />,
  },
  {
    color: '#FFE8E3',
    count: '170',
    title: 'Sales Invoice',
    amount: '$307,144',
    label: 'Total Purchase Due',
    icon: <ReceiptLongIcon sx={{ fontSize: 50 }} />,
  },
];

export const employeeData = [
  { name: 'Ling wan yu', sales: '$21,232', orders: 324 },
  { name: 'John Doe', sales: '$19,876', orders: 298 },
  { name: 'Jane Smith', sales: '$18,450', orders: 275 },
  { name: 'John Doe', sales: '$19,876', orders: 298 },
  { name: 'Jane Smith', sales: '$18,450', orders: 275 },
];

export const productData = [
  { name: 'Product A', cost: '$15,678', orders: 215, percent: '32.35%' },
  { name: 'Product B', cost: '$14,560', orders: 198, percent: '22.26%' },
  { name: 'Product C', cost: '$13,450', orders: 185, percent: '10.5%' },
  { name: 'Product B', cost: '$14,560', orders: 198, percent: '22.26%' },
  { name: 'Product C', cost: '$13,450', orders: 185, percent: '10.5%' },
];

export const categoryData = [
  { name: 'Clubs', amount: '$32,123' },
  { name: 'Fashion', amount: '$32,123' },
  { name: 'Commercial', amount: '$32,123' },
  { name: 'Residential', amount: '$32,123' },
  { name: 'Market', amount: '$32,123' },
];

//----------WorkItem Modal ---------------

export const DropDownSelectData = [
  { name: 'Kevin' },
  { name: 'Emily' },
  { name: 'Josh' },
  { name: 'Adam' },
  { name: 'Vikram' },
  { name: 'Sid' },
];
