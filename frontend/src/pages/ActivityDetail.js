import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './styling/ActivityDetail.css';
import SearchBuddy from './SearchBuddy.png';

const activitiesData = [
  {
    id: 0,
    title: 'Bootstour am Neckar',
    desc: 'Entdecke die Stadt vom Wasser aus und genieße eine entspannte Fahrt auf dem Neckar.',
    longDesc: 'Erlebe Heilbronn aus einer ganz neuen Perspektive und genieße eine entspannte Fahrt auf dem Neckar. Während du sanft über das Wasser gleitest, erwarten dich atemberaubende Ausblicke auf die Stadt, historische Brücken und idyllische Uferlandschaften. Erfahre interessante Fakten über die Region und ihre Geschichte – entweder durch einen Live-Guide oder über Audiokommentare an Bord.',
    tags: ['Sport & Aktivitäten'],
    price: '€ 12 – 18 p.P.',
    duration: 'ca. 1,5 Stunden',
    providers: ['Neckar Tours', 'Heilbronn River Cruises'],
    isFavorite: true,
    image: SearchBuddy,
  },
  {
    id: 1,
    title: 'Weinverkostung',
    desc: 'Probiere exquisite regionale Weine und erfahre mehr über die Kunst des Weinbaus.',
    longDesc: 'Genieße eine exklusive Weinverkostung mit einer Auswahl der besten regionalen Weine. Lerne mehr über die Kunst des Weinbaus, die Rebsorten und die Geschichte des Weinbaus in der Region. Die Verkostung wird begleitet von einem Fachmann, der dir alle Details zu den Weinen erläutert und dir Tipps zur Weinwahl gibt.',
    tags: ['Essen & Trinken'],
    price: '€ 20 – 30 p.P.',
    duration: 'ca. 2 Stunden',
    providers: ['Weinbau Heilbronn', 'VinoTours'],
    isFavorite: false,
  },
];

function ActivityDetail() {
  const { id } = useParams();
  const activity = activitiesData.find(a => a.id === parseInt(id));

  if (!activity) {
    return <div>Aktivität nicht gefunden!</div>;
  }

  return (
    <div className="activity-detail-page-container">

        <div className="activity-detail-image-container">
        <img src={activity.image} alt={activity.title} className="activity-detail-image" />
        </div>
        <div className="activity-detail-title">
          <h1>{activity.title}</h1>
          <p>{activity.tags.join(' | ')}</p>
          <p className="activity-price">{activity.price}</p>
          <p className="activity-duration">{activity.duration}</p>
        </div>

      <div className="activity-detail-description">
        <h3>Beschreibung</h3>
        <p>{activity.longDesc}</p>
      </div>

      <div className="activity-detail-providers">
        <h3>Anbieter</h3>
        <ul>
          {activity.providers.map((provider, index) => (
            <li key={index}>{provider}</li>
          ))}
        </ul>
      </div>

      <div className="activity-detail-footer">
        <button className="back-button">Zurück zur Suche</button>
        <button className="fav-button">
          {activity.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
        </button>
      </div>
    </div>
  );
}

export default ActivityDetail;
