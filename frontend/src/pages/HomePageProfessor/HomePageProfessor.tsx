import React, { useState, useEffect } from 'react';
import './HomePageProfessor.css';
import SidebarProfessor from '../../components/SidebarProfessor/SidebarProfessor';
import ExerciseCreate from '../../components/ExerciseCreate/ExerciseCreate';
import EventList from '../../components/EventList/EventList';
import FeedbackComponent from '../../components/Feedback/Feedback';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import Cookies from 'js-cookie';

interface ProfessorData {
    nome: string;
    email: string;
    materia: string;
    turmas: string[];
    dias_aula: string[];
    escola: {
        nomeEscola: string;
    };
}

interface UserData {
    id: number;
    email: string;
    tipo: string;
    nome: string;
}

interface Exercise {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    turma: string;
    professor?: string;
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

const HomePage: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<'tarefas' | 'settings' | 'events' | 'feedback'>(() => {
        const savedComponent = Cookies.get('activeComponent');
        return (savedComponent as 'tarefas' | 'settings' | 'events' | 'feedback') || 'tarefas';
    });

    const [events, setEvents] = useState<FormattedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [professorData, setProfessorData] = useState<ProfessorData | null>(null);

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

                const formattedEvents = eventsData.map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.simple_description,
                    full_description: event.description,
                    date: event.date,
                    location: event.location,
                    startTime: new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    endTime: new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));

                setEvents(formattedEvents);

                const userId = authData.user.id;
                const professorResponse = await fetch(`http://localhost:3000/api/professores/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!professorResponse.ok) throw new Error('Erro ao buscar dados do professor');
                const professorData = await professorResponse.json();
                setProfessorData(professorData);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                window.location.href = '/';
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddExercise = (newExercise: Exercise) => {
        setExercises([...exercises, newExercise]);
    };

    const handleNavigate = (component: 'tarefas' | 'settings' | 'events' | 'feedback') => {
        setActiveComponent(component);
        Cookies.set('activeComponent', component, { expires: 7 });
    };

    const renderComponent = () => {
        if (loading) {
            return <div>Carregando...</div>;
        }

        switch (activeComponent) {
            case 'tarefas':
                return (
                    <div className="section-container">
                        <h1 className="section-title">Tarefas</h1>
                        <ExerciseCreate onAddExercise={handleAddExercise} />
                    </div>
                );
            case 'settings':
                return (
                    <div className="section-container">
                        <ProfileInfo
                            nome={professorData?.nome || ''}
                            email={professorData?.email || ''}
                            escola={professorData?.escola.nomeEscola || ''}
                            materia={professorData?.materia || ''}
                            turmas={professorData?.turmas || []}
                            dias_aula={professorData?.dias_aula || []}
                        />
                    </div>
                );
            case 'events':
                return (
                    <div className="section-container">
                        <h1 className="section-title">Eventos</h1>
                        <EventList events={events} />
                    </div>
                );
            case 'feedback':
                return (
                    <div className="section-container">
                        <h1 className="section-title">Feedbacks</h1>
                        <FeedbackComponent />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <SidebarProfessor onNavigate={handleNavigate} activeComponent={activeComponent} />
            <div className="content-wrapper">
                {renderComponent()}
            </div>
        </div>
    );
};

export default HomePage;