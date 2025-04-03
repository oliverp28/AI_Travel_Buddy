// Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styling/Header.css';
import MapIcon from '@mui/icons-material/Map';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
{/* import logo from "./TravelBuddyLogo.png"; */}

function Header() {
  const location = useLocation();
  return (
    <header>
      <h1>
        {/* <img src={logo} className="logo" /> */}
        <span className="travel">Travel</span>
        <span className="buddy">Buddy</span>
        <br/>
        <span className="description">Reisen leicht gemacht - Entdecke, plane, genieße!</span>
      </h1>
      <nav>
        <ul>
          <li className={location.pathname === "/inspiration" ? "active" : ""}>
            <Link to="/inspiration">
              <AutoAwesomeIcon className='autoAwesomeIcon'/> 
              Lass dich Inspirieren!
            </Link>
          </li>
          <li className={location.pathname === "/my_travel_plans" ? "active" : ""}>
            <Link to="/my_travel_plans">
              <CalendarMonthIcon className='calendarMonthIcon'/>
              Meine Reisepläne
            </Link>
          </li>
          <li className={location.pathname === "/" ? "active" : ""}>
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
