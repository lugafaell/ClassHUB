class Admin < ApplicationRecord
    belongs_to :escola
    has_many :events, dependent: :destroy
    has_many :alunos, through: :escola
    has_many :professores, through: :escola
    
    validates :email, presence: true, uniqueness: true
    validates :password, presence: true, on: :create
  
    attr_accessor :password
  
    before_save :hash_password, if: :password_changed?
  
    def authenticate(password_attempt)
      Argon2::Password.verify_password(password_attempt, self.password_digest)
    end
  
    private
  
    def hash_password
      if password.present?
        self.password_digest = Argon2::Password.create(password)
      end
    end
  
    def password_changed?
      password.present?
    end
  end
  