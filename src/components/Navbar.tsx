import {
  BellFillIcon,
  ClockFillIcon,
  SparkleFillIcon,
} from '@primer/octicons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Action {
  actionId: number;
  date: string;
  action: string;
  detail: string;
  from: string;
  to: string;
}

const Navbar = ({ notifications }: { notifications: Action[] }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className='bg-[#17A364] text-white border-b w-full'>
      <div className='flex justify-between items-center p-4 w-full'>
        <Link to={'/'} id='brand' className='flex items-center space-x-1'>
          <SparkleFillIcon size={16} className='rotate-[-18deg]' />
          <span className='text-lg font-bold'>Mana Plan</span>
        </Link>
        <div className='relative'>
          <button onClick={toggleDropdown}>
            <BellFillIcon size={16} />
          </button>
          {dropdownOpen && (
            <div className='absolute right-0 mt-2 w-[331px] bg-white text-black rounded-lg shadow-lg'>
              <div className='bg-[#e4e4e4] px-4 py-4 rounded-md'>
                {notifications.length === 0 ? (
                  <div className='px-[20px] py-[16px] bg-white rounded-lg text-center'>
                    No notifications
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
                        <div className='text-[11px] flex flex-col gap-[4px]'>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
