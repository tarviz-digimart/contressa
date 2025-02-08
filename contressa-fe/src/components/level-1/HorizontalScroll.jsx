'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@mui/material';
import { Divider } from '@mui/material';
import { BsFillPeopleFill } from 'react-icons/bs';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

function HorizontalScroll({ Branches }) {
  const [OfficePerPage, setOfficePerPage] = useState(4);
  const [visibleOffice, setVisibleOffice] = useState(0);

  const currentOffice = Branches.slice(visibleOffice, visibleOffice + OfficePerPage);

  const handleNext = () => {
    if (currentOffice.length > 0 && visibleOffice + OfficePerPage < Branches.length) {
      setVisibleOffice(visibleOffice + OfficePerPage);
    }
  };
  const handlePrev = () => {
    if (visibleOffice - OfficePerPage >= 0) {
      setVisibleOffice(visibleOffice - OfficePerPage);
    }
  };

  useEffect(() => {
    if (currentOffice.length === 0 && visibleOffice > 0) {
      setVisibleOffice(Math.max(0, visibleOffice - OfficePerPage));
    }
    console.log(currentOffice.length, 'dafsdgsdg', visibleOffice, 'sfgsgsgsd');
  }, [Branches, visibleOffice, OfficePerPage]);

  return (
    <div className="flex items-center justify-between">
      {visibleOffice !== 0 && (
        <div onClick={handlePrev} className="bg-gray-400 rounded-full cursor-pointer -ms-2">
          <MdKeyboardArrowLeft size={30} />
        </div>
      )}
      <div className="gap-2 grid grid-cols-2 w-[37rem]">
        {/* Map through organizations and render cards */}
        {currentOffice.map((org, index) => (
          <Card key={index} className="w-72 min-w-[18rem]">
            <CardContent>
              <div className="flex">
                <h3>{org.name}</h3>
              </div>
              <Divider />
              <div className="flex justify-between w-full mt-4">
                {/* Left-aligned "People" section with centered text */}
                <div className="text-center me-4 flex">
                  <BsFillPeopleFill size={30} />
                  <p className="mt-1 ms-2 text-b3">{org.people}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {currentOffice.length === 4 && (
        <div onClick={handleNext} className="bg-gray-400 rounded-full cursor-pointer">
          <MdKeyboardArrowRight size={30} />
        </div>
      )}
    </div>
  );
}

export default HorizontalScroll;
