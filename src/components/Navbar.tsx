import {
  BellFillIcon,
  BellIcon,
  ClockFillIcon,
  SparkleFillIcon,
  XCircleFillIcon,
} from '@primer/octicons-react';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { Action } from '../types/transactions';
import IndexedDBService from '../service';

const Navbar = ({
  notifications,
  setNotifications,
  balance,
  surplus,
}: {
  notifications: Action[];
  setNotifications: React.Dispatch<React.SetStateAction<Action[]>>;
  balance: number;
  surplus: number;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sufficient, setSufficient] = useState(
    sessionStorage.getItem('sufficient'),
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkSufficient = () => {
    if (surplus >= 0) {
      setSufficient('true');
    } else {
      setSufficient('false');
    }
  };

  useEffect(() => {
    checkSufficient();
  }, [balance, surplus]);

  useEffect(() => {
    const handleStorageChange = () => {
      checkSufficient();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const clearNotifications = async () => {
    await IndexedDBService.deleteAllActions();
    setNotifications([]);
  };

  return (
    <div
      className={`text-white border-b w-full ${
        sufficient === 'false' ? 'bg-[#C04D4D]' : 'bg-[#17A364]'
      }`}
    >
      <div className='flex justify-between items-center p-4 w-full'>
        <Link to={'/'} id='brand' className='flex items-center space-x-1'>
          <SparkleFillIcon size={16} className='rotate-[-18deg]' />
          <span className='text-lg font-bold'>Mana Plan</span>
        </Link>
        <div className='relative z-[99px]'>
          <button onClick={toggleDropdown} className='flex items-center'>
            {dropdownOpen ? <BellIcon size={16} /> : <BellFillIcon size={16} />}
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className='absolute custom-scrollbar right-0 mt-2 w-[331px] bg-white text-black rounded-lg shadow-lg z-[99] max-h-[600px] overflow-y-auto scrollbar-hide'
              >
                <div className='bg-[#e4e4e4] px-4 py-4 rounded-md'>
                  <button
                    onClick={clearNotifications}
                    className='mb-4 px-4 py-2  text-[#C04D4D] text-sm rounded flex items-center space-x-2'
                  >
                    <XCircleFillIcon size={16} />
                    <span>Clear Notifications</span>
                  </button>
                  {notifications.length === 0 ? (
                    <div className='text-[#8a8a8a] px-[20px] py-[16px] bg-white rounded-lg text-center flex flex-col items-center justify-center gap-2'>
                      <BellFillIcon size={100}/>
                      <span>No notifications</span>
                    </div>
                  ) : (
                    <ul className='flex flex-col gap-[10px] '>
                      {notifications.map((notification, index) => (
                        <li
                          key={index}
                          className='px-[20px] py-[16px] bg-white rounded-lg'
                        >
                          <div className='flex items-center gap-[3px] mb-[8px] text-[#17A364]'>
                            <ClockFillIcon size={16} />
                            <div className='font-bold text-base'>
                              Balance Updated
                            </div>
                          </div>
                          <div className='text-[11.5px] flex flex-col gap-[4px]'>
                            <span>
                              From <b>{notification.from}</b> to{' '}
                              <b>{notification.to}</b>
                            </span>
                            <span>Detail: {notification.detail}</span>
                            <span className='text-right text-[10px] mt-2'>
                              {new Date(notification.date).toLocaleDateString(
                                'en-GB',
                                {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                },
                              )}{' '}
                              {new Date(notification.date).toLocaleTimeString(
                                'en-GB',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
