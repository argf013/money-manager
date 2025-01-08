import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DialogContextProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <DialogContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
