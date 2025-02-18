module Api
    class AdminsController < ApplicationController
      skip_before_action :authenticate_request, only: [:create]
      before_action :set_admin, only: [:show, :update, :destroy]
      before_action :authorize_admin, except: [:create]
    
      def index
        @admins = Admin.includes(:escola).all
        render json: @admins.as_json(include: { 
          escola: { 
            only: [:id, :nomeEscola] 
          }
        }, except: [:password_digest])
      end
    
      def show
        render json: @admin.as_json(include: { 
          escola: { 
            only: [:id, :nomeEscola] 
          }
        }, except: [:password_digest])
      end
    
      def create
        escola = Escola.find_by(codeAdmin: params[:admin][:codigo_escola])
        unless escola
          return render json: { error: 'Código administrativo inválido' }, status: :bad_request
        end
  
        @admin = Admin.new(admin_params)
        @admin.escola = escola
  
        if @admin.save
          render json: @admin.as_json(include: {
            escola: {
              only: [:id, :nomeEscola]
            }
          }, except: [:password_digest]), status: :created
        else
          render json: @admin.errors, status: :unprocessable_entity
        end
      end
    
      def update
        if @admin.update(admin_params)
          render json: @admin.as_json(include: {
            escola: {
              only: [:id, :nomeEscola]
            }
          }, except: [:password_digest])
        else
          render json: @admin.errors, status: :unprocessable_entity
        end
      end
    
      def destroy
        @admin.destroy
        head :no_content
      end

      def list_alunos
        @alunos = @current_user.escola.alunos
        render json: @alunos.as_json(include: { 
          escola: { only: [:id, :nomeEscola] }
        }, except: [:password_digest])
      end
  
      def update_aluno
        @aluno = @current_user.escola.alunos.find(params[:aluno_id])
        if @aluno.update(aluno_params)
          render json: @aluno.as_json(include: {
            escola: { only: [:id, :nomeEscola] }
          }, except: [:password_digest])
        else
          render json: @aluno.errors, status: :unprocessable_entity
        end
      end
  
      def delete_aluno
        @aluno = @current_user.escola.alunos.find(params[:aluno_id])
        @aluno.destroy
        head :no_content
      end
  
      def list_professores
        @professors = @current_user.escola.professors
        render json: @professors.as_json(include: { 
          escola: { only: [:id, :nomeEscola] }
        }, except: [:password_digest])
      end
  
      def update_professor
        @professor = @current_user.escola.professors.find(params[:professor_id])
        if @professor.update(professor_params)
          render json: @professor.as_json(include: {
            escola: { only: [:id, :nomeEscola] }
          }, except: [:password_digest])
        else
          render json: @professor.errors, status: :unprocessable_entity
        end
      end
  
      def delete_professor
        @professor = @current_user.escola.professors.find(params[:professor_id])
        @professor.destroy
        head :no_content
      end
    
      private
    
      def set_admin
        @admin = Admin.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Administrador não encontrado" }, status: :not_found
      end
      
      def admin_params
        params.require(:admin).permit(:email, :password)
      end

      def aluno_params
        params.require(:aluno).permit(:nome, :data_nascimento, :cpf, :email, :password, :turma)
      end
  
      def professor_params
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