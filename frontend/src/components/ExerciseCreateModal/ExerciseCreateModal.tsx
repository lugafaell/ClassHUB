import React, { useState, useEffect } from 'react';
import './ExerciseCreateModal.css';

// Interface compatível com o formato do ExerciseCreate
interface BaseExercise {
    title: string;
    description: string;
    dueDate: string;
    turma: string;
}

interface ExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (exercise: BaseExercise) => void;
    error?: string | null;
    isLoading?: boolean;
}

interface Exercise extends BaseExercise {
    id: string;
    status: 'active' | 'closed';
}

interface AuthData {
    token: string;
    user: {
        id: string;
    };
}

const ExerciseCreateModal: React.FC<ExerciseModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [ExerciseData, setExerciseData] = useState<Exercise>({
        id: '',
        title: '',
        description: '',
        dueDate: '',
        turma: '',
        status: 'active'
    });
    
    const [professorTurmas, setProfessorTurmas] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfessorData = async () => {
            try {
                const authDataString = localStorage.getItem('auth');
                if (!authDataString) {
                    throw new Error('Dados de autenticação não encontrados');
                }

                const authData: AuthData = JSON.parse(authDataString);
                const professorId = authData.user.id;
                const token = authData.token;

                const response = await fetch(`http://localhost:3000/api/professores/${professorId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch professor data');
                }

                const data = await response.json();
                const turmasString = data.turmas;
                let turmasArray: string[] = [];
                
                try {
                    const firstParse = JSON.parse(turmasString);
                    const secondParse = JSON.parse(firstParse[0]);
                    turmasArray = secondParse;
                } catch (parseError) {
                    console.error('Erro ao processar turmas:', parseError);
                    turmasArray = [];
                }

                setProfessorTurmas(turmasArray);
                setIsLoading(false);
            } catch (err) {
                setError('Error loading professor data');
                setIsLoading(false);
                console.error('Erro ao carregar dados:', err);
            }
        };

        fetchProfessorData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setExerciseData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Extrair apenas os campos necessários para BaseExercise
        const { title, description, dueDate, turma } = ExerciseData;
        const exerciseData: BaseExercise = {
            title,
            description,
            dueDate,
            turma
        };
        onSubmit(exerciseData);
        onClose();
    };

    if (!isOpen) return null;
    
    if (isLoading) {
        return (
            <div className="modal-overlay-create">
                <div className="modal-content-create">
                    <p>Carregando turmas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modal-overlay-create">
                <div className="modal-content-create">
                    <p>Erro ao carregar turmas: {error}</p>
                    <button onClick={onClose}>Fechar</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay-create">
            <div className="modal-content-create">
                <h2>Criar Nova Tarefa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-create">
                        <label htmlFor="title">Título:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={ExerciseData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-create">
                        <label htmlFor="description">Descrição:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={ExerciseData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-create">
                        <label htmlFor="dueDate">Data de Entrega:</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={ExerciseData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-create">
                        <label htmlFor="turma">Turma:</label>
                        <select
                            id="turma"
                            name="turma"
                            value={ExerciseData.turma}
                            onChange={handleChange}
                            required
                            className="form-select-create"
                        >
                            <option value="">Selecione uma turma</option>
                            {professorTurmas.map(turma => (
                                <option key={turma} value={turma}>
                                    {turma}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="button-group-create">
                        <button type="submit">Criar Tarefa</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExerciseCreateModal;