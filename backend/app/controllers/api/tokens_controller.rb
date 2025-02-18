module Api
    class TokensController < ApplicationController
      include JsonWebToken
  
      def validate
        authenticate_request
        if current_user
          render json: { message: 'Token válido', user: current_user }, status: :ok
        else
          render json: { error: 'Token inválido' }, status: :unauthorized
        end
      end
    end
  end