import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ExerciseCreateModal from '../ExerciseCreateModal/ExerciseCreateModal';
import ExerciseCard from '../ExerciseCard/ExerciseCard';
import './ExerciseCreate.css';

interface BaseExercise {
  title: string;
  description: string;
  dueDate: string;
  turma: string;
}

interface Exercise extends BaseExercise {
  id: string;
  professor: string;
}

interface ProfessorAPI {
  id: number;
  nome: string;
}

interface TarefaAPI {
  id: string;
  titulo: string;
  descricao: string;
  data_entrega: string;
  turma: string;
  professor: ProfessorAPI;
}

interface ExerciseCreateProps {
  onAddExercise: (exercise: Exercise) => void;
}

const ExerciseCreate: React.FC<ExerciseCreateProps> = ({ onAddExercise }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapTarefaToExercise = (tarefa: TarefaAPI): Exercise => {
    return {
      id: tarefa.id,
      title: tarefa.titulo,
      description: tarefa.descricao,
      dueDate: tarefa.data_entrega,
      turma: tarefa.turma,
      professor: tarefa.professor?.nome || 'Professor',
    };
  };

  const fetchExercises = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const { token, user } = authData;

      if (!token || !user?.id) {
        throw new Error('Dados de autenticação não encontrados');
      }

      const response = await fetch(`http://localhost:3000/api/professores/${user.id}/tarefas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar tarefas');
      }

      const data: TarefaAPI[] = await response.json();
      const formattedExercises = data.map(mapTarefaToExercise);
      setExercises(formattedExercises);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
  };

  const handleCreateExercise = async (baseExercise: BaseExercise) => {
    setIsLoading(true);
    setError(null);

    try {
      const authData = JSON.parse(localStorage.getItem('auth') || '{}');
      const { token, user } = authData;

      if (!token || !user?.id) {
        throw new Error('Dados de autenticação não encontrados');
      }

      const requestBody = {
        tarefa: {
          titulo: baseExercise.title,
          descricao: baseExercise.description,
          data_entrega: baseExercise.dueDate,
          turma: baseExercise.turma,
        },
      };

      const response = await fetch(`http://localhost:3000/api/professores/${user.id}/tarefas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data: TarefaAPI = await response.json();

      if (!response.ok) {
        let errorMessage = 'Erro ao criar tarefa';

        if ('full_messages' in data) {
          errorMessage = (data.full_messages as string[]).join('; ');
        } else if ('errors' in data) {
          errorMessage = Object.entries(data.errors as Record<string, string>)
            .map(([field]) => `${field}: `)
            .join('; ');
        } else if ('error' in data) {
          errorMessage = data.error as string;
        }

        throw new Error(errorMessage);
      }

      const newExercise = mapTarefaToExercise(data);

      setExercises((prevExercises) => [...prevExercises, newExercise]);
      onAddExercise(newExercise);
      handleCloseModal();

      await fetchExercises();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar tarefa';
      setError(errorMessage);
      console.error('Erro ao criar tarefa:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteExercise = (id: string) => {
    console.log(`Exercise ${id} marked as complete`);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== id));
  };

  return (
    <div className="exercise-create-container">
      <div className="exercise-list-header">
        <button
          className="add-exercise-button"
          onClick={handleOpenModal}
          disabled={isLoading}
        >
          <Plus size={20} />
          <span>{isLoading ? 'Criando...' : 'Nova Tarefa'}</span>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="exercise-list">
        {exercises.map((exercise) => (
          <ExerciseCard
          key={exercise.id}
          id={exercise.id}
          title={exercise.title}
          description={exercise.description}
          dueDate={exercise.dueDate}
          professor={exercise.professor}
          turma={exercise.turma}
          onComplete={handleCompleteExercise}
          onDelete={handleDeleteExercise}
        />
        ))}
      </div>

      {isModalOpen && (
        <ExerciseCreateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateExercise}
          error={error}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ExerciseCreate;