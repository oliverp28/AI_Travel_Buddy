import React, { useState, forwardRef } from 'react';
import './styling/Home.css';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import PlatzHalter from './PlatzhalterKarte.png';
import SearchBuddy from './SearchBuddy.png';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 52.52, lng: 13.405 });
  const [isEndDateOpen, setEndDateOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const categories = [
    "Nachtleben & Partys",
    "Sehenswürdigkeiten",
    "Kultur & Museen",
    "Sport & Aktivitäten",
    "Essen & Trinken",
    "Shopping",
    "Natur & Wandern",
    "Wellness & Erholung",
    "Events & Festivals"
  ];

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
    setEndDateOpen(true);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndDateOpen(false);
  };

  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div className="date-entry" onClick={onClick} ref={ref}>
      <EditCalendarIcon className='editCalendarIcon' />
      <p>{value || 'Datum hinzufügen'}</p>
    </div>
  ));

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleClearDestination = () => {
    setDestination('');
  };

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
    } else {
      console.error("Autocomplete oder getPlace ist nicht verfügbar.");
    }
  };

  const handleAutocompleteLoad = (autocompleteInstance) => {
    if (autocompleteInstance) {
      setAutocomplete(autocompleteInstance);
    }
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  const handleSearch = () => {
    if (!startDate || !endDate || !destination) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setShowToast(false);
    navigate('/search', {
      state: {
        startDate,
        endDate,
        destination,
        selectedCategories
      }
    });
  };

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
            <h2>Anreisedatum</h2>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              customInput={<CustomDateInput />}
              popperPlacement="right"
              calendarClassName="custom-calendar"
              dateFormat="dd.MM.yyyy"
            />

            <h2>Abreisedatum</h2>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              customInput={<CustomDateInput onClick={() => setEndDateOpen(true)} />}
              popperPlacement="right"
              calendarClassName="custom-calendar"
              dateFormat="dd.MM.yyyy"
              minDate={startDate}
              open={isEndDateOpen}
              onClickOutside={() => setEndDateOpen(false)}
            />
          </div>

          <div className="destination-input">
            <div className='destination-input-field'>
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
                      placeholder={destination ? '' : 'Reiseziel eingeben...'}
                      value={destination}
                      onChange={handleDestinationChange}
                      className="destination-field"
                    />
                    {destination && (
                      <button
                        className="clear-button"
                        onClick={handleClearDestination}
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </Autocomplete>
              </LoadScript>
            </div>

            <div className="map-preview">
              {coordinates.lat !== 52.52 && coordinates.lng !== 13.405 ? (
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
              ) : (
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=49.1402,9.2181&zoom=12&size=600x300&markers=color:red%7Clabel:D%7C49.1402,9.2181&maptype=roadmap&key=AIzaSyDMU7CbrPL1RGy0f4VhsJ2mKH6VzqBRITw`}
                  alt="Platzhalter Karte DHBW Heilbronn"
                  style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px' }}
                />
              )}
            </div>
          </div>
        </div>

        <div className='category-search-box'>
          <div className="category-input">
            <div className="category-header">
              <h2>Kategorien</h2>
              <button
                className={`all-button ${selectedCategories.length === 0 ? 'active' : ''}`}
                onClick={clearCategories}
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
