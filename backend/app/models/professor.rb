require 'argon2'

class Professor < ApplicationRecord
  belongs_to :escola
  has_many :tarefas, dependent: :delete_all
  validates :escola, presence: true, on: :create
  has_many :notifications, as: :recipient, dependent: :destroy

  has_many :feedbacks_enviados, as: :autor, class_name: 'Feedback'
  has_many :feedbacks_recebidos, as: :destinatario, class_name: 'Feedback'

  attr_accessor :password
  
  before_save :hash_password

  validates :password, presence: true, length: { minimum: 6 }, on: :create
  validate :senha_complexa, on: :create
  validate :dias_aula_validos
  
  validates :nome, presence: true
  validates :data_nascimento, presence: true
  validates :cpf, presence: true, uniqueness: true, length: { is: 11 }
  validates :email, presence: true, uniqueness: true
  
  validate :cpf_valido
  validate :data_nascimento_valida

  DIAS_VALIDOS = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"].freeze

  def authenticate(password_attempt)
    Argon2::Password.verify_password(password_attempt, self.password_digest)
  end
  
  private
  
  def hash_password
    self.password_digest = Argon2::Password.create(self.password) if password.present?
  end

  def senha_complexa
    return if password.blank?
    
    unless password =~ /[A-Z]/
      errors.add(:password, "deve conter pelo menos uma letra maiúscula")
    end
    
    unless password =~ /[0-9]/
      errors.add(:password, "deve conter pelo menos um número")
    end
    
    unless password =~ /[!@#$%^&*(),.?":{}|<>]/
      errors.add(:password, "deve conter pelo menos um caractere especial")
    end
  end

  def dias_aula_validos
    return if dias_aula.blank?
    
    dias_aula.each do |dia|
      unless DIAS_VALIDOS.include?(dia)
        errors.add(:dias_aula, "#{dia} não é um dia válido")
      end
    end
  end

  def cpf_valido
    return if cpf.blank?
    
    numero = cpf.gsub(/[^\d]/, '')
    
    if numero.chars.uniq.size == 1
      errors.add(:cpf, "não é válido")
      return
    end
    
    soma = 0
    9.times do |i|
      soma += numero[i].to_i * (10 - i)
    end
    
    resto = soma % 11
    primeiro_digito = resto < 2 ? 0 : 11 - resto
    
    soma = 0
    10.times do |i|
      soma += numero[i].to_i * (11 - i)
    end
    
    resto = soma % 11
    segundo_digito = resto < 2 ? 0 : 11 - resto
    
    unless numero[9].to_i == primeiro_digito && numero[10].to_i == segundo_digito
      errors.add(:cpf, "não é válido")
    end
  end
  
  def data_nascimento_valida
    return if data_nascimento.blank?
    
    if data_nascimento > Date.today
      errors.add(:data_nascimento, "não pode ser uma data futura")
    end
    
    if data_nascimento < 70.years.ago
      errors.add(:data_nascimento, "não é uma data válida")
    end
    
    if data_nascimento > 4.years.ago
      errors.add(:data_nascimento, "a pessoa deve ter pelo menos 4 anos")
    end
  end
end