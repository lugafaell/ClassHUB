class Feedback < ApplicationRecord
  belongs_to :autor, polymorphic: true
  belongs_to :destinatario, polymorphic: true
  belongs_to :tarefa, optional: true
  
  validates :conteudo, presence: true
  validates :tipo, presence: true
  
  enum :tipo, {
    sobre_tarefa: 1,
    sobre_desempenho: 2
  }
  
  validate :validar_relacionamento
  validate :validar_tarefa_professor
  
  private
  
  def validar_relacionamento
    unless (autor_type == 'Aluno' && destinatario_type == 'Professor') ||
           (autor_type == 'Professor' && destinatario_type == 'Aluno')
      errors.add(:base, 'Feedback deve ser entre aluno e professor')
    end
    
    if sobre_tarefa? && tarefa_id.nil?
      errors.add(:tarefa_id, 'é obrigatório para feedback sobre tarefa')
    end
  end

  def validar_tarefa_professor
    return unless sobre_tarefa? && tarefa.present? && autor_type == 'Aluno'
    
    professor = tarefa.professor
    aluno = autor

    unless professor.turmas.include?(aluno.turma)
      errors.add(:tarefa, 'não pertence a um professor que leciona em sua turma')
    end
  end
end