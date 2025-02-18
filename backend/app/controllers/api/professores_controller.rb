module Api
  class ProfessoresController < ApplicationController
    skip_before_action :authenticate_request, only: [:create]
    before_action :set_professor, only: [:show, :update, :destroy]
  
    def index
      @professores = Professor.includes(:escola).all
      render json: @professores.as_json(include: { 
        escola: { only: [:id, :nomeEscola] }
      }, except: [:password_digest])
    end
  
    def show
      render json: @professor.as_json(include: { 
        escola: { only: [:id, :nomeEscola] }
      }, except: [:password_digest])
    end
  
    def create
      escola = Escola.find_by(codeProfessor: params[:professor][:codigo_escola])
      unless escola
        return render json: { error: 'Código da escola inválido' }, status: :bad_request
      end

      @professor = Professor.new(professor_params)
      @professor.escola = escola

      if @professor.save
        render json: @professor.as_json(include: {
          escola: { only: [:id, :nomeEscola] }
        }, except: [:password_digest]), status: :created
      else
        render json: @professor.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @professor.update(professor_params)
        render json: @professor.as_json(include: {
          escola: { only: [:id, :nomeEscola] }
        }, except: [:password_digest])
      else
        render json: @professor.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @professor.destroy
      head :no_content
    end
  
    private
  
    def set_professor
      @professor = Professor.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Professor não encontrado" }, status: :not_found
    end
    
    def professor_params
      params[:professor][:turmas] = Array(params[:professor][:turmas]) if params[:professor][:turmas]
      
      params.require(:professor).permit(
        :nome, 
        :data_nascimento, 
        :cpf, 
        :email, 
        :password,
        :materia,
        turmas: [],
        dias_aula: []
      )
    end
  end
end