import React, { useEffect, useState, useRef } from 'react';
import { PencilIcon } from '@primer/octicons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDialog } from '../context/DialogContext';

interface DialogFormProps {
  onSave: (
    name?: string,
    amount?: number,
    category?: string,
    detail?: string,
    payDayDate?: number,
  ) => void;
  onCancel: () => void;
  initialName?: string;
  initialAmount?: number;
  initialCategory?: string;
  initialDetail?: string;
  initialPayDayDate?: number;
}

const DialogForm: React.FC<DialogFormProps> = ({
  onSave,
  onCancel,
  initialName = '',
  initialAmount = 0,
  initialCategory = '',
  initialDetail = '',
  initialPayDayDate = 0,
}) => {
  const { isVisible, setIsVisible, type } = useDialog();
  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState(initialAmount);
  const [category, setCategory] = useState(initialCategory);
  const [detail, setDetail] = useState(initialDetail);
  const [payDayDate, setPayDayDate] = useState(initialPayDayDate);
  const [isDetailValid, setIsDetailValid] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const payDayDateLocal = localStorage.getItem('payDayDate');

  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount]);

  useEffect(() => {
    if (payDayDateLocal) {
      setPayDayDate(parseInt(payDayDateLocal));
    }
  }, [payDayDateLocal, initialPayDayDate, initialAmount]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
        setIsVisible(false);
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onCancel, setIsVisible]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type === 'balance' && !detail) {
      setIsDetailValid(false);
      return;
    }
    onSave(name, amount, category, detail, payDayDate);
    setName(initialName);
    setAmount(initialAmount);
    setCategory(initialCategory);
    setDetail(initialDetail);
    setPayDayDate(initialPayDayDate);
    setIsDetailValid(true);
    event.currentTarget.reset();
    localStorage.setItem('payDayDate', payDayDate.toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          ref={dialogRef}
          className='fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-10 z-50'
          onClick={(event) => {
            if (event.target === dialogRef.current) {
              onCancel();
              setIsVisible(false);
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='min-w-[353px] bg-white rounded-lg shadow-lg px-[25px] py-[28px] flex flex-col gap-[18px]'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center gap-2 font-bold text-[#15BC70]'>
              <PencilIcon />
              <h1 className=''>
                {type === 'expense'
                  ? 'Add Expense'
                  : type === 'income'
                  ? 'Add Income'
                  : type === 'daily'
                  ? 'Set Daily'
                  : type === 'balance'
                  ? 'Edit Balance'
                  : type === 'payDayDate'
                  ? 'Set Date'
                  : 'no'}
              </h1>
            </div>
            <form
              className='flex flex-col gap-[5px] w-full font-medium text-[13px]'
              onSubmit={handleSubmit}
            >
              {(type === 'expense' ||
                type === 'income' ||
                type === 'daily') && (
                <>
                  <label htmlFor='name' className='text-[#444444]'>
                    Name:
                  </label>
                  <input
                    className='border rounded-md border-[#C2C2C2] px-[14px] py-[11px] h-[38px] !text-black'
                    name='name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor='amount' className='text-[#444444]'>
                    Amount:
                  </label>
                  <input
                    className='border rounded-md border-[#C2C2C2] px-[14px] py-[11px] h-[38px] !text-black'
                    name='amount'
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                  {(type === 'expense' || type === 'daily') && (
                    <>
                      <label htmlFor='category' className='text-[#444444]'>
                        Category:
                      </label>
                      <input
                        className='border rounded-md border-[#C2C2C2] px-[14px] py-[11px] h-[38px] !text-black'
                        name='category'
                        type='text'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                    </>
                  )}
                </>
              )}
              {type === 'balance' && (
                <>
                  <label htmlFor='amount' className='text-[#444444]'>
                    Amount:
                  </label>
                  <input
                    className='border rounded-md border-[#C2C2C2] px-[14px] py-[11px] h-[38px] !text-black'
                    name='amount'
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                  <label htmlFor='detail' className='text-[#444444]'>
                    Detail:
                  </label>
                  <input
                    className={`border rounded-md border-[#C2C2C2] px-[14px] py-[11px] h-[38px] !text-black ${
                      !isDetailValid ? 'border-red-500' : ''
                    }`}
                    name='detail'
                    type='text'
                    value={detail}
                    onChange={(e) => {
                      setDetail(e.target.value);
                      setIsDetailValid(true);
                    }}
                  />
                  <span className='text-red-500'>
                    {isDetailValid ? '' : 'Detail is required'}
                  </span>
                </>
              )}
              {type === 'payDayDate' && (
                <>
                  <label htmlFor='payDayDate' className='text-[#444444]'>
                    Select Date:
                  </label>
                  <input
                    className='border rounded-md border-[#C2C2C2] px-[14px] py-[11px] h-[38px] !text-black'
                    name='payDayDate'
                    type='number'
                    value={payDayDate}
                    min={1}
                    max={31}
                    onChange={(e) => setPayDayDate(parseInt(e.target.value))}
                  />
                </>
              )}
              <div className='flex justify-end space-x-2 mt-5'>
                <button
                  type='button'
                  className='px-[28px] py-[10px] bg-transparent text-[#C04D4D] rounded-md h-[36px] items-center flex text-[13px] font-medium'
                  onClick={() => {
                    onCancel();
                    setIsVisible(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-[28px] py-[10px] bg-[#15BC70] text-white rounded-md h-[36px] items-center flex text-[13px] font-medium'
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DialogForm;
