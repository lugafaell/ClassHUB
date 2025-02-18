module Api
  class AuthController < ApplicationController
    skip_before_action :authenticate_request, only: [:login]

    def login
      user_type = params[:user_type]&.capitalize
      return render json: { error: 'Tipo de usuário inválido' }, status: :bad_request unless ['Aluno', 'Professor', 'Admin'].include?(user_type)
      
      model_class = user_type.constantize
      user = model_class.find_by(email: params[:email])
      
      if user&.authenticate(params[:password])
        token = generate_token(user, user_type)
        
        user_data = {
          id: user.id,
          email: user.email,
          tipo: user_type.downcase
        }
        
        user_data[:nome] = user.nome unless user_type == "Admin"
        
        render json: {
          token: token,
          user: user_data
        }, status: :ok
      else
        render json: { error: 'Email ou senha inválidos' }, status: :unauthorized
      end
    end

    private

    def generate_token(user, user_type)
      payload = {
        user_id: user.id,
        user_type: user_type,
        exp: 24.hours.from_now.to_i
      }
      
      JWT.encode(payload, Rails.application.config.jwt_secret_key)
    end
  end
end