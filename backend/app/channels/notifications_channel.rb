class NotificationsChannel < ApplicationCable::Channel
    def subscribed
      stream_from "notifications_channel"
      
      if current_aluno
        stream_for current_aluno
      end
    end
    
    def unsubscribed
      stop_all_streams
    end
  end