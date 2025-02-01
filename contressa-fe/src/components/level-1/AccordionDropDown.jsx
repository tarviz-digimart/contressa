import React from "react";

function AccordionDropDown({ data, onChange }) {
  return (
    <>
      <p
        className={`font-bold ${
          data !== "None" && "bg-purple-100"
        } rounded-sm w-full h-[50px] flex items-center justify-center`}
        onClick={() => onChange(true)}
      >
        {data}
      </p>
    </>
  );
}

export default AccordionDropDown;
