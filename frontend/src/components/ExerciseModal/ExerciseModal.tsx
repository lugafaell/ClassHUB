import React from 'react';
import { Check, X, User, Calendar, School } from 'lucide-react';
import './ExerciseModal.css';

interface ExerciseModalProps {
  title: string;
  description: string;
  dueDate: string;
  professor: string;
  turma: string;
  onClose: () => void;
  onComplete: () => void;
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({
  title,
  description,
  dueDate,
  professor,
  turma,
  onClose,
  onComplete,
}) => {
  const formatDate = (date: string) => {
    const localDate = new Date(date + 'T12:00:00Z');
    return localDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="modal-overlay-aluno" onClick={onClose}>
      <div className="modal-content-aluno" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-aluno">
          <h2>{title}</h2>
          <button className="close-button-aluno" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-aluno">
          <p className="modal-description-aluno">{description}</p>

          <div className="modal-details-aluno">
            <div className="detail-item-aluno">
              <User size={16} className="detail-icon-aluno" />
              <span className="detail-label-aluno">Professor:</span>
              <span className="detail-value-aluno">{professor}</span>
            </div>
            <div className="detail-item-aluno">
              <Calendar size={16} className="detail-icon-aluno" />
              <span className="detail-label-aluno">Data de Entrega:</span>
              <span className="detail-value-aluno">{formatDate(dueDate)}</span>
            </div>
            <div className="detail-item-aluno">
              <School size={16} className="detail-icon-aluno" />
              <span className="detail-label-aluno">Turma:</span>
              <span className="detail-value-aluno">{turma}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer-aluno">
          <button className="complete-button-aluno" onClick={onComplete}>
            <Check size={16} /> Marcar como concluída
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;