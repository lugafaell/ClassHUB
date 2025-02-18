class Escola < ApplicationRecord
  has_many :alunos, dependent: :delete_all
  has_many :professors, dependent: :delete_all
  has_many :tarefas, dependent: :delete_all
  
  before_validation :gerar_codigos, on: :create
  
  validates :nomeEscola, presence: true, uniqueness: { case_sensitive: false }
  validates :codeAluno, presence: true, uniqueness: true
  validates :codeProfessor, presence: true, uniqueness: true
  validates :codeAdmin, presence: true, uniqueness: true
  
  private
  
  def gerar_codigos
    loop do
      self.codeAluno = "A#{SecureRandom.alphanumeric(7).upcase}"
      self.codeProfessor = "P#{SecureRandom.alphanumeric(7).upcase}"
      self.codeAdmin = "ADM#{SecureRandom.alphanumeric(7).upcase}"
      
      break unless Escola.exists?(codeAluno: codeAluno) || 
                   Escola.exists?(codeProfessor: codeProfessor) ||
                   Escola.exists?(codeAdmin: codeAdmin) ||
                   codeAluno == codeProfessor ||
                   codeAluno == codeAdmin ||
                   codeProfessor == codeAdmin
    end
  end
end