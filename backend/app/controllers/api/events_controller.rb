module Api
  class EventsController < ApplicationController
    skip_before_action :authenticate_request, only: [:index]
    before_action :authenticate_admin, except: [:index]
    before_action :set_event, only: [:show, :update, :destroy]

    def index
      events = Event.all
      render json: events
    end

    def show
      render json: @event
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Evento não encontrado' }, status: :not_found
    end

    def create
      event = current_admin.events.new(event_params)
      
      if event.save
        render json: event, status: :created
      else
        render json: { errors: event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @event.update(event_params)
        render json: @event
      else
        render json: { errors: @event.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @event.destroy
      head :no_content
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Evento não encontrado' }, status: :not_found
    end

    private

    def set_event
      @event = Event.find(params[:id])
    end

    def event_params
      params.require(:event).permit(
        :title, 
        :description,
        :date,
        :location,
        :simple_description,
        :start_time,
        :end_time
      )
    end

    def authenticate_admin
      header = request.headers['Authorization']
      token = header.split(' ').last if header
      
      begin
        decoded_token = JWT.decode(token, Rails.application.config.jwt_secret_key, true, algorithm: 'HS256')
        admin_id = decoded_token[0]['user_id']
        user_type = decoded_token[0]['user_type']
        
        if user_type == 'Admin'
          @current_admin = Admin.find(admin_id)
        else
          render json: { error: 'Acesso negado' }, status: :unauthorized
        end
      rescue JWT::DecodeError
        render json: { error: 'Token inválido' }, status: :unauthorized
      end
    end

    def current_admin
      @current_admin
    end
  end
end