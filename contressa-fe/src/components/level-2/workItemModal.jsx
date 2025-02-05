'use client';
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Avatar, IconButton, Paper, Switch, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledAccordion from '../level-1/WorkItemAccordion';
import { getAvatarColor } from '../../utils/avatarColors';
import RichTextEditor from '../level-1/RichTextEditor';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddLinkIcon from '@mui/icons-material/AddLink';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

import SwitchTabs from '../level-1/workItemModal/SwitchTab';
import BasicDateTimePicker from '../level-1/DataAndTimePicker';
const currentuser = { username: 'Ebrahim' };
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function WorkItemModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [title, setTitle] = React.useState('');
  const [comments, setComments] = useState('');
  const [important, setImportant] = useState(false);
  const [selectedButton, setSelectedButton] = useState();

  const [commentsData, setCommentsData] = useState([]);

  //This is to handle the enter key press for comments.
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && comments.trim() !== '') {
      e.preventDefault(); // Prevents a new line from being added
      const newComment = {
        id: commentsData.length + 1,
        name: currentuser.username,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Get current time
        comments,
      };
      setCommentsData([...commentsData, newComment]);
      setComments(''); // Clear input after adding
    }
  };

  const handleInput = () => {
    setContent(editorRef.current.innerHTML);
  };
  const fileInputRef = React.useRef(null);
  const editorRef = React.useRef(null);
  const [content, setContent] = useState(''); // Stores HTML content
  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        // open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ borderRadius: '5px', paddingBottom: '2rem' }}
      >
        <div className="overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] bg-white border-2 border-black shadow-xl p-4 h-[90vh] flex flex-col gap-4">
          {/* title, notification and close */}
          <div className="flex justify-between mb-3 items-center">
            {/* Title */}
            <p className="bg-violet-300 p-1 px-2 rounded-md">#{'22'}</p>
            <div className="w-[90%]">
              <TextField
                fullWidth
                placeholder="Title"
                id="outlined-basic"
                variant="standard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                InputProps={{
                  sx: {
                    fontWeight: 'bold',
                    fontSize: '23px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid black', // Show border if there's text
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid black', // Show a distinct border when focused
                    },
                  },
                }}
              />
            </div>

            <div className="flex">
              <IconButton onClick={() => setImportant((prev) => !prev)}>
                {important ? (
                  <NotificationsActiveIcon sx={{ color: 'red' }} />
                ) : (
                  <NotificationsIcon />
                )}
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          {/* ------------------------------------------------------------------------------------------- */}
          {/* Add, DeadLine, Priority */}
          <div className="flex gap-8">
            <div className="flex gap-2 items-center">
              <Button
                variant="contained"
                onClick={() => fileInputRef.current.click()}
                sx={{ textTransform: 'none', height: '3.5rem' }}
                className="flex text-black bg-slate-200 gap-2 items-center"
              >
                <AddLinkIcon /> <p>Add</p>
              </Button>
              {/* <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
                className="flex text-black bg-slate-200 gap-2  items-center"
              >
                <MoreTimeIcon /> <p>DeadLine</p>
              </Button> */}
              <BasicDateTimePicker label="Pick DeadLine" />
            </div>
            <div className="flex items-center">
              <p className="font-bold">Priority</p> <Switch />
            </div>
          </div>
          {/* ------------------------------------------------------------------------------------------- */}

          <div className="flex gap-4 h-[80%] w-full p-1">
            {/* left div */}
            <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
              <div className="border-4 flex flex-col gap-2 p-4">
                <p className="font-bold text-slate-950">Description</p>
                <RichTextEditor
                  handleInput={handleInput}
                  fileInputRef={fileInputRef}
                  setContent={setContent}
                  editorRef={editorRef}
                />
              </div>
              <div className="h-[100%] flex flex-col bg-white border-4 shadow-xl">
                <SwitchTabs />
                <div className="p-5 flex flex-col gap-2 h-[100%] w-full">
                  <p className="font-bold ">Comments</p>

                  {/* comment typing area */}
                  <div className="flex gap-2 items-start">
                    <Avatar sx={{ bgcolor: getAvatarColor(currentuser.username) }}>
                      {currentuser.username?.[0]}
                    </Avatar>
                    <TextField
                      sx={{ width: '100%' }}
                      id="outlined-multiline-static"
                      placeholder="comments..."
                      multiline
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      onKeyDown={handleKeyPress}
                      InputProps={{
                        sx: {
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: '2px solid black', // Show a distinct border when focused
                          },
                        },
                      }}
                    />
                  </div>

                  {/* comments area */}
                  <div className="w-full">
                    {commentsData?.map((item, index) => (
                      <div key={index} className="flex gap-5">
                        <Avatar sx={{ bgcolor: getAvatarColor(item.name) }}>
                          {item.name?.[0]}
                        </Avatar>
                        <div>
                          <div className="flex gap-5">
                            <p className="font-bold">{item.name}</p>
                            <p className="font-bold">{item.time}</p>
                          </div>
                          <p className="w-fit break-words overflow-wrap">{item.comments}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* right div */}
            <div className="h-full w-full border-4 ">
              <StyledAccordion />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
