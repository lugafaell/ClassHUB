module ApplicationCable
    class Connection < ActionCable::Connection::Base
      identified_by :current_user
  
      def connect
        self.current_user = find_verified_user
      end
  
      private
  
      def find_verified_user
        token = request.params[:token] || request.headers['Authorization']&.split(' ')&.last
        if token
          decoded_token = JsonWebToken.decode(token)
          user_type = decoded_token['user_type']
          user_id = decoded_token['user_id']
          
          case user_type
          when 'Aluno'
            Aluno.find(user_id)
          when 'Professor'
            Professor.find(user_id)
          else
            reject_unauthorized_connection
          end
        else
          reject_unauthorized_connection
        end
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        reject_unauthorized_connection
      end
    end
  end
  
  class NotificationsChannel < ApplicationCable::Channel
    def subscribed
      if current_user.is_a?(Aluno)
        stream_for current_user
      else
        reject
      end
    end
  
    def unsubscribed
      stop_all_streams
    end
  end