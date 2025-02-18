class TarefaAluno < ApplicationRecord
    belongs_to :tarefa
    belongs_to :aluno, optional: true
    
    validates :tarefa_id, uniqueness: { scope: :aluno_id }
  end