import React, { useState } from 'react';
import './styling/TravelPlan.css';
import { useLocation } from 'react-router-dom';
import { FaClock, FaEuroSign, FaTrash } from 'react-icons/fa';
import jsPDF from 'jspdf';
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';
import { arrayMove } from '@dnd-kit/sortable';
import logoImage from './BeerBuddy.png';

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
        id: `${index}-${activity.title}`,
        ...activity
      });
    });

    return days;
  };

  const dayCount = getDayCount(startDate, endDate);
  const [days, setDays] = useState(distributeActivities(favoriteActivities, dayCount));

  const handleDelete = (dayIndex, activityIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].activities.splice(activityIndex, 1);
    setDays(updatedDays);
  };

  const handleExportPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let y = margin;

    const toDataURL = url =>
      fetch(url)
        .then(res => res.blob())
        .then(blob => new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }));

    const imageData = await toDataURL(logoImage);
    pdf.addImage(imageData, 'PNG', margin, y, 20, 20);
    y += 12;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor('#007acc');
    pdf.text('Dein Reiseplan mit TravelBuddy', pageWidth / 2, y, { align: 'center' });
    y += 16;

    pdf.setDrawColor('#007acc');
    pdf.setFillColor(240, 248, 255);
    pdf.roundedRect(margin, y, pageWidth - 2 * margin, 25, 3, 3, 'F');
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor('#114274');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Reiseziel: ${destination || 'Unbekannt'}`, margin + 4, y + 7);
    pdf.text(`Reisedaten: ${formatDate(startDate)} – ${formatDate(endDate)}`, margin + 4, y + 14);
    pdf.text(`Anzahl Tage: ${days.length}`, margin + 4, y + 21);
    y += 40;

    days.forEach((day, i) => {
      const boxHeight = 20;
      const activitiesHeight = day.activities.length * (boxHeight + 4);
      const headingHeight = 20;
      const totalSpaceNeeded = headingHeight + activitiesHeight;
    
      if (y + totalSpaceNeeded > 270) {
        pdf.addPage();
        y = margin;
      }
    
      if (i > 0) y += 12;
    
      pdf.setFontSize(14);
      pdf.setTextColor('#007acc');
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Tag ${i + 1} – ${day.date}`, margin, y);
      y += 8;
    
      if (day.activities.length === 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor('#114274');
        pdf.text('Keine Aktivitäten geplant', margin + 4, y);
        y += 10;
      } else {
        day.activities.forEach((activity) => {
          const spaceNeeded = boxHeight + 4;
    
          if (y + spaceNeeded > 270) {
            pdf.addPage();
            y = margin;
          }
    
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor('#114274');
          pdf.setFillColor(240, 248, 255);
          pdf.roundedRect(margin, y, pageWidth - 2 * margin, boxHeight, 3, 3, 'F');
          pdf.text(activity.title, margin + 5, y + 7);
    
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'normal');
          const cost = activity.price.includes('Kostenlos') ? 'Kostenlos' : activity.price;
          pdf.text(`Dauer: ${activity.duration}   |   Preis: ${cost}`, margin + 5, y + 14);
    
          y += spaceNeeded;
        });
      }
    });
    
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor('#114274');
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Seite ${i} von ${pageCount}`, pageWidth / 2, 287, { align: 'center' });
      pdf.text('TravelBuddy © 2025', pageWidth - margin, 287, { align: 'right' });
    }

    pdf.save('Reiseplan.pdf');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const dayIndex = parseInt(source.droppableId);
      const items = [...days[dayIndex].activities];
      const reordered = arrayMove(items, source.index, destination.index);
      const newDays = [...days];
      newDays[dayIndex].activities = reordered;
      setDays(newDays);
    } else {
      const sourceDayIndex = parseInt(source.droppableId);
      const destDayIndex = parseInt(destination.droppableId);
      const sourceItems = [...days[sourceDayIndex].activities];
      const destItems = [...days[destDayIndex].activities];
      const [movedItem] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedItem);
      const newDays = [...days];
      newDays[sourceDayIndex].activities = sourceItems;
      newDays[destDayIndex].activities = destItems;
      setDays(newDays);
    }
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return (
    <div className="travel-plan-page-container">
      <div className="travel-header">
        <div>
          <h2>Dein Reiseplan im Überblick</h2>
          <p>{destination || 'Unbekannt'}</p>
        </div>
        <div className="travel-dates">
          <span>{days.length} Tag{days.length !== 1 && 'e'}</span>
          <span>|</span>
          <span>{formattedStartDate} – {formattedEndDate}</span>
        </div>
        <button className="export-btn" onClick={handleExportPDF}>Exportieren als PDF</button>
      </div>

      <div className="travel-plan">
        <DragDropContext onDragEnd={onDragEnd}>
          {days.map((day, dayIndex) => (
            <Droppable droppableId={`${dayIndex}`} key={dayIndex}>
              {(provided) => (
                <div
                  className="travel-day"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h4>{day.date}</h4>
                  {day.activities.length === 0 ? (
                    <div className="no-activity">Keine Aktivitäten geplant</div>
                  ) : (
                    day.activities.map((activity, idx) => (
                      <Draggable draggableId={activity.id} index={idx} key={activity.id}>
                        {(provided) => (
                          <div
                            className="activity-card compact"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div>
                              <p className="activity-title small">{activity.title}</p>
                              <div className="activity-info">
                                <span className='duartion-info-activity'><FaClock /> {activity.duration}</span>
                                <span className='price-info-activity'>
                                  <FaEuroSign />{' '}
                                  {activity.price.includes('Kostenlos') ? (
                                    <span>Kostenlos</span>
                                  ) : (
                                    activity.price
                                  )}
                                </span>
                              </div>
                            </div>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(dayIndex, idx)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default TravelPlan;
