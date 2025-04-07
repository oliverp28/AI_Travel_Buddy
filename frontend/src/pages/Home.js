import React, { useState, forwardRef } from 'react';
import './styling/Home.css';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import PlatzHalter from './PlatzhalterKarte.png';

function Home() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [destination, setDestination] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 52.52, lng: 13.405 }); // Standardwert: Berlin
  const [isEndDateOpen, setEndDateOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);

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

  return (
    <div className='page-container'>
      <div className='page-content'>
        <h1>Reisedetails</h1>
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
                    {/* Clear Button */}
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
        <div className="category-input">
            <h2>Reisekategorie</h2>
            <select className="category-dropdown">
              <option value="">Wählen Sie eine Kategorie</option>
              <option value="business">Business</option>
              <option value="vacation">Urlaub</option>
              <option value="adventure">Abenteuer</option>
              <option value="family">Familie</option>
            </select>
          </div>
      </div>
    </div>
  );
}

export default Home;
