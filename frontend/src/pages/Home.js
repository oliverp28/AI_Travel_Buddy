import React, { useState, useRef, forwardRef } from 'react';
import './styling/Home.css';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import SearchBuddy from './SearchBuddy.png';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 49.142692, lng: 9.218613 });

  const [autocomplete, setAutocomplete] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const endDatePickerRef = useRef(); // ⬅️ Ref für Abreisedatum
  const navigate = useNavigate();

  const categories = [
    "Nachtleben & Partys", "Sehenswürdigkeiten", "Kultur & Museen",
    "Sport & Aktivitäten", "Essen & Trinken", "Shopping",
    "Natur & Wandern", "Wellness & Erholung", "Events & Festivals"
  ];

  const [selectedCategories, setSelectedCategories] = useState(categories);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) setEndDate(null);

    // Öffne den Abreise-DatePicker automatisch nach kurzer Verzögerung
    setTimeout(() => {
      if (endDatePickerRef.current) {
        endDatePickerRef.current.setOpen(true);
      }
    }, 100);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = end.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div className="date-entry" onClick={onClick} ref={ref}>
      <EditCalendarIcon className='editCalendarIcon' />
      <p>{value || 'Datum hinzufügen'}</p>
    </div>
  ));

  const handleDestinationChange = (e) => setDestination(e.target.value);
  const handleClearDestination = () => setDestination('');

  const handlePlaceChanged = () => {
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
        setDestination(place.formatted_address || place.name);
      }
    }
  };

  const handleAutocompleteLoad = (instance) => setAutocomplete(instance);

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleAllCategories = () => {
    setSelectedCategories(
      selectedCategories.length === categories.length ? [] : categories
    );
  };

  const handleSearch = () => {
    if (!startDate || !endDate || !destination) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    navigate('/search', {
      state: {
        startDate,
        endDate,
        destination,
        selectedCategories
      }
    });
  };

  const tripDays = calculateDays(startDate, endDate);

  return (
    <div className='home-page-container'>
      <div className='page-content'>
        <h1>Reisedetails</h1>

        {showToast && (
          <div className="toast-error-fixed">
            Bitte wähle Anreise-, Abreisedatum und ein Reiseziel aus.
          </div>
        )}

        <div className='date-destination-box'>
          <div className="date-input">
            <div className="date-left">
              <h2>Anreisedatum</h2>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                customInput={<CustomDateInput />}
                calendarClassName="custom-calendar"
                dateFormat="dd.MM.yyyy"
                popperPlacement="right"
              />

              <h2>Abreisedatum</h2>
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                customInput={<CustomDateInput />}
                calendarClassName="custom-calendar"
                dateFormat="dd.MM.yyyy"
                minDate={startDate}
                popperPlacement="right"
                ref={endDatePickerRef} // ⬅️ Ref einfügen
              />
            </div>

            <div className='deco-stripe-date'></div>
            <div className="date-right">
              <EditCalendarOutlinedIcon className="date-icon" style={{ fontSize: '15rem' }} />
              <div className="trip-duration">
                <span className="trip-days-number">{tripDays}</span>
                <span className="trip-days-label">{tripDays === 1 ? ' Tag' : ' Tage'}</span>
              </div>
            </div>
          </div>

          <div className="destination-input">
            <ExploreOutlinedIcon className="explore-icon" style={{ fontSize: '17rem' }} />
            <div className="destination-input-field">
              <h2>Reiseziel</h2>
              <LoadScript
                googleMapsApiKey="AIzaSyBqUfSeEybai2d--BPLnSmifIWxW0x8ETw"
                libraries={['places']}
              >
                <Autocomplete
                  onLoad={handleAutocompleteLoad}
                  onPlaceChanged={handlePlaceChanged}
                  options={{
                    types: ['(cities)'],
                    componentRestrictions: { country: ['de', 'at', 'ch'] },
                  }}
                >
                  <div className="input-container">
                    <input
                      type="text"
                      placeholder="Reiseziel eingeben..."
                      value={destination}
                      onChange={handleDestinationChange}
                      className="destination-field"
                    />
                    {destination && (
                      <button className="clear-button" onClick={handleClearDestination}>
                        &times;
                      </button>
                    )}
                  </div>
                </Autocomplete>
              </LoadScript>
            </div>

            <div className='deco-stripe-destination'></div>

            <LoadScript
              googleMapsApiKey="AIzaSyBqUfSeEybai2d--BPLnSmifIWxW0x8ETw"
              libraries={['places']}
            >
              <div className="map-preview">
                <GoogleMap
                  center={coordinates}
                  zoom={15}
                  mapContainerStyle={{ height: '300px', width: '100%' }}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true
                  }}
                >
                  <Marker position={coordinates} />
                </GoogleMap>
              </div>
            </LoadScript>
          </div>
        </div>

        <div className='category-search-box'>
          <div className="category-input">
            <div className="category-header">
              <h2>Kategorien</h2>
              <button
                className={`all-button ${selectedCategories.length === categories.length ? 'active' : ''}`}
                onClick={toggleAllCategories}
              >
                Alle Aktivitäten
              </button>
            </div>
            <hr />
            <div className="category-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-button ${selectedCategories.includes(cat) ? 'active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div
            className="search-input"
            onClick={handleSearch}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          >
            <img src={SearchBuddy} className='SearchBuddy' alt="Search Buddy" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
