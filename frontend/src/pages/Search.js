import React, { useState, useEffect } from 'react';
import './styling/Search.css';
import './styling/Modal.css';
import ModalImage from './ModalImage.png';
import { Link, useLocation } from 'react-router-dom';
import PlanIcon from '@mui/icons-material/Map';
import Modal from './Modal.js';
import EditNoteIcon from '@mui/icons-material/EditNote';

function parseGPTActivities(text) {
  const blocks = text.trim().split("\n\n");
  return blocks.map((block) => {
    const get = (regex) => (block.match(regex)?.[1] || "").trim();
    return {
      title: get(/→ Name:\s*(.+)/),
      desc: get(/→ Kurzbeschreibung:\s*(.+)/),
      longDesc: get(/→ Langbeschreibung:\s*(.+)/),
      tags: [get(/Kategorie:\s*(.+)/)],
      price: get(/→ Preis pro Person:\s*(.+)/),
      duration: get(/→ Dauer:\s*(.+)/),
      providers: [get(/→ Anbieter:\s*(.+)/)],
      isFavorite: false,
      image: ModalImage
    };
  }).filter(a => a.title);
}

function Search() {
  const location = useLocation();
  const { startDate, endDate, destination, selectedCategories } = location.state || {};

  const [activeCategory, setActiveCategory] = useState('Alle Aktivitäten');
  const [showFavorites, setShowFavorites] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '–';

  const formattedDate =
    startDate && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : '–';

  const allCategories = activities.flatMap((activity) => activity.tags);
  const uniqueCategories = ['Alle Aktivitäten', ...new Set(allCategories)];

  const getFavoriteCount = () => {
    return activities.filter((a) => a.isFavorite).length;
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  // ✅ Fix: Vergleiche anhand des Titels
  const handleFavoriteToggle = (title) => {
    const updatedActivities = activities.map((a) =>
      a.title === title ? { ...a, isFavorite: !a.isFavorite } : a
    );
    setActivities(updatedActivities);
  };

  const handleOpenModal = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
  };

  const filteredActivities = activities.filter((a) => {
    if (activeCategory === 'Alle Aktivitäten') return true;
    return a.tags.includes(activeCategory);
  });

  const filteredFavoriteActivities = showFavorites
    ? filteredActivities.filter((a) => a.isFavorite)
    : filteredActivities;

  const handleSmartPlan = async () => {
    const anreise = startDate;
    const abreise = endDate;
    const ziel = destination;
    const kategorien = selectedCategories || [];

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anreise, abreise, ziel, kategorien }),
      });

      if (!response.ok) throw new Error('Fehler bei der API-Anfrage');

      const data = await response.json();
      const parsed = parseGPTActivities(data.activities);
      setActivities(parsed);
    } catch (error) {
      console.error('Fehler beim Generieren des Plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSmartPlan();
  }, []);

  return (
    <div className="search-page-container">
      <div className="search-header">
        <div className="search-info-box">
          <div className="search-summary">
            <Link to="/">
              <EditNoteIcon fontSize="large" className="EditNoteIcon" />
            </Link>
            <h2>Datum</h2>
            <p className='search-data'>{formattedDate}</p>
            <h2>Reiseziel</h2>
            <p className='search-data'>{destination || '–'}</p>
          </div>

          <div className="search-categories">
            <h2>Kategorien</h2>
            <div className="search-tags">
              {uniqueCategories.map((category) => (
                <button
                  key={category}
                  className={`category-button ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="search-fav-count">
            <div className="search-fav-text">
              <h2>Anzahl favorisierter <br /> Aktivitäten</h2>
            </div>
            <div className="search-fav-number">
              <h2>{getFavoriteCount()}</h2>
            </div>
          </div>

          <Link
            to="/travel-plan"
            state={{
              destination,
              startDate,
              endDate,
              favoriteActivities: activities.filter(a => a.isFavorite)
            }}
          >
            <button className="search-plan-button">
              <PlanIcon className="PlanIcon" />
              <br />
              Smarten Reiseplan generieren
            </button>
          </Link>
        </div>

        <div className="search-activities-box">
          <div className="search-activities-header">
            <div>
              <h1>Reiseplanung</h1>
              <p>{filteredFavoriteActivities.length} passende Aktivitäten gefunden</p>
            </div>
            <div className="switch-container">
              <button
                className={`switch-button ${!showFavorites ? 'active' : ''}`}
                onClick={handleToggleFavorites}
              >
                Alle Aktivitäten
              </button>
              <button
                className={`switch-button ${showFavorites ? 'active' : ''}`}
                onClick={handleToggleFavorites}
              >
                Favoriten
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-box">
              <p className="loading-text">Lade Aktivitäten...</p>
              <div className="loading-bar">
                <div className="loading-fill" />
              </div>
            </div>
          ) : (
            <div className="search-activities-grid">
              {filteredFavoriteActivities.map((a) => (
                <div key={a.title} className="search-activity-card">
                  <div className="search-activity-link" onClick={() => handleOpenModal(a)}>
                    <img src={a.image} alt={a.title} />
                    <h3>{a.title}</h3>
                    <p>{a.desc}</p>
                    <div className="search-activity-tags">
                      {a.tags.map((t, i) => (
                        <span key={i} className="search-tag">{t}</span>
                      ))}
                      <span className="search-price">{a.price}</span>
                    </div>
                  </div>

                  <button
                    className={`search-fav-button ${a.isFavorite ? 'favorite' : 'not-favorite'}`}
                    onClick={() => handleFavoriteToggle(a.title)}
                  >
                    {a.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedActivity && (
        <Modal onClose={handleCloseModal}>
          <div className="modal-image-container">
            <img
              src={selectedActivity.image}
              alt={selectedActivity.title}
              className='modal-image'
            />
          </div>
          <div className="modal-content-container">
            <p className='activity-detail-title'>{selectedActivity.title}</p>
            <p className='activity-detail-longdesc'>{selectedActivity.longDesc}</p>
            <div className="modal-tags">
              {selectedActivity.tags.map((t, i) => (
                <span key={i} className="search-tag">{t}</span>
              ))}
            </div>
            <p><strong>Dauer:</strong> {selectedActivity.duration}</p>
            <p><strong>Anbieter:</strong> {selectedActivity.providers.join(', ')}</p>
            <p><strong>Preis:</strong> {selectedActivity.price}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Search;
