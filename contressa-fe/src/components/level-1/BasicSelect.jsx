import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Avatar } from "@mui/material";

const getAvatarColor = (name) => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F4A261", "#2A9D8F"];
  if (!name || name === "None") return "#BDBDBD"; // Default gray color for "None"
  const index = name.charCodeAt(0) % colors.length; // Get color based on first letter
  return colors[index];
};

export default function BasicSelect({
  data,
  onChange,
  onClose,
  avatar = false,
}) {
  const [selectedData, setSelectedData] = React.useState("None");

  const handleChange = (event) => {
    setSelectedData(event.target.value);
    if (onChange) {
      onChange(event.target.value);
    }
    if (onClose) {
      onClose(); // Close dropdown after selection
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth>
        <Select
          id="demo-simple-select"
          value={selectedData}
          onChange={handleChange}
          onClose={onClose} // Close dropdown when clicking outside
          sx={{ height: "50px", fontSize: 15 }}
        >
          {data?.map((item) => (
            <MenuItem key={item.id} value={item.value} className="flex gap-x-3">
              {avatar && (
                <Avatar sx={{ bgcolor: getAvatarColor(item.value) }}>
                  {item.value?.[0]}
                </Avatar>
              )}
              {item.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
