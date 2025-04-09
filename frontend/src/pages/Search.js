import React, { useState } from 'react';
import './styling/Search.css';
import './styling/Modal.css';
import ModalImage from './ModalImage.png';
import { Link, useLocation } from 'react-router-dom';
import PlanIcon from '@mui/icons-material/Map';
import Modal from './Modal.js';

function Search() {
  const location = useLocation();
  const { startDate, endDate, destination } = location.state || {};

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

  const activitiesData = [
    {
      id: 0,
      title: 'Bootstour am Neckar',
      desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
      longDesc:
        'Erlebe Heilbronn aus einer ganz neuen Perspektive und genieße eine entspannte Fahrt auf dem Neckar. Während du sanft über das Wasser gleitest, erwarten dich atemberaubende Ausblicke auf die Stadt, historische Brücken und idyllische Uferlandschaften. Erfahre interessante Fakten über die Region und ihre Geschichte – entweder durch einen Live-Guide oder über Audiokommentare an Bord.',
      tags: ['Sport & Aktivitäten'],
      price: '€ 12 – 18 p.P.',
      duration: 'ca. 1,5 Stunden',
      providers: ['Neckar Tours', 'Heilbronn River Cruises'],
      isFavorite: true,
      image: ModalImage,
    },
    {
      id: 1,
      title: 'Weinverkostung',
      desc: 'Probiere exquisite regionale Weine und erfahre mehr über die Kunst des Weinbaus.',
      longDesc:
        'Genieße eine exklusive Weinverkostung mit einer Auswahl der besten regionalen Weine. Lerne mehr über die Kunst des Weinbaus, die Rebsorten und die Geschichte des Weinbaus in der Region. Die Verkostung wird begleitet von einem Fachmann, der dir alle Details zu den Weinen erläutert und dir Tipps zur Weinwahl gibt.',
      tags: ['Essen & Trinken'],
      price: '€ 20 – 30 p.P.',
      duration: 'ca. 2 Stunden',
      providers: ['Weinbau Heilbronn', 'VinoTours'],
      isFavorite: false,
      image: ModalImage,
    },
    {
      id: 2,
      title: 'Bootstour am Neckar',
      desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
      longDesc:
        'Genieße eine einzigartige Perspektive auf Heilbronn und seine Umgebung, während du sanft über den Neckar gleitest. Bei der Bootstour hast du die Möglichkeit, historische Sehenswürdigkeiten, malerische Ufer und Natur zu erleben. Du wirst von einem erfahrenen Guide begleitet, der dir alles über die Geschichte der Region erzählt.',
      tags: ['Sport & Aktivitäten'],
      price: '€ 12 – 18 p.P.',
      duration: 'ca. 1 Stunde',
      providers: ['Neckar Tours'],
      isFavorite: true,
      image: ModalImage,
    },
    {
      id: 3,
      title: 'Weinverkostung am Neckar',
      desc: 'Genieße eine Weinverkostung entlang des Neckars und entdecke regionale Weine.',
      longDesc:
        'Erlebe die Aromen und den Geschmack der regionalen Weine, während du die herrliche Aussicht auf den Neckar genießt. Diese Weinverkostung ist perfekt für Weinliebhaber und bietet eine Vielzahl an Weinen, die direkt von lokalen Winzern stammen. Der Anbieter stellt eine persönliche Führung durch die Weingüter und die Verkostung bereit.',
      tags: ['Essen & Trinken'],
      price: '€ 25 – 35 p.P.',
      duration: 'ca. 2 Stunden',
      providers: ['Weinbau Heilbronn'],
      isFavorite: true,
      image: ModalImage,
    },
  ];

  const allCategories = activitiesData.flatMap((activity) => activity.tags);
  const uniqueCategories = ['Alle Aktivitäten', ...new Set(allCategories)];

  const [activeCategory, setActiveCategory] = useState('Alle Aktivitäten');
  const [showFavorites, setShowFavorites] = useState(false);
  const [activities, setActivities] = useState(activitiesData);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const getFavoriteCount = () => {
    return activities.filter((a) => a.isFavorite).length;
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleFavoriteToggle = (index) => {
    const updatedActivities = [...activities];
    updatedActivities[index].isFavorite = !updatedActivities[index].isFavorite;
    setActivities(updatedActivities);
  };

  const handleOpenModal = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
  };

  const filteredActivities = activities.filter((a) => {
    if (activeCategory === 'Alle Aktivitäten') {
      return true;
    }
    return a.tags.includes(activeCategory);
  });

  const filteredFavoriteActivities = showFavorites
    ? filteredActivities.filter((a) => a.isFavorite)
    : filteredActivities;

  return (
    <div className="search-page-container">
      <div className="search-header">
        <div className="search-info-box">
          <div className="search-summary">
            <h2>Datum</h2>
            <p>{formattedDate}</p>
            <h2>Reiseziel</h2>
            <p>{destination || '–'}</p>
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

          <Link to="/travel-plan">
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

          <div className="search-activities-grid">
            {filteredFavoriteActivities.map((a, idx) => (
              <div key={idx} className="search-activity-card">
                <div
                  className="search-activity-link"
                  onClick={() => handleOpenModal(a)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={a.image} alt={a.title} />
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <div className="search-activity-tags">
                    {a.tags.map((t, i) => (
                      <span key={i} className="search-tag">
                        {t}
                      </span>
                    ))}
                    <span className="search-price">{a.price}</span>
                  </div>
                </div>

                <button
                  className={`search-fav-button ${a.isFavorite ? 'favorite' : 'not-favorite'}`}
                  onClick={() => handleFavoriteToggle(idx)}
                >
                  {a.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
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
          <p>{selectedActivity.longDesc}</p>
            <div className="modal-tags">
              {selectedActivity.tags.map((t, i) => (
                <span key={i} className="search-tag">
                  {t}
                </span>
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
