'use client';
import React, { createContext, useState, useContext } from 'react';
const OrgContext = createContext();
export const OrgProvider = ({ children }) => {
  return <OrgContext.Provider value={{}}>{children}</OrgContext.Provider>;
};

export const useOrg = () => {
  return useContext(OrgContext);
};
