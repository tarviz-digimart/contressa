import React, { useRef, useState } from 'react';
import { Button } from '@mui/material';

const RichTextEditor = ({ handleInput, fileInputRef, setContent, editorRef }) => {
  // const editorRef = useRef(null);
  // const fileInputRef = useRef(null);

  // Handle typing in the editor
  // const handleInput = () => {
  //   setContent(editorRef.current.innerHTML);
  // };

  // Handle pasted text (preserves only text, no styles)
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Handle dropped files (images & videos)
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    insertMedia(files);
  };

  // Handle file selection from the button
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    insertMedia(files);
  };

  // Insert media at the END of the editor
  const insertMedia = (files) => {
    files.forEach((file) => {
      const fileURL = URL.createObjectURL(file);
      let element;

      if (file.type.startsWith('image/')) {
        element = `<img src="${fileURL}" alt="Image" 
                        style="max-width:250px; height:auto; border-radius:8px; margin:5px; display:block;" />`;
      } else if (file.type.startsWith('video/')) {
        element = `<video src="${fileURL}" controls 
                        style="max-width:250px; height:auto; border-radius:8px; margin:5px; display:block;"></video>`;
      }

      if (element) {
        appendToEditor(element);
      }
    });

    setContent(editorRef.current.innerHTML);
  };

  // Append media at the END of the editor
  const appendToEditor = (html) => {
    if (editorRef.current) {
      editorRef.current.innerHTML += html;
      setContent(editorRef.current.innerHTML);
    }
  };

  return (
    <div>
      {/* Content-Editable Div */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        onDrop={handleDrop}
        onPaste={handlePaste}
        style={{
          border: '2px solid #ccc',
          padding: '10px',
          minHeight: '150px',
          borderRadius: '5px',
          outline: 'none',
          overflow: 'auto',
          fontSize: '16px',
        }}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*,video/*"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default RichTextEditor;
