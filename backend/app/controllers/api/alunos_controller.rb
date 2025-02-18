module Api
  class AlunosController < ApplicationController
    skip_before_action :authenticate_request, only: [:create]
    before_action :set_aluno, only: [:show, :update, :destroy, :cronograma]
  
    def index
      @alunos = Aluno.includes(:escola).all
      render json: @alunos.as_json(include: { 
        escola: { 
          only: [:id, :nomeEscola] 
        }
      }, except: [:password_digest])
    end
  
    def show
      render json: @aluno.as_json(include: { 
        escola: { 
          only: [:id, :nomeEscola] 
        }
      }, except: [:password_digest])
    end
  
    def create
      escola = Escola.find_by(codeAluno: params[:aluno][:codigo_escola])
      unless escola
        return render json: { error: 'Código da escola inválido' }, status: :bad_request
      end
    
      @aluno = Aluno.new(aluno_params)
      @aluno.escola = escola
    
      if @aluno.save
        render json: @aluno.as_json(include: {
          escola: {
            only: [:id, :nomeEscola]
          }
        }, except: [:password_digest]), status: :created
      else
        render json: @aluno.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @aluno.update(aluno_params)
        render json: @aluno.as_json(include: {
          escola: {
            only: [:id, :nomeEscola]
          }
        }, except: [:password_digest])
      else
        render json: @aluno.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @aluno.destroy
      head :no_content
    end

    def materias
      if @current_user.is_a?(Aluno)
        materias = @current_user.materias_disponiveis
        render json: { materias: materias }
      else
        render json: { error: "Acesso não autorizado" }, status: :unauthorized
      end
    end

    def cronograma
      if @aluno.id == @current_user.id
        cronograma = @aluno.cronograma
        render json: { cronograma: cronograma }
      else
        render json: { error: "Acesso não autorizado" }, status: :unauthorized
      end
    end
  
    private
  
    def set_aluno
      @aluno = Aluno.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Aluno não encontrado" }, status: :not_found
    end
    
    def aluno_params
      params.require(:aluno).permit(:nome, :data_nascimento, :cpf, :email, :password, :turma)
    end
  end
end