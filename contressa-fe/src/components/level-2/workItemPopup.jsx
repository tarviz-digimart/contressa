"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Avatar, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledAccordion from "../level-1/Accordion";
import { Description } from "@mui/icons-material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

const commentsData = [
  {
    id: 1,
    name: "Ebrahim",
    time: "1 Hour",
    comments: "This needs to be addressed",
  },
  { id: 2, name: "Keshav", time: "5 mins", comments: "Why using styles" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [important, setImportant] = React.useState(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        // open={open}
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ borderRadius: "5px" }}
      >
        <div
          style={style}
          className="overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white border-2 border-black shadow-xl p-4 h-[75%] "
        >
          <div className="flex justify-end mb-3">
            <IconButton onClick={() => setImportant((prev) => !prev)}>
              <NotificationImportantIcon
                sx={{ color: important ? "red" : "none" }}
              />
            </IconButton>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </div>
          <ResizablePanelGroup className="gap-3" direction="horizontal">
            <ResizablePanel
              defaultSize={30}
              minSize={40}
              className="overflow-y-auto  "
            >
              <div className="overflow-y-auto flex flex-col gap-y-4 w-full">
                {/* Title */}
                <TextField
                  fullWidth
                  placeholder="Title"
                  id="outlined-basic"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  InputProps={{
                    sx: {
                      fontWeight: "bold",
                      fontSize: "23px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "1px solid black", // Show border if there's text
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "2px solid black", // Show a distinct border when focused
                      },
                    },
                  }}
                />

                {/* Description */}
                <div>
                  <p className="font-bold">Description</p>
                  <TextField
                    sx={{ width: "100%" }}
                    id="outlined-multiline-static"
                    value={description}
                    placeholder="Add a description"
                    multiline
                    rows={4}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Show border if there's text
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          border: "1px solid rgba(0, 0, 0, 0.23)", // Show border on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "2px solid black", // Show a distinct border when focused
                        },
                      },
                    }}
                  />
                </div>

                {/* Comments */}
                <div className="flex flex-col gap-2">
                  <p className="font-bold">Activity</p>
                  <div className="flex gap-2 items-start">
                    <Avatar sx={{ bgcolor: "orange" }}>N</Avatar>
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-multiline-static"
                      placeholder="comments..."
                      multiline
                      rows={2}
                      InputProps={{
                        sx: {
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "2px solid black", // Show a distinct border when focused
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    {commentsData?.map((item) => (
                      <div className="flex gap-2">
                        <Avatar sx={{ bgcolor: "orange" }}>
                          {item.name?.[0]}
                        </Avatar>
                        <div>
                          <div className="flex gap-5">
                            <p className="font-bold">{item.name}</p>
                            <p className="font-bold">{item.time}</p>
                          </div>
                          <div>{item.comments}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={30}>
              <div className="w-full overflow-y-auto">
                <StyledAccordion />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Modal>
    </div>
  );
}
