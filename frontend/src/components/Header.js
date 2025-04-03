// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styling/Header.css';
import MapIcon from '@mui/icons-material/Map';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


function Header() {
  return (
    <header>
      <h1>
        <span className="travel">Travel</span>
        <span className="buddy">Buddy</span>
        <br/>
        <span className="description">Reisen leicht gemacht - Entdecke, plane, genieße!</span>
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="/inspiration">
              <AutoAwesomeIcon className='autoAwesomeIcon'/> 
              Lass dich Inspirieren!
            </Link>
          </li>
          <li>
            <Link to="/my_travel_plans">
              <CalendarMonthIcon className='calendarMonthIcon'/>
              Meine Reisepläne
            </Link>
          </li>
          <li>
            <Link to="/">
              <MapIcon />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
