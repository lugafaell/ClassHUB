import React from 'react';
import { CheckCircle } from 'lucide-react';
import './ExerciseCard.css';

interface CompletedExerciseCardProps {
  title: string;
  description: string;
  dueDate: string;
}

const CompletedExerciseCard: React.FC<CompletedExerciseCardProps> = ({ title, description, dueDate }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    
    return localDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="exercise-card">
      <div className="card-header">
        <CheckCircle size={20} color="green" />
        <h3 className="card-title">{title}</h3>
      </div>

      <p className="card-description">{description}</p>

      <div className="due-date">
        <span>Concluída em: {formatDate(dueDate)}</span>
      </div>
    </div>
  );
};

export default CompletedExerciseCard;