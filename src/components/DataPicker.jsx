// src/components/DatePicker.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function DatePicker({ onDateChange }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const handleChange = (e) => {
    const val = e.target.value;
    setDate(val);
    onDateChange(val);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="log-date" className="text-sm opacity-80">📅 Date</label>
      <input
        type="date"
        id="log-date"
        value={date}
        onChange={handleChange}
        className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white"
        max={today}
      />
    </div>
  );
}

DatePicker.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};