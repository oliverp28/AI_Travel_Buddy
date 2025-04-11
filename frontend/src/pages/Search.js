import React, { useState, useEffect } from 'react';
import './styling/Search.css';
import './styling/Modal.css';
import { Link, useLocation } from 'react-router-dom';
import PlanIcon from '@mui/icons-material/Map';
import Modal from './Modal.js';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShowBuddy from './ShowBuddy.png';
import Essen from './categoryBanner/Essen.png';
import Events from './categoryBanner/Events.png';
import Kultur from './categoryBanner/Kultur.png';
import Natur from './categoryBanner/Natur.png';
import Einkaufen from './categoryBanner/Einkaufen.png';
import Sightseeing from './categoryBanner/Sightseeing.png';
import Sport from './categoryBanner/Sport.png';
import Wellness from './categoryBanner/Wellness.png';
import Nachtleben from './categoryBanner/Nachtleben.png';

import EssenMitText from './categoryBanner/Essen2.png';
import EventsMitText from './categoryBanner/Events2.png';
import KulturMitText from './categoryBanner/Kultur2.png';
import NaturMitText from './categoryBanner/Natur2.png';
import EinkaufenMitText from './categoryBanner/Einkaufen2.png';
import SightseeingMitText from './categoryBanner/Sightseeing2.png';
import SportMitText from './categoryBanner/Sport2.png';
import WellnessMitText from './categoryBanner/Wellness2.png';
import NachtlebenMitText from './categoryBanner/Nachtleben2.png';


const categoryImages = {
  "Essen & Trinken": Essen,
  "Events & Festivals": Events,
  "Kultur & Museen": Kultur,
  "Natur & Wandern": Natur,
  "Shopping": Einkaufen,
  "Sehenswürdigkeiten": Sightseeing,
  "Sport & Aktivitäten": Sport,
  "Wellness & Erholung": Wellness,
  "Nachtleben & Partys": Nachtleben
};

const categoryImagesWithText = {
  "Essen & Trinken": EssenMitText,
  "Events & Festivals": EventsMitText,
  "Kultur & Museen": KulturMitText,
  "Natur & Wandern": NaturMitText,
  "Shopping": EinkaufenMitText,
  "Sehenswürdigkeiten": SightseeingMitText,
  "Sport & Aktivitäten": SportMitText,
  "Wellness & Erholung": WellnessMitText,
  "Nachtleben & Partys": NachtlebenMitText
};

function parseGPTActivities(text) {
  const blocks = text.trim().split("\n\n");
  return blocks.map((block) => {
    const get = (regex) => (block.match(regex)?.[1] || "").trim();
    const category = get(/Kategorie:\s*(.+)/);

    return {
      title: get(/→ Name:\s*(.+)/),
      desc: get(/→ Kurzbeschreibung:\s*(.+)/),
      longDesc: get(/→ Langbeschreibung:\s*(.+)/),
      tags: [category],
      price: get(/→ Preis pro Person:\s*(.+)/),
      duration: get(/→ Dauer:\s*(.+)/),
      providers: [get(/→ Anbieter:\s*(.+)/)],
      isFavorite: false,
      image: categoryImages[category],
      imageWithText: categoryImagesWithText[category]
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
          {(() => {
            const currentActivity = activities.find(a => a.title === selectedActivity.title);
            if (!currentActivity) return null;

            return (
              <>
                <div className="modal-image-container">
                  <img
                    src={currentActivity.imageWithText}
                    alt=""
                    className="modal-image-background"
                  />
                  <div className="modal-fade-left"></div>
                  <div className="modal-fade-right"></div>
                  <img
                    src={currentActivity.imageWithText}
                    alt={currentActivity.title}
                    className="modal-image"
                  />

                  <button
                    className={`modal-fav-button ${currentActivity.isFavorite ? 'favorite' : 'not-favorite'}`}
                    onClick={() => handleFavoriteToggle(currentActivity.title)}
                  >
                    {currentActivity.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                  </button>
                </div>

                <div className="modal-content-container">
                  <div className='modal-title-container'>
                    <p className='activity-detail-title'>{currentActivity.title}</p>
                    <div className="modal-tags">
                      {currentActivity.tags.map((t, i) => (
                        <span key={i} className="detail-search-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                  <p className='activity-detail-longdesc'>{currentActivity.longDesc}</p>

                  <div className="activity-detail-info-container">
                    <div className="activity-detail-info-wrapper">
                      <div className="activity-detail-info step-1">
                        <strong className="activity-detail-info-text">Voraussichtliche Dauer:</strong>
                        <span className="activity-detail-value">{currentActivity.duration}</span>
                      </div>
                      <div className="activity-detail-info step-2">
                        <strong className="activity-detail-info-text">Voraussichtlicher Preis:</strong>
                        <span className="activity-detail-value">{currentActivity.price}</span>
                      </div>
                      <div className="activity-detail-info step-3">
                        <strong className="activity-detail-info-text">Veranstalter:</strong>
                        <span className="activity-detail-value">{currentActivity.providers.join(', ')}</span>
                      </div>
                    </div>
                    <div className="activity-detail-buddy">
                      <img src={ShowBuddy} className='activity-detail-buddy-image' alt="Search Buddy" />
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </Modal>
      )}

    </div>
  );
}

export default Search;
