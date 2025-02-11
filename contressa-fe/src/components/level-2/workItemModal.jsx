'use client';
import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Avatar, IconButton, Paper, Switch, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StyledAccordion from '../level-1/workItemModal/WorkItemAccordion';
import { getAvatarColor } from '../../utils/avatarColors';
import RichTextEditor from '../level-1/RichTextEditor';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AddLinkIcon from '@mui/icons-material/AddLink';
import HistoryIcon from '@mui/icons-material/History';
import SwitchTabs from '../level-1/workItemModal/SwitchTab';
import BasicDateTimePicker from '../level-1/DataAndTimePicker';
const currentuser = { username: 'Ebrahim' };

export default function WorkItemModal({ open, setOpen }) {
  const handleClose = () => setOpen(false);
  const [title, setTitle] = React.useState('');
  const [comments, setComments] = useState('');
  const [important, setImportant] = useState(false);
  const [activeTab, setActiveTab] = useState('comments');
  const [commentsData, setCommentsData] = useState([]);
  const [replies, setReplies] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
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

  //This is for reply input field
  const handleReplyKeyPress = (e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (replyInputs[index]?.trim()) {
        setReplies((prev) => ({
          ...prev,
          [index]: [
            ...(prev[index] || []),
            { name: currentuser.username, text: replyInputs[index] },
          ],
        }));
        setReplyInputs((prev) => ({ ...prev, [index]: '' })); // Clear input after reply
      }
    }
  };

  const handleInput = () => {
    setContent(editorRef.current.innerHTML);
  };
  const fileInputRef = React.useRef(null);
  const editorRef = React.useRef(null);
  const [content, setContent] = useState(''); // Stores HTML content
  return (
    <Modal
      open={open}
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

        {/* Add, DeadLine, Priority */}
        <div className="flex gap-8">
          <div className="flex gap-2 items-center ">
            <div className="mt-2">
              <Button
                variant="contained"
                onClick={() => fileInputRef.current.click()}
                sx={{ textTransform: 'none', height: '3.5rem' }}
                className="flex text-black bg-slate-200 gap-2 items-center"
              >
                <AddLinkIcon /> <p>Add</p>
              </Button>
            </div>
            <BasicDateTimePicker label="Pick DeadLine" />
          </div>
          <div className="flex items-center">
            <p className="font-bold">Priority</p> <Switch />
          </div>
        </div>

        <div className="flex gap-4 h-[80%] w-full p-1">
          {/* left div */}
          <div className="w-full h-full flex flex-col gap-4 overflow-y-auto overflow-x-hidden min-w-[20rem]">
            <div className="border-2 border-slate-500 flex flex-col gap-2 p-4">
              <p className="font-bold text-slate-950">Description</p>
              <RichTextEditor
                handleInput={handleInput}
                fileInputRef={fileInputRef}
                setContent={setContent}
                editorRef={editorRef}
              />
            </div>
            <div className="flex-1 flex flex-col bg-white border-2 border-slate-500 shadow-xl ">
              <SwitchTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="p-5 flex flex-col gap-2 h-[100%] w-full">
                {activeTab === 'comments' && (
                  <>
                    <p className="font-bold">Comments</p>
                    {/* Comment Input */}
                    <div className="flex gap-2 items-start">
                      <Avatar sx={{ bgcolor: getAvatarColor(currentuser.username) }}>
                        {currentuser.username?.[0]}
                      </Avatar>
                      <TextField
                        sx={{ width: '100%' }}
                        id="outlined-multiline-static"
                        placeholder="Write a comment..."
                        multiline
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        onKeyDown={handleKeyPress}
                        InputProps={{
                          sx: {
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              border: '2px solid black',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Comments List */}
                    <div className="w-full gap-5 flex flex-col">
                      {commentsData?.map((item, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          {/* Comment */}
                          <div className="flex gap-2">
                            <Avatar sx={{ bgcolor: getAvatarColor(item.name) }}>
                              {item.name?.[0]}
                            </Avatar>
                            <div>
                              <div className="flex gap-5">
                                <p className="font-bold">{item.name}</p>
                                <p className="font-bold text-gray-500">{item.time}</p>
                              </div>
                              <p className="w-fit break-words">{item.comments}</p>
                              {/* Reply Button */}
                              <button
                                className="text-blue-500 text-sm"
                                onClick={() =>
                                  setReplyInputs((prev) => ({
                                    ...prev,
                                    [index]: prev[index] !== undefined ? undefined : '', // Toggle reply input
                                  }))
                                }
                              >
                                Reply
                              </button>
                            </div>
                          </div>

                          {/* Reply Input */}
                          {replyInputs[index] !== undefined && (
                            <div className="flex gap-2 ml-10">
                              <Avatar sx={{ bgcolor: getAvatarColor(currentuser.username) }}>
                                {currentuser.username?.[0]}
                              </Avatar>
                              <TextField
                                sx={{ width: '100%' }}
                                placeholder="Write a reply..."
                                multiline
                                value={replyInputs[index] || ''}
                                onChange={(e) =>
                                  setReplyInputs((prev) => ({ ...prev, [index]: e.target.value }))
                                }
                                onKeyDown={(e) => handleReplyKeyPress(e, index)}
                              />
                            </div>
                          )}

                          {/* Replies */}
                          {replies[index]?.length > 0 && (
                            <div className="ml-10 flex flex-col gap-2">
                              {replies[index].map((reply, replyIndex) => (
                                <div key={replyIndex} className="flex gap-2">
                                  <Avatar sx={{ bgcolor: getAvatarColor(reply.name) }}>
                                    {reply.name?.[0]}
                                  </Avatar>
                                  <div>
                                    <p className="font-bold">{reply.name}</p>
                                    <p className="w-fit break-words">{reply.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {activeTab === 'history' && (
                  <p className="font-bold ">
                    History <HistoryIcon />
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* right div */}
          <div className="h-full w-full border-2 border-slate-500 ">
            <StyledAccordion />
          </div>
        </div>
      </div>
    </Modal>
  );
}
