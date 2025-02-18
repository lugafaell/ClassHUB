import React, { useState } from 'react';
import { Check, X, User, Calendar, Edit2, Trash2 } from 'lucide-react';
import './ExerciseProfModal.css';

interface ExerciseProfModalProps {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    turma: string;
    students: { id: number; nome: string; concluida: boolean }[];
    isLoading: boolean;
    onClose: () => void;
    onDelete?: () => void;
    onUpdate: (title: string, description: string, dueDate: string) => void;
  }

const ExerciseProfModal: React.FC<ExerciseProfModalProps> = ({
  id,
  title,
  description,
  dueDate,
  turma,
  students,
  isLoading,
  onClose,
  onDelete,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedDueDate, setEditedDueDate] = useState(dueDate);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: string) => {
    const localDate = new Date(date + 'T12:00:00Z');
    return localDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleUpdate = async () => {
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) throw new Error('Dados de autenticação não encontrados');
  
      const authData = JSON.parse(auth);
      const token = authData.token;
  
      const response = await fetch(`http://localhost:3000/api/tarefas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tarefa: {
            titulo: editedTitle,
            descricao: editedDescription,
            data_entrega: editedDueDate,
            turma: turma
          }
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar tarefa');
      }
  
      // Atualiza o card após sucesso da requisição
      onUpdate(editedTitle, editedDescription, editedDueDate);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao atualizar tarefa');
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const auth = localStorage.getItem('auth');
      if (!auth) throw new Error('Dados de autenticação não encontrados');

      const authData = JSON.parse(auth);
      const token = authData.token;

      const response = await fetch(`http://localhost:3000/api/tarefas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar tarefa');
      }

      if (onDelete) onDelete();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao deletar tarefa');
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  return (
    <div className="modal-overlay-prof" onClick={onClose}>
      <div className="modal-content-prof" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-prof">
          <h2 className="modal-title-prof">Detalhes do Exercício</h2>
          <div className="modal-actions-prof">
            <button 
              className="edit-button-prof"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 size={16} />
            </button>
            <button 
              className="delete-button-prof"
              onClick={() => setIsDeleting(true)}
            >
              <Trash2 size={16} />
            </button>
            <button className="close-button-prof" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-message-prof">
            {error}
          </div>
        )}

        <div className="modal-body-prof">
          <div className="exercise-info-prof">
            {isEditing ? (
              <div className="edit-form-prof">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="edit-input-prof"
                  placeholder="Título"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="edit-textarea-prof"
                  placeholder="Descrição"
                />
                <input
                  type="date"
                  value={editedDueDate.split('T')[0]}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  className="edit-input-prof"
                />
                <div className="edit-actions-prof">
                  <button onClick={handleUpdate} className="save-button-prof">
                    Salvar
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                    }} 
                    className="cancel-button-prof"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="exercise-title-prof">{title}</h3>
                <p className="exercise-description-prof">{description}</p>
                <div className="exercise-meta-prof">
                  <div className="meta-item-prof">
                    <Calendar size={16} className="meta-icon-prof" />
                    <span>Entrega: {formatDate(dueDate)}</span>
                  </div>
                  <div className="meta-item-prof">
                    <User size={16} className="meta-icon-prof" />
                    <span>Turma: {turma}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="students-progress-prof">
            <h4 className="progress-title-prof">Progresso dos Alunos</h4>
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <div className="students-list-prof">
                {students.map((student) => (
                  <div key={student.id} className="student-item-prof">
                    <span className="student-name-prof">{student.nome}</span>
                    {student.concluida ? (
                      <div className="status-completed-prof">
                        <Check size={16} className="meta-icon-prof" />
                        <span className="status-text-prof">Concluído</span>
                      </div>
                    ) : (
                      <div className="status-pending-prof">
                        <X size={16} className="meta-icon-prof" />
                        <span className="status-text-prof">Pendente</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isDeleting && (
          <div className="delete-confirmation-prof">
            <div className="delete-confirmation-content-prof">
              <h3>Confirmar exclusão</h3>
              <p>Tem certeza que deseja excluir esta tarefa?</p>
              <div className="delete-actions-prof">
                <button onClick={handleDelete} className="confirm-delete-prof">
                  Confirmar
                </button>
                <button 
                  onClick={() => {
                    setIsDeleting(false);
                    setError(null);
                  }} 
                  className="cancel-delete-prof"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseProfModal;