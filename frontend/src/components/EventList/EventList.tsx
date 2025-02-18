import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import EventCard from '../EventCard/EventCard';
import EventModal from '../EventModal/EventModal';
import './EventList.css';

interface Event {
  id: number;
  title: string;
  description: string;
  full_description: string;
  date: string;
  location: string;
  startTime: string;
  endTime: string;
}

interface EventListProps {
  events: Event[];
  onEventAdded?: (newEvent: Event) => void;
  onEventUpdated?: (updatedEvent: Event) => void;
  onEventDeleted?: (eventId: number) => void;
}

interface ApiEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  admin_id: number;
  created_at: string;
  updated_at: string;
  location: string;
  simple_description: string;
  start_time: string;
  end_time: string;
}

interface FormattedEvent {
  id: number;
  title: string;
  description: string;
  full_description: string;
  date: string;
  location: string;
  startTime: string;
  endTime: string;
}

interface AuthData {
  user: {
    tipo: string;
  };
  token: string;
}

interface NewEvent {
  title: string;
  description: string;
  simple_description: string;
  date: string;
  location: string;
  start_time: string;
  end_time: string;
}

const EventList: React.FC<EventListProps> = ({ events, onEventAdded, onEventUpdated, onEventDeleted }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    description: '',
    simple_description: '',
    date: '',
    location: '',
    start_time: '',
    end_time: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAdmin = () => {
    const authData = localStorage.getItem('auth');
    if (!authData) return false;

    try {
      const { user } = JSON.parse(authData) as AuthData;
      return user.tipo === 'admin';
    } catch {
      return false;
    }
  };

  const getAuthToken = (): string => {
    const authData = localStorage.getItem('auth');
    if (!authData) throw new Error('Não autorizado');

    const { token } = JSON.parse(authData) as AuthData;
    return token;
  };

  const handleLearnMore = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ event: newEvent })
      });

      if (!response.ok) {
        throw new Error('Erro ao criar evento');
      }

      const createdEvent: ApiEvent = await response.json();

      const formattedEvent: FormattedEvent = {
        id: createdEvent.id,
        title: createdEvent.title,
        description: createdEvent.simple_description,
        full_description: createdEvent.description,
        date: createdEvent.date,
        location: createdEvent.location,
        startTime: new Date(createdEvent.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(createdEvent.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (onEventAdded) {
        onEventAdded(formattedEvent);
      }

      setIsCreateModalOpen(false);
      setNewEvent({
        title: '',
        description: '',
        simple_description: '',
        date: '',
        location: '',
        start_time: '',
        end_time: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = async (eventId: number) => {
    const eventToEdit = events.find(e => e.id === eventId);
    if (eventToEdit) {
      setNewEvent({
        title: eventToEdit.title,
        description: eventToEdit.full_description,
        simple_description: eventToEdit.description,
        date: eventToEdit.date,
        location: eventToEdit.location,
        start_time: eventToEdit.startTime,
        end_time: eventToEdit.endTime
      });
      setIsEditing(true);
      setIsCreateModalOpen(true);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3000/api/events/${selectedEvent?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ event: newEvent })
      });
  
      if (!response.ok) {
        throw new Error('Erro ao atualizar evento');
      }
  
      const updatedEvent: ApiEvent = await response.json();
  
      const formattedEvent: FormattedEvent = {
        id: updatedEvent.id,
        title: updatedEvent.title,
        description: updatedEvent.simple_description,
        full_description: updatedEvent.description,
        date: updatedEvent.date,
        location: updatedEvent.location,
        startTime: new Date(updatedEvent.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date(updatedEvent.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
  
      setSelectedEvent(formattedEvent);
  
      if (onEventUpdated) {
        onEventUpdated(formattedEvent);
      }
  
      setIsCreateModalOpen(false);
      setIsEditing(false);
      setNewEvent({
        title: '',
        description: '',
        simple_description: '',
        date: '',
        location: '',
        start_time: '',
        end_time: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar evento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir evento');
      }

      if (onEventDeleted) {
        onEventDeleted(eventId);
      }

      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir evento');
    }
  };

  return (
    <div className="event-list">
      {isAdmin() && (
        <button
          className="add-event-button"
          onClick={() => {
            setIsEditing(false);
            setIsCreateModalOpen(true);
          }}
        >
          <Plus size={20} />
          Adicionar Evento
        </button>
      )}

      <div className="event-cards-container">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            startTime={event.startTime}
            endTime={event.endTime}
            location={event.location}
            description={event.description}
            full_description={event.description}
            onLearnMore={() => handleLearnMore(event.id)}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          isAdmin={isAdmin()}
        />
      )}

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="create-event-modal">
            <h2>{isEditing ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={isEditing ? handleUpdateEvent : handleCreateEvent}>
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição Completa</label>
                <textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="simple_description">Descrição Simples</label>
                <input
                  id="simple_description"
                  type="text"
                  value={newEvent.simple_description}
                  onChange={(e) => setNewEvent({ ...newEvent, simple_description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Data</label>
                <input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Local</label>
                <input
                  id="location"
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="start_time">Hora de Início</label>
                  <input
                    id="start_time"
                    type="time"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end_time">Hora de Término</label>
                  <input
                    id="end_time"
                    type="time"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="cancel-button"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (isEditing ? 'Atualizando...' : 'Criando...') : (isEditing ? 'Atualizar Evento' : 'Criar Evento')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;