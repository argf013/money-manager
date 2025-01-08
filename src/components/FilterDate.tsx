import React, { useEffect, useState } from 'react';
import { Datepicker } from 'flowbite-react';
import calendarIcon from '../assets/calendar.svg';
import TransactionLists from './TransactionLists';

const FilterDate: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const updateCalendarIcons = () => {
      const datepickerIcons = document.querySelectorAll(
        '.pointer-events-none.absolute.inset-y-0.left-0.flex.items-center.pl-3 svg',
      );
      datepickerIcons.forEach((icon) => {
        const iconContainer = icon.parentElement;
        if (iconContainer) {
          iconContainer.removeChild(icon);
          const newIcon = document.createElement('img');
          newIcon.src = calendarIcon;
          newIcon.className = 'h-5 w-5 text-gray-500 dark:text-gray-400';
          iconContainer.appendChild(newIcon);
        }
      });
    };

    updateCalendarIcons();

    const datepickerDropdowns = document.querySelectorAll(
      '.absolute.top-10.z-50.block.pt-2',
    );
    if (datepickerDropdowns.length > 1) {
      datepickerDropdowns[1].classList.add('right-0');
    }

    const observeNewElements = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          const newDropdowns = document.querySelectorAll(
            '.absolute.top-10.z-50.block.pt-2',
          );
          if (newDropdowns.length) {
            newDropdowns.forEach((dropdown) => {
              const dropdownPosition = dropdown.getBoundingClientRect();
              if (dropdownPosition.left > 120) {
                dropdown.classList.add('right-0');
              }
            });
          }
        }
      });
    });

    observeNewElements.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observeNewElements.disconnect();
    };
  }, []);

  return (
    <>
      <div className='border border-b-[#17A364]'>
        <h1 className='text-xl font-bold pt-[20px] pb-[15px] text-center text-[#17A364] border-[#17A364]'>
          History
        </h1>
        <div
          id='date-range-picker'
          className='flex flex-col gap-3 items-center justify-center py-4 px-6'
        >
          <div className='flex flex-row gap-4 items-center justify-center'>
            <Datepicker
              placeholder='Start Date'
              value={startDate || null}
              onChange={(date) => setStartDate(date)}
              className='w-[156.5px]'
            />
            <span>to</span>
            <Datepicker
              placeholder='End Date'
              value={endDate || null}
              onChange={(date) => setEndDate(date)}
              className='w-[156.5px] !right-0 left-auto'
            />
          </div>
        </div>
      </div>
      <TransactionLists
        startDate={startDate}
        endDate={endDate}
      />
    </>
  );
};

export default FilterDate;
