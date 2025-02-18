import React from 'react';
import './EventModal.css';
import { Calendar, MapPin, Clock, X, Edit, Trash } from 'lucide-react';

interface EventModalProps {
    event: {
        id: number;
        title: string;
        date: string;
        startTime: string;
        endTime: string;
        location: string;
        description: string;
        full_description: string;
    };
    isOpen: boolean;
    onClose: () => void;
    onEdit: (eventId: number) => void;
    onDelete: (eventId: number) => void;
    isAdmin: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, isOpen, onClose, onEdit, onDelete, isAdmin }) => {
    if (!isOpen) return null;

    const formatTime = (startTime: string, endTime: string) => {
        return `${startTime} - ${endTime}`;
    };

    const formatDate = (date: string) => {
        return new Date(date.replace("Z", "")).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header-event">
                    <h2>{event.title}</h2>
                </div>

                <div className="modal-body">
                    <div className="event-info">
                        <div className="event-detail">
                            <Calendar className="events-icon" size={20} />
                            <span>{formatDate(event.date)}</span>
                        </div>

                        <div className="event-detail">
                            <Clock className="events-icon" size={20} />
                            <span>{formatTime(event.startTime, event.endTime)}</span>
                        </div>

                        <div className="event-detail">
                            <MapPin className="events-icon" size={20} />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <div className="event-description">
                        <h3>Detalhes do Evento</h3>
                        <p>{event.full_description}</p>
                    </div>

                    {isAdmin && (
                        <div className="modal-actions">
                            <button className="edit-button" onClick={() => onEdit(event.id)}>
                                <Edit size={20} /> Editar
                            </button>
                            <button className="delete-button" onClick={() => onDelete(event.id)}>
                                <Trash size={20} /> Excluir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventModal;