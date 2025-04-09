import React from 'react';
import './styling/TravelPlan.css';
import { useLocation } from 'react-router-dom';
import { FaClock, FaEuroSign, FaPlus, FaTrash } from 'react-icons/fa';

const TravelPlan = () => {
  const location = useLocation();
  const { destination, startDate, endDate, favoriteActivities = [] } = location.state || {};

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      : '–';

  const parseDate = (dateStr) => new Date(dateStr);
  const getDayCount = (start, end) => {
    const diffTime = parseDate(end) - parseDate(start);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  };

  const distributeActivities = (activities, dayCount) => {
    const days = Array.from({ length: dayCount }, (_, i) => ({
      date: formatDate(new Date(parseDate(startDate).getTime() + i * 86400000)),
      activities: []
    }));

    activities.forEach((activity, index) => {
      const dayIndex = index % dayCount;
      days[dayIndex].activities.push({
        title: activity.title,
        duration: activity.duration,
        cost: activity.price.includes('Kostenlos') ? 'Kostenlos' : activity.price
      });
    });

    return days;
  };

  const dayCount = getDayCount(startDate, endDate);
  const days = distributeActivities(favoriteActivities, dayCount);
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return (
    <div className="travel-plan-page-container">
      <div className="travel-plan">
        <div className="travel-header">
          <div>
            <h2>Reiseplan 1</h2>
            <p>{destination || 'Unbekannt'}</p>
          </div>
          <div className="travel-dates">
            <span>{days.length} Tag{days.length !== 1 && 'e'}</span>
            <span>|</span>
            <span>{formattedStartDate} – {formattedEndDate}</span>
          </div>
        </div>

        {days.map((day, index) => (
          <div key={index} className="travel-day">
            <h4>{day.date}</h4>
            {day.activities.map((activity, idx) => (
              <div key={idx} className="activity-card">
                <div>
                  <p className="activity-title">{activity.title}</p>
                  <div className="activity-info">
                    <span><FaClock /> {activity.duration}</span>
                    <span>
                      <FaEuroSign />{' '}
                      {activity.cost === 'Kostenlos' ? (
                        <span className="free-tag">Kostenlos</span>
                      ) : (
                        activity.cost
                      )}
                    </span>
                  </div>
                </div>
                <button className="delete-btn">
                  <FaTrash />
                </button>
              </div>
            ))}
            <button className="add-activity">
              <FaPlus /> Aktivität hinzufügen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelPlan;
