module Api
  class NotificationsController < ApplicationController
    before_action :authenticate_request
    before_action :ensure_user_type
    
    def current_user_notifications
      @current_user.notifications
    end

    def index
      create_upcoming_event_notifications
    
      @notifications = current_user_notifications
        .recent
        .includes(:notifiable)
        .order(created_at: :desc)
    
      render json: @notifications.to_json(
        include: {
          notifiable: {
            only: [:id, :title, :date, :location],
            methods: []
          }
        }
      )
    end

    def mark_as_read
      @notification = current_user_notifications.find(params[:id])
      @notification.update!(read: true)
      head :ok
    end

    def mark_all_as_read
      current_user_notifications.unread.update_all(read: true)
      head :ok
    end

    def destroy
      @notification = current_user_notifications.find(params[:id])
      @notification.destroy
      head :no_content
    end

    private

    def create_upcoming_event_notifications
      tomorrow = Date.tomorrow
      upcoming_events = ::Event.where(date: tomorrow)
      
      upcoming_events.each do |event|
        escola = event.admin.escola
        
        escola.alunos.each do |aluno|
          create_event_notification_for_user(event, aluno)
        end

        escola.professors.each do |professor|
          create_event_notification_for_user(event, professor)
        end
      end
    end

    def create_event_notification_for_user(event, user)
      tracker = EventNotificationTracker.find_or_create_by(
        event: event,
        trackable: user
      ) do |tracker|
        Notification.create(
          notifiable: event,
          recipient: user,
          read: false,
          message: "O evento '#{event.title}' acontecerá amanhã!"
        )
      end
    end

    def authenticate_request
      token = request.headers['Authorization'].split(' ').last
      decoded_token = JWT.decode(token, Rails.application.config.jwt_secret_key, true, algorithm: 'HS256').first
      user_type = decoded_token['user_type']
      user_id = decoded_token['user_id']

      @current_user = user_type.constantize.find(user_id)
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: 'Não autorizado' }, status: :unauthorized
    end

    def ensure_user_type
      unless @current_user.is_a?(Aluno) || @current_user.is_a?(Professor)
        render json: { error: 'Acesso negado' }, status: :forbidden
      end
    end
  end
end