  'use client';
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Avatar, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledAccordion from '../level-1/WorkItemAccordion';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { getAvatarColor } from '../../utils/avatarColors';
import RichTextEditor from '../level-1/RichTextEditor';

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

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        // open={open}
        open={true}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ borderRadius: '5px' }}
      >
        <div
          // style={style}
          className="overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] bg-white border-2 border-black shadow-xl p-4 h-[95%]"
        >
          <div className="flex justify-between mb-3">
            {/* Title */}
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
                <NotificationImportantIcon sx={{ color: important ? 'red' : 'none' }} />
              </IconButton>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
          <PanelGroup direction="horizontal" className="flex gap-4 h-full w-full">
            <Panel defaultSize={30} minSize={20}>
              <div className="overflow-y-auto h-[100%] flex flex-col gap-y-4 w-full pb-[10%]">
                {/* Description */}
                <div>
                  <p className="font-bold text-slate-950">Description</p>
                  {/* Media */}
                  <RichTextEditor />
                </div>

                {/* Comments */}
                <div className="flex flex-col gap-2 bg-green-300">
                  <p className="font-bold">Activity</p>
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
                      onKeyDown={handleKeyPress} // Handle Enter key press                        rows={2}
                      InputProps={{
                        sx: {
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: '2px solid black', // Show a distinct border when focused
                          },
                        },
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    {commentsData?.map((item, index) => (
                      <div key={index} className="flex gap-2">
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
            </Panel>
            <PanelResizeHandle className="w-[2px] bg-slate-500" />
            <Panel defaultSize={30} minSize={20}>
              <div className="w-full overflow-y-auto">
                <StyledAccordion />
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </Modal>
    </div>
  );
}
