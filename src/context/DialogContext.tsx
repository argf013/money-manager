import React, { createContext, useState, useContext, ReactNode } from 'react';

interface DialogContextProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  type: DialogTypes[keyof DialogTypes];
  setType: (type: DialogTypes[keyof DialogTypes]) => void;
  isDialogVisible: boolean;
  showDialog: () => void;
  hideDialog: () => void;
}

interface DialogTypes {
  expense: 'expense';
  income: 'income';
  daily: 'daily';
  balance: 'balance';
  payDayDate: 'payDayDate';
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState<DialogTypes[keyof DialogTypes]>('expense');
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const showDialog = () => setIsDialogVisible(true);
  const hideDialog = () => setIsDialogVisible(false);

  return (
    <DialogContext.Provider
      value={{
        isVisible,
        setIsVisible,
        type,
        setType,
        isDialogVisible,
        showDialog,
        hideDialog,
      }}
    >
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
