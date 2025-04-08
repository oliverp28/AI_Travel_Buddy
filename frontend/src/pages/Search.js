import React, { useState } from 'react';
import './styling/Search.css';
import Bootstour from './SearchBuddy.png';
import Wein from './SearchBuddy.png';
import { useLocation } from 'react-router-dom';
import PlanIcon from '@mui/icons-material/Map';

function Search() {
  const location = useLocation();
  const { startDate, endDate, destination } = location.state || {};
  
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      : '–';
  
  const formattedDate =
    startDate && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : '–';

  const categories = [
    "Alle Aktivitäten",
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

  const [activeCategory, setActiveCategory] = useState("Alle Aktivitäten");
  const [showFavorites, setShowFavorites] = useState(false);

  const activities = [
    {
      title: 'Bootstour am Neckar',
      desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
      tags: ['Sport & Aktivitäten'],
      price: '€ 12 – 18 p.P.',
      image: Bootstour,
      isFavorite: true
    },
    {
      title: 'Weinverkostung',
      desc: 'Probiere exquisite regionale Weine und erfahre mehr über die Kunst des Weinbaus.',
      tags: ['Essen & Trinken'],
      price: '€ 20 – 30 p.P.',
      image: Wein,
      isFavorite: false
    },
    {
      title: 'Bootstour am Neckar',
      desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
      tags: ['Sport & Aktivitäten'],
      price: '€ 12 – 18 p.P.',
      image: Bootstour,
      isFavorite: true
    },
    {
      title: 'Bootstour am Neckar',
      desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
      tags: ['Sport & Aktivitäten'],
      price: '€ 12 – 18 p.P.',
      image: Bootstour,
      isFavorite: true
    },{
      title: 'Bootstour am Neckar',
      desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
      tags: ['Sport & Aktivitäten'],
      price: '€ 12 – 18 p.P.',
      image: Bootstour,
      isFavorite: true
    },
  ];

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const filteredActivities = showFavorites
    ? activities.filter(a => a.isFavorite)
    : activities;

  return (
    <div className='search-page-container'>
      <div className='search-header'>
        <div className='search-info-box'>
          <div className="search-summary">
            <h2>Datum</h2>
            <p>{formattedDate}</p>
            <h2>Reiseziel</h2>
            <p>{destination || '–'}</p>
          </div>

          <div className="search-categories">
            <h2>Kategorien</h2>
            <div className="search-tags">
              {categories.map((category) => (
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
            <div className='search-fav-text'>
              <h2>Anzahl favorisierter <br/> Aktivitäten</h2>
            </div>
            <div className='search-fav-number'>
              <h2>{activities.filter(a => a.isFavorite).length}</h2>
            </div>
          </div>

          <button className="search-plan-button">
            <PlanIcon className='PlanIcon' /> 
            <br/>
            Smarten Reiseplan generieren
          </button>
        </div>

        <div className='search-activities-box'>
          <div className="search-activities-header">
            <div>
              <h1>Reiseplanung</h1>
              <p>{filteredActivities.length} passende Aktivitäten gefunden</p>
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
            {filteredActivities.map((a, idx) => (
              <div key={idx} className="search-activity-card">
                <img src={a.image} alt={a.title} />
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <div className="search-activity-tags">
                  {a.tags.map((t, i) => (
                    <span key={i} className="search-tag">{t}</span>
                  ))}
                  <span className="search-price">{a.price}</span>
                </div>
                <button className="search-fav-button">
                  {a.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
