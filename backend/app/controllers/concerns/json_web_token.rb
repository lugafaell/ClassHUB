module JsonWebToken
    extend ActiveSupport::Concern
  
    def authenticate_request
        header = request.headers['Authorization']
        Rails.logger.debug "Authorization Header: #{header}"
        
        header = header.split(' ').last if header
        Rails.logger.debug "Token: #{header}"
        
        begin
          decoded = JWT.decode(header, Rails.application.config.jwt_secret_key).first
          Rails.logger.debug "Decoded Token: #{decoded}"
          
          user_type = decoded['user_type']
          model_class = user_type.constantize
          @current_user = model_class.find(decoded['user_id'])
        rescue JWT::DecodeError => e
          Rails.logger.debug "JWT Decode Error: #{e.message}"
          render json: { error: 'Token inválido' }, status: :unauthorized
        rescue ActiveRecord::RecordNotFound => e
          Rails.logger.debug "Record Not Found: #{e.message}"
          render json: { error: 'Usuário não encontrado' }, status: :unauthorized
        rescue NameError => e
          Rails.logger.debug "Name Error: #{e.message}"
          render json: { error: 'Tipo de usuário inválido' }, status: :unauthorized
        end
      end
  
    def current_user
      @current_user
    end
end