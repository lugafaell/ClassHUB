import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import ExerciseList from '../../components/ExerciseList/ExerciseList';
import EventList from '../../components/EventList/EventList';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import FeedbackComponent from '../../components/Feedback/Feedback';
import Cookies from 'js-cookie';

interface UserData {
    id: number;
    email: string;
    tipo: string;
    nome: string;
}

interface Escola {
    id: number;
    nomeEscola: string;
}

interface AlunoData {
    id: number;
    nome: string;
    data_nascimento: string;
    cpf: string;
    email: string;
    escola: Escola;
    created_at: string;
    updated_at: string;
    escola_id: number;
    turma: string;
}

interface Tarefa {
    id: number;
    titulo: string;
    descricao: string;
    data_entrega: string;
    turma: string;
    professor_id: number;
    escola_id: number;
    status: string | null;
    professor: {
        id: number;
        nome: string;
    };
}

interface TarefaConcluida {
    id: number;
    tarefa_id: number;
    aluno_id: number;
    concluida: boolean;
    data_conclusao: string;
    data_entrega: string
    tarefa: Tarefa;
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
    const [activeComponent, setActiveComponent] = useState<'pendentes' | 'completos' | 'settings' | 'events' | 'feedback'>(() => {
        const savedComponent = Cookies.get('activeComponent');
        return (savedComponent as 'pendentes' | 'completos' | 'settings' | 'events' | 'feedback') || 'pendentes';
    });

    const [alunoData, setAlunoData] = useState<AlunoData | null>(null);
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [tarefasConcluidas, setTarefasConcluidas] = useState<Tarefa[]>([]);
    const [events, setEvents] = useState<FormattedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

                const alunosResponse = await fetch('http://localhost:3000/api/alunos', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!alunosResponse.ok) throw new Error('Erro ao buscar dados do aluno');
                const alunosData = await alunosResponse.json();
                
                const currentAlunoData = alunosData.find((aluno: AlunoData) => aluno.id === userData.id);
                if (!currentAlunoData) throw new Error('Dados do aluno não encontrados');
                
                setAlunoData(currentAlunoData);

                const tarefasResponse = await fetch('http://localhost:3000/api/tarefas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!tarefasResponse.ok) throw new Error('Erro ao buscar tarefas');
                const todasTarefas = await tarefasResponse.json();

                const tarefasDaTurma = todasTarefas.filter(
                    (tarefa: Tarefa) =>
                        tarefa.turma === currentAlunoData.turma &&
                        tarefa.escola_id === currentAlunoData.escola_id
                );

                setTarefas(tarefasDaTurma);

                const tarefasConcluidasResponse = await fetch('http://localhost:3000/api/minhas_tarefas_concluidas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!tarefasConcluidasResponse.ok) throw new Error('Erro ao buscar tarefas concluídas');
                const tarefasConcluidasData = await tarefasConcluidasResponse.json();
                setTarefasConcluidas(tarefasConcluidasData);

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
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                window.location.href = '/';
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatTarefasForExerciseList = (
        tarefas: (Tarefa | TarefaConcluida)[], 
        onComplete: (id: string) => void,
        isCompleted?: boolean
    ) => {
        return tarefas.map((tarefa) => ({
            id: tarefa.id.toString(),
            title: 'tarefa' in tarefa ? tarefa.tarefa.titulo : tarefa.titulo,
            description: 'tarefa' in tarefa ? tarefa.tarefa.descricao : tarefa.descricao,
            turma: 'tarefa' in tarefa ? tarefa.tarefa.turma : tarefa.turma,
            professor: 'tarefa' in tarefa 
                ? tarefa.tarefa.professor?.nome 
                : tarefa.professor?.nome || 'Professor não disponível',
            dueDate: isCompleted 
                ? ('tarefa' in tarefa ? tarefa.data_conclusao : tarefa.data_entrega)
                : tarefa.data_entrega,
            onComplete,
        }));
    };

    const handleNavigate = (component: 'pendentes' | 'completos' | 'settings' | 'events' | 'feedback') => {
        setActiveComponent(component);
        Cookies.set('activeComponent', component, { expires: 7 });
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            setErrorMessage(null);
            const authDataString = localStorage.getItem('auth');
            if (!authDataString) throw new Error('Usuário não autenticado');

            const authData = JSON.parse(authDataString);
            const token = authData.token;

            const response = await fetch(`http://localhost:3000/api/tarefas/${taskId}/tarefa_alunos`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    if (data.tarefa_id) {
                        throw new Error('Esta tarefa já foi concluída anteriormente.');
                    } else {
                        throw new Error('Erro de validação: ' + Object.values(data).flat().join(', '));
                    }
                }
                throw new Error(data.error || 'Erro ao marcar tarefa como concluída');
            }

            setTarefas((prevTarefas) =>
                prevTarefas.filter((tarefa) => tarefa.id.toString() !== taskId)
            );

            const tarefasConcluidasResponse = await fetch('http://localhost:3000/api/minhas_tarefas_concluidas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!tarefasConcluidasResponse.ok) {
                throw new Error('Erro ao atualizar lista de tarefas concluídas');
            }

            const tarefasConcluidasData = await tarefasConcluidasResponse.json();
            setTarefasConcluidas(tarefasConcluidasData);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setErrorMessage(errorMessage);
            console.error('Erro ao marcar tarefa como concluída:', error);
        }
    };

    const renderComponent = () => {
        if (loading) {
            return <div>Carregando...</div>;
        }

        const ErrorMessage = () => errorMessage ? (
            <div className="error-message" style={{
                color: 'red',
                padding: '10px',
                margin: '10px 0',
                backgroundColor: '#fff',
                borderRadius: '4px',
                border: '1px solid #ffcdd2'
            }}>
                {errorMessage}
                <button 
                    onClick={() => setErrorMessage(null)}
                    style={{
                        marginLeft: '10px',
                        padding: '2px 6px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    ✕
                </button>
            </div>
        ) : null;

        switch (activeComponent) {
            case 'pendentes':
                return (
                    <div className="section-container">
                        <h1 className="section-title">Tarefas Pendentes</h1>
                        <ErrorMessage />
                        <ExerciseList
                            exercises={formatTarefasForExerciseList(tarefas, handleCompleteTask)}
                        />
                    </div>
                );
                case 'completos':
                    return (
                        <div className="section-container">
                            <h1 className="section-title">Tarefas Concluídas</h1>
                            <ExerciseList
                                exercises={formatTarefasForExerciseList(tarefasConcluidas, handleCompleteTask, true)}
                                isCompleted
                            />
                        </div>
                    );
            case 'settings':
                return (
                    <div className="section-container">
                        <ProfileInfo
                            nome={alunoData?.nome || ''}
                            turma={alunoData?.turma || ''}
                            email={alunoData?.email || ''}
                            cpf={alunoData?.cpf || ''}
                            dataNascimento={alunoData?.data_nascimento || ''}
                            escola={alunoData?.escola.nomeEscola || ''}
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
            <Sidebar onNavigate={handleNavigate} activeComponent={activeComponent} />
            <div className="content-wrapper">
                {renderComponent()}
            </div>
        </div>
    );
};

export default HomePage;