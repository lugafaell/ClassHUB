import React from 'react';
import ExerciseCard from '../ExerciseCard/ExerciseCard';
import CompletedExerciseCard from '../ExerciseCard/CompleteExerciseCard';
import './ExerciseList.css';

interface Exercise {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  professor: string;
  turma: string;
  onComplete: (id: string) => void;
}

interface ExerciseListProps {
  exercises: Exercise[];
  isCompleted?: boolean;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ exercises, isCompleted }) => {
  return (
    <div className="exercise-list">
      {exercises.map((exercise) => (
        <div key={exercise.id}>
          {isCompleted ? (
            <CompletedExerciseCard
              title={exercise.title}
              description={exercise.description}
              dueDate={exercise.dueDate}
            />
          ) : (
            <ExerciseCard
              id={exercise.id}
              title={exercise.title}
              description={exercise.description}
              dueDate={exercise.dueDate}
              professor={exercise.professor}
              turma={exercise.turma}
              onComplete={exercise.onComplete}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;