import React, { useState } from 'react';
import './styling/Search.css';
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

      const activitiesData = [
        {
          title: 'Bootstour am Neckar',
          desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
          longDesc: 'Erlebe Heilbronn aus einer ganz neuen Perspektive und genieße eine entspannte Fahrt auf dem Neckar. Während du sanft über das Wasser gleitest, erwarten dich atemberaubende Ausblicke auf die Stadt, historische Brücken und idyllische Uferlandschaften. Erfahre interessante Fakten über die Region und ihre Geschichte – entweder durch einen Live-Guide oder über Audiokommentare an Bord.',
          tags: ['Sport & Aktivitäten'],
          price: '€ 12 – 18 p.P.',
          duration: 'ca. 1,5 Stunden',
          providers: ['Neckar Tours', 'Heilbronn River Cruises'],
          isFavorite: true,
          image: Wein
        },
        {
          title: 'Weinverkostung',
          desc: 'Probiere exquisite regionale Weine und erfahre mehr über die Kunst des Weinbaus.',
          longDesc: 'Genieße eine exklusive Weinverkostung mit einer Auswahl der besten regionalen Weine. Lerne mehr über die Kunst des Weinbaus, die Rebsorten und die Geschichte des Weinbaus in der Region. Die Verkostung wird begleitet von einem Fachmann, der dir alle Details zu den Weinen erläutert und dir Tipps zur Weinwahl gibt.',
          tags: ['Essen & Trinken'],
          price: '€ 20 – 30 p.P.',
          duration: 'ca. 2 Stunden',
          providers: ['Weinbau Heilbronn', 'VinoTours'],
          isFavorite: false,
          image: Wein
        },
        {
          title: 'Bootstour am Neckar',
          desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
          longDesc: 'Genieße eine einzigartige Perspektive auf Heilbronn und seine Umgebung, während du sanft über den Neckar gleitest. Bei der Bootstour hast du die Möglichkeit, historische Sehenswürdigkeiten, malerische Ufer und Natur zu erleben. Du wirst von einem erfahrenen Guide begleitet, der dir alles über die Geschichte der Region erzählt.',
          tags: ['Sport & Aktivitäten'],
          price: '€ 12 – 18 p.P.',
          duration: 'ca. 1 Stunde',
          providers: ['Neckar Tours'],
          isFavorite: true,
          image: Wein
        },
        {
          title: 'Weinverkostung am Neckar',
          desc: 'Genieße eine Weinverkostung entlang des Neckars und entdecke regionale Weine.',
          longDesc: 'Erlebe die Aromen und den Geschmack der regionalen Weine, während du die herrliche Aussicht auf den Neckar genießt. Diese Weinverkostung ist perfekt für Weinliebhaber und bietet eine Vielzahl an Weinen, die direkt von lokalen Winzern stammen. Der Anbieter stellt eine persönliche Führung durch die Weingüter und die Verkostung bereit.',
          tags: ['Essen & Trinken'],
          price: '€ 25 – 35 p.P.',
          duration: 'ca. 2 Stunden',
          providers: ['Weinbau Heilbronn'],
          isFavorite: true,
          image: Wein
        }
      ];      

  // Kategorien extrahieren und Duplikate entfernen
  const allCategories = activitiesData.flatMap(activity => activity.tags);
  const uniqueCategories = ["Alle Aktivitäten", ...new Set(allCategories)];

  const [activeCategory, setActiveCategory] = useState("Alle Aktivitäten");
  const [showFavorites, setShowFavorites] = useState(false);
  const [activities, setActivities] = useState(activitiesData); // Aktivitäten im Zustand

  // Berechnet die Anzahl der favorisierten Aktivitäten unabhängig vom Filter
  const getFavoriteCount = () => {
    return activities.filter(a => a.isFavorite).length;
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
    setActivities(updatedActivities); // Status der Favoriten für eine Aktivität aktualisieren
  };

  // Filtert die Aktivitäten basierend auf der gewählten Kategorie
  const filteredActivities = activities.filter(a => {
    if (activeCategory === "Alle Aktivitäten") {
      return true; // Zeigt alle Aktivitäten, wenn "Alle Aktivitäten" gewählt ist
    }
    return a.tags.includes(activeCategory); // Filtert nach Tags der ausgewählten Kategorie
  });

  // Filtert nach Favoriten, wenn die "Favoriten"-Ansicht aktiv ist
  const filteredFavoriteActivities = showFavorites
    ? filteredActivities.filter(a => a.isFavorite)
    : filteredActivities;

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
            <div className='search-fav-text'>
              <h2>Anzahl favorisierter <br/> Aktivitäten</h2>
            </div>
            <div className='search-fav-number'>
              <h2>{getFavoriteCount()}</h2> {/* Zeigt die Gesamtzahl der favorisierten Aktivitäten */}
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
                <img src={a.image} alt={a.title} />
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <div className="search-activity-tags">
                  {a.tags.map((t, i) => (
                    <span key={i} className="search-tag">{t}</span>
                  ))}
                  <span className="search-price">{a.price}</span>
                </div>
                <button className="search-fav-button" onClick={() => handleFavoriteToggle(idx)}>
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
