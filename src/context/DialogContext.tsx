import React, { createContext, useState, useContext, ReactNode } from 'react';

type DialogType = 'expense' | 'income' | 'daily' | 'balance' | 'payDayDate';

interface DialogContextProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  type: DialogType;
  setType: (type: DialogType) => void;
  isDialogVisible: boolean;
  showDialog: () => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [type, setType] = useState<DialogType>('expense');
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
