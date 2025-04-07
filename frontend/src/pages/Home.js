import React, { useState } from 'react';
import './styling/Home.css';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Home() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isStartDateOpen, setStartDateOpen] = useState(false);
  const [isEndDateOpen, setEndDateOpen] = useState(false);

  const handleStartDateClick = () => {
    setStartDateOpen(true);
    setEndDateOpen(false);
  };

  const handleEndDateClick = () => {
    setEndDateOpen(true);
    setStartDateOpen(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartDateOpen(false);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  return (
    <div className='page-container'>
      <div className='page-content'>
        <h1>Reisedetails</h1>
        
        <div className="date-input">
          <h2>Anreisedatum</h2>
          <div className="date-entry" onClick={handleStartDateClick}>
            <EditCalendarIcon className='editCalendarIcon'/>
            <p>{startDate ? startDate.toLocaleDateString() : 'Datum hinzufügen'}</p>
            {isStartDateOpen && (
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                onClickOutside={() => setStartDateOpen(false)}
                popperPlacement="right"
              />
            )}
          </div>
          
          <h2>Abreisedatum</h2>
          <div className="date-entry" onClick={handleEndDateClick}>
            <EditCalendarIcon className='editCalendarIcon'/>
            <p>{endDate ? endDate.toLocaleDateString() : 'Datum hinzufügen'}</p>
            {isEndDateOpen && (
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                onClickOutside={() => setEndDateOpen(false)}
                popperPlacement="right"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
