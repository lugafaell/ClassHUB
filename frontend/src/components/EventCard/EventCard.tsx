import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

import './EventCard.css';

interface EventCardProps {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  full_description: string;
  onLearnMore: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  startTime,
  endTime,
  location,
  description,
  onLearnMore

  
}) => {

  const formatDate = (date: string) => {
    return new Date(date.replace("Z", "")).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  
  return (
    <div className="event-card">
      <div className="purple-corner"></div>
      <div className="event-card-content">
        <h2 className="event-title">{title}</h2>
        
        <div className="event-info">
          <div className="event-date-time">
            <Calendar className="events-icon" size={20} />
            {formatDate(date)} | {startTime} - {endTime}
          </div>
          
          <div className="event-location">
          <MapPin className="events-icon" size={20} />
            {location}
          </div>
        </div>
        
        <p className="event-description">{description}</p>
        
        <button className="learn-more-button" onClick={onLearnMore}>
          Mais Detalhes
        </button>
      </div>
    </div>
  );
};

export default EventCard;