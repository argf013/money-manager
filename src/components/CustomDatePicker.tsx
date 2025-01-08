import React, { useState } from 'react';

const CustomDatePicker: React.FC<{
  value: string;
  onChange: (date: string) => void;
}> = ({ value, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onChange(date);
    setShowCalendar(false);
  };

  const renderCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) =>
      (i + 1).toString().padStart(2, '0'),
    );
    return (
      <div className='absolute bg-white border border-gray-300 rounded-lg shadow-lg p-2'>
        {days.map((day) => (
          <div
            key={day}
            className='cursor-pointer p-1 hover:bg-gray-200'
            onClick={() => handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='relative'>
      <input
        type='text'
        value={selectedDate}
        onFocus={() => setShowCalendar(true)}
        onChange={(e) => setSelectedDate(e.target.value)}
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5'
        placeholder='Select date'
      />
      {showCalendar && renderCalendar()}
    </div>
  );
};

export default CustomDatePicker;
