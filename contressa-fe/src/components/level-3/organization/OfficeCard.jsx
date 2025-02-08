import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Divider } from '@mui/material';
import { FaBuilding } from 'react-icons/fa';



const OrganizationCard = ({organizations}) => {
  return (
    <div>
      {/* Map through organizations and render cards */}
      {organizations.map((org, index) => (
        <Card key={index} className="w-72 min-w-[18rem]">
          <CardContent>
            <div className="flex">
              <FaBuilding size={30}/>
              <h3>{org.name}</h3>
            </div>
            <Divider />
            <div className="flex justify-between w-full mt-4">
              {/* Left-aligned "People" section with centered text */}
              <div className="text-center me-4 space-y-2">
                <p>People</p>
                <p>{org.people}</p>
              </div>
              {/* Right-aligned "Address" section with centered text */}
              <div className="text-center mx-4 space-y-2">
                <p>Address</p>
                <p>{org.address}</p>
              </div>
            </div>
            <Divider className="mt-16" />
            <div className="flex justify-center mt-4">
              <button className="border-2 rounded-md px-4 py-1">View</button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrganizationCard;
