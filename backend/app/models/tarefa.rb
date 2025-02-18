class Tarefa < ApplicationRecord
  belongs_to :professor, optional: true
  belongs_to :escola

  has_many :tarefa_alunos, dependent: :destroy
  has_many :alunos, through: :tarefa_alunos

  has_many :notifications, as: :notifiable, dependent: :destroy
  
  after_create :notify_alunos

  validates :titulo, presence: true
  validates :descricao, presence: true
  validates :data_entrega, presence: true
  validates :turma, presence: true
  validates :materia, presence: true
  validate :data_entrega_futura
  validate :turma_valida
  validate :professor_pertence_escola
  validate :professor_pode_criar_tarefa

  private

  def data_entrega_futura
    if data_entrega.present? && data_entrega < Date.today
      errors.add(:data_entrega, "não pode ser uma data passada")
    end
  end

  def professor_pode_criar_tarefa
    return unless professor.present?

    unless professor.materia == materia
      errors.add(:base, "Professor não pode criar tarefa para esta matéria")
    end

    unless professor.turmas.include?(turma)
      errors.add(:base, "Professor não leciona nesta turma")
    end
  end

  def turma_valida
    turmas_validas = [
      "1º Ano - Manhã", "1º Ano - Tarde",
      "2º Ano - Manhã", "2º Ano - Tarde",
      "3º Ano - Manhã", "3º Ano - Tarde",
      "4º Ano - Manhã", "4º Ano - Tarde",
      "5º Ano - Manhã", "5º Ano - Tarde",
      "6º Ano - Manhã", "6º Ano - Tarde",
      "7º Ano - Manhã", "7º Ano - Tarde",
      "8º Ano - Manhã", "8º Ano - Tarde",
      "9º Ano - Manhã", "9º Ano - Tarde"
    ]
    
    unless turmas_validas.include?(turma)
      errors.add(:turma, "inválida")
    end
  end

  def professor_pertence_escola
    unless professor.escola_id == escola_id
      errors.add(:base, "Professor não pertence a esta escola")
    end
  end

  def notify_alunos
    alunos_da_turma = Aluno.where(turma: self.turma, escola_id: self.escola_id)
    
    alunos_da_turma.each do |aluno|
      Notification.create!(
        recipient: aluno,
        notifiable: self,
        message: "Nova tarefa para #{self.turma}: #{self.titulo}",
        read: false
      )
      
      NotificationsChannel.broadcast_to(
        aluno,
        {
          type: 'tarefa',
          message: "Nova tarefa: #{self.titulo}",
          id: self.id,
          data_entrega: self.data_entrega.strftime("%d/%m/%Y")
        }
      )
    end
  end
end