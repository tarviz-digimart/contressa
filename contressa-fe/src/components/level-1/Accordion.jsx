"use Client";
import * as React from "react";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import BasicSelect from "./BasicSelect";
import { Avatar } from "@mui/material";

const getAvatarColor = (name) => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F4A261", "#2A9D8F"];
  if (!name || name === "None") return "#BDBDBD"; // Default gray color for "None"
  const index = name.charCodeAt(0) % colors.length; // Get color based on first letter
  return colors[index];
};

const DropdownField = ({
  label,
  value,
  data,
  onChange,
  showSelect,
  setShowSelect,
  avatar,
}) => (
  <div className="flex gap-2 items-center w-full">
    <p className="font-bold text-[15px] w-[15rem]">{label}</p>
    {showSelect ? (
      <div className="w-full">
        <BasicSelect
          data={data}
          avatar={avatar}
          onChange={onChange}
          onClose={() => setShowSelect(false)}
        />
      </div>
    ) : (
      <div
        className="flex items-center w-full cursor-pointer"
        onClick={() => setShowSelect(true)}
      >
        {avatar && (
          <Avatar sx={{ bgcolor: getAvatarColor(value) }}>{value?.[0]}</Avatar>
        )}
        <p className="font-bold rounded-sm h-[50px] min-w-[50%] max-w-[70%] flex items-center px-2">
          {value}
        </p>
      </div>
    )}
  </div>
);

export default function StyledAccordion() {
  const [selections, setSelections] = useState({
    assignee: "None",
    assignedTo: "None",
    parent: "None",
    label: "None",
  });
  const [dropdowns, setDropdowns] = useState({
    assignee: false,
    assignedTo: false,
    parent: false,
    label: false,
  });

  const handleSelectionChange = (key, value) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
    setDropdowns((prev) => ({ ...prev, [key]: false }));
  };

  const data = [
    { id: 1, value: 10 },
    { id: 2, value: 20 },
  ];
  const labelData = [
    { id: 1, value: "Cleaning" },
    { id: 2, value: "Drying" },
  ];
  const assigneeData = [
    { id: 1, value: "John" },
    { id: 2, value: "Wayne" },
    { id: 3, value: "Kevin" },
  ];

  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography
            component="span"
            sx={{ fontWeight: "bold", fontSize: "18px" }}
          >
            Details
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails
          sx={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <DropdownField
            label="Assignee"
            value={selections.assignee}
            data={assigneeData}
            onChange={(value) => handleSelectionChange("assignee", value)}
            showSelect={dropdowns.assignee}
            setShowSelect={(state) =>
              setDropdowns((prev) => ({ ...prev, assignee: state }))
            }
            avatar
          />

          <DropdownField
            label="Assigned To"
            value={selections.assignedTo}
            data={assigneeData}
            onChange={(value) => handleSelectionChange("assignedTo", value)}
            showSelect={dropdowns.assignedTo}
            setShowSelect={(state) =>
              setDropdowns((prev) => ({ ...prev, assignedTo: state }))
            }
            avatar
          />

          <DropdownField
            label="Parent"
            value={selections.parent}
            data={data}
            onChange={(value) => handleSelectionChange("parent", value)}
            showSelect={dropdowns.parent}
            setShowSelect={(state) =>
              setDropdowns((prev) => ({ ...prev, parent: state }))
            }
          />

          <DropdownField
            label="Label"
            value={selections.label}
            data={labelData}
            onChange={(value) => handleSelectionChange("label", value)}
            showSelect={dropdowns.label}
            setShowSelect={(state) =>
              setDropdowns((prev) => ({ ...prev, label: state }))
            }
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
