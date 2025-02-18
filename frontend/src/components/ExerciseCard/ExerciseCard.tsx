import React, { useState, useEffect } from 'react';
import { Book, Clock } from 'lucide-react';
import ExerciseModal from '../ExerciseModal/ExerciseModal';
import ExerciseProfModal from '../ExerciseProfModal/ExerciseProfModal';
import './ExerciseCard.css';

interface ExerciseCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  professor: string;
  turma: string;
  onComplete: (id: string) => void;
  onDelete?: (id: string) => void;
}

interface Aluno {
  id: number;
  nome: string;
  concluida: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  title: initialTitle,
  description: initialDescription,
  dueDate: initialDueDate,
  professor,
  turma,
  onComplete,
  onDelete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [dueDate, setDueDate] = useState(initialDueDate);

  const getAuthType = () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const authData = JSON.parse(auth);
      return authData.user.tipo;
    }
    return null;
  };

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const due = new Date(dueDate);
      const created = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const totalDuration = due.getTime() - created.getTime();
      const timeElapsed = now.getTime() - created.getTime();
      
      const calculatedProgress = (timeElapsed / totalDuration) * 100;
      return Math.min(Math.max(calculatedProgress, 0), 100);
    };

    setProgress(calculateProgress());

    const timer = setInterval(() => {
      setProgress(calculateProgress());
    }, 3600000);

    return () => clearInterval(timer);
  }, [dueDate]);

  const formatDate = (date: string) => {
    const localDate = new Date(date + 'T12:00:00Z');
    return localDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleComplete = () => {
    onComplete(id);
    setIsModalOpen(false);
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) {
        throw new Error('Dados de autenticação não encontrados');
      }

      const authData = JSON.parse(auth);
      const token = authData.token;

      const response = await fetch(`http://localhost:3000/api/tarefas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar dados da tarefa');
      }

      const data = await response.json();
      setStudents(data.alunos || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && getAuthType() === 'professor') {
      fetchStudents();
    }
  }, [isModalOpen]);

  const handleUpdate = (newTitle: string, newDescription: string, newDueDate: string) => {
    setTitle(newTitle);
    setDescription(newDescription);
    setDueDate(newDueDate);
  };

  return (
    <>
      <div className="exercise-card" onClick={() => setIsModalOpen(true)}>
        <div className="card-header">
          <Book size={20} />
          <h3 className="card-title">{title}</h3>
          <Clock size={16} className="clock-icon" />
        </div>

        <p className="card-description">{description}</p>

        <div className="due-date">
          <span>Data Limite: {formatDate(dueDate)}</span>
        </div>

        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isModalOpen && (
        getAuthType() === 'professor' ? (
          <ExerciseProfModal
            id={id}
            title={title}
            description={description}
            dueDate={dueDate}
            turma={turma}
            students={students}
            isLoading={isLoading}
            onClose={() => setIsModalOpen(false)}
            onDelete={() => {
              setIsModalOpen(false);
              if (onDelete) onDelete(id);
            }}
            onUpdate={handleUpdate}
          />
        ) : (
          <ExerciseModal
            title={title}
            description={description}
            dueDate={dueDate}
            professor={professor}
            turma={turma}
            onClose={() => setIsModalOpen(false)}
            onComplete={handleComplete}
          />
        )
      )}
    </>
  );
};

export default ExerciseCard;