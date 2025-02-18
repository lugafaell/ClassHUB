import React, { useState, useEffect } from 'react';
import './HomePageAdmin.css';
import SidebarAdmin from '../../components/SidebarAdmin/SidebarAdmin';
import EventList from '../../components/EventList/EventList';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import Cookies from 'js-cookie';

interface UserData {
    id: number;
    email: string;
    tipo: string;
    nome: string;
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

interface AdminData {
    nome: string;
    email: string;
    escola: {
      nomeEscola: string;
    };
  }

const HomePage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<'settings' | 'events' | 'dashboard'>(() => {
        const savedComponent = Cookies.get('activeComponent');
        return (savedComponent as 'settings' | 'events' | 'dashboard') || 'dashboard';
    });

    const [events, setEvents] = useState<FormattedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [adminData, setAdminData] = useState<AdminData | null>(null);

    const validateToken = async (token: string) => {
        try {
            const response = await fetch('http://localhost:3000/api/validate_token', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.error) {
                console.error('Token inválido:', data.error);
                return false;
            }

            if (data.message === 'Token válido') {
                return true;
            }

            console.error('Resposta inesperada da API:', data);
            return false;
        } catch (error) {
            console.error('Erro ao validar token:', error);
            return false;
        }
    };

    const handleEventAdded = (newEvent: FormattedEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
    };

    const handleEventUpdated = (updatedEvent: FormattedEvent) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
    };

    const handleEventDeleted = (eventId: number) => {
        setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== eventId)
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authDataString = localStorage.getItem('auth');

                if (!authDataString) {
                    throw new Error('Usuário não autenticado');
                }

                const authData = JSON.parse(authDataString);
                const token = authData.token;
                const userData: UserData = authData.user;

                if (!token || !userData) {
                    throw new Error('Dados de autenticação inválidos');
                }

                const isTokenValid = await validateToken(token);
                if (!isTokenValid) {
                    localStorage.removeItem('auth');
                    throw new Error('Token inválido');
                }

                const eventsResponse = await fetch('http://localhost:3000/api/events', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!eventsResponse.ok) throw new Error('Erro ao buscar eventos');
                const eventsData: ApiEvent[] = await eventsResponse.json();

                const formattedEvents = eventsData.map(event => {
                    const formattedEvent = {
                        id: event.id,
                        title: event.title,
                        description: event.simple_description,
                        full_description: event.description,
                        date: event.date,
                        location: event.location,
                        startTime: new Date(event.start_time).toISOString().slice(11, 16),
                        endTime: new Date(event.end_time).toISOString().slice(11, 16)
                    };

                    return formattedEvent;
                });

                setEvents(formattedEvents);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                window.location.href = '/';
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchAdminData = async () => {
          const authDataString = localStorage.getItem('auth');
          if (!authDataString) return;
    
          const authData = JSON.parse(authDataString);
          const token = authData.token;
          const userId = authData.user.id;
    
          const response = await fetch(`http://localhost:3000/api/admins/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            setAdminData(data);
          }
        };
    
        fetchAdminData();
      }, []);
    
      if (!adminData) {
        return <div>Carregando...</div>;
      }

    const handleNavigate = (component: 'settings' | 'events' | 'dashboard') => {
        setActiveComponent(component);
        Cookies.set('activeComponent', component, { expires: 7 });
    };

    const renderComponent = () => {
        if (loading) {
            return <div>Carregando...</div>;
        }

        switch (activeComponent) {
            case 'dashboard':
                return (
                    <div className="section-container">
                        <AdminDashboard />
                    </div>
                );
            case 'settings':
                return (
                    <div className="section-container">
                      <ProfileInfo
                        nome={adminData.nome}
                        email={adminData.email}
                        escola={adminData.escola.nomeEscola}
                      />
                    </div>
                  );
            case 'events':
                return (
                    <div className="section-container">
                        <h1 className="section-title">Eventos</h1>
                        <EventList
                            events={events}
                            onEventAdded={handleEventAdded}
                            onEventUpdated={handleEventUpdated}
                            onEventDeleted={handleEventDeleted}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <SidebarAdmin onNavigate={handleNavigate} activeComponent={activeComponent} />
            <div className="content-wrapper">
                {renderComponent()}
            </div>
        </div>
    );
};

export default HomePage;