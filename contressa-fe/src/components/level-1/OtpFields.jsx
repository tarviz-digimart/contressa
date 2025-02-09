'use client';
import React, { useState, useRef, useEffect } from 'react';
import { properties } from '@/utils/styles/styles';

function OtpFields({ setOtpData }) {
  const prop = properties();
  const [values, setValues] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const inputRefs = useRef([]);

  // Handle value change for each input
  const handleChange = (e, index) => {
    const inputValue = e.target.value.slice(0, 1); // Limit to 1 character
    const newValues = [...values];
    newValues[index] = inputValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setValues(newValues);

    // Move to the next input if value is entered
    if (inputValue && index < values.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  useEffect(() => {
    const otpString = values.join('');
    setOtpData((prev) => ({ ...prev, otp: otpString }));
  }, [values]);

  // Handle backspace to move to the previous input
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle focus border color change
  const handleFocus = (e) => {
    e.target.style.borderColor = '#007FFF'; // Blue border on focus
  };

  // Handle blur border color change
  const handleBlur = (e) => {
    e.target.style.borderColor = '#ccc'; // Gray border on blur
  };

  // Handle paste event to automatically fill inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData('text')
      .slice(0, 6)
      .replace(/[^0-9]/g, '');
    const newValues = pasteData.split('').slice(0, 6); // Take only the first 6 digits
    setValues(newValues);
    newValues.forEach((value, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = value;
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around', // 🔥 Properly space out the boxes
        borderRadius: prop.borderRadius.ten,
        padding: '5px', // Add padding to create breathing space
      }}
    >
      {values.map((value, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)} // Store each input ref
          style={{
            height: '3rem',
            width: '2.5rem', // Increased the width slightly for better visual
            fontSize: '2rem',
            textAlign: 'center',
            lineHeight: '3rem',
            fontWeight: 'bold',
            border: '2px solid #ccc',
            borderRadius: '5px',
            outline: 'none',
          }}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => handleChange(e, index)} // Handle 1 character input
          onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
          onFocus={handleFocus} // Change border color on focus
          onBlur={handleBlur} // Revert border color on blur
          onPaste={handlePaste} // Handle paste event for the entire OTP
        />
      ))}
    </div>
  );
}

export default OtpFields;
