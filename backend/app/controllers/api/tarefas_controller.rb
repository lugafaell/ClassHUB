module Api
  class TarefasController < ApplicationController
    before_action :authenticate_request
    before_action :set_professor, only: [:create]
    before_action :set_tarefa, only: [:show, :update, :destroy]

    def index
      if @current_user.is_a?(Aluno)
        @tarefas = Tarefa.where(
          turma: @current_user.turma,
          escola_id: @current_user.escola_id
        ).where.not(
          id: @current_user.tarefa_alunos.where(concluida: true).select(:tarefa_id)
        )
      else
        @tarefas = @current_user.tarefas
      end

      render json: @tarefas.as_json(include: {
        professor: { only: [:id, :nome] }
      })
    end

    def show
      alunos = Aluno.where(turma: @tarefa.turma, escola_id: @tarefa.escola_id)

      alunos_com_status = alunos.map do |aluno|
        tarefa_aluno = TarefaAluno.find_by(tarefa_id: @tarefa.id, aluno_id: aluno.id)
        {
          id: aluno.id,
          nome: aluno.nome,
          concluida: tarefa_aluno ? tarefa_aluno.concluida : false
        }
      end

      render json: @tarefa.as_json(include: {
        professor: { only: [:id, :nome] }
      }).merge(alunos: alunos_com_status)
    end

    def create
      @tarefa = @professor.tarefas.build(tarefa_params)
      @tarefa.escola = @professor.escola
      @tarefa.materia = @professor.materia

      if @tarefa.save
        render json: @tarefa.as_json(include: {
          professor: { only: [:id, :nome] }
        }), status: :created
      else
        render json: @tarefa.errors, status: :unprocessable_entity
      end
    end

    def update
      unless @current_user.is_a?(Professor) && @tarefa.professor_id == @current_user.id
        return render json: { error: 'Acesso negado' }, status: :forbidden
      end

      if @tarefa.update(tarefa_params)
        render json: @tarefa.as_json(include: {
          professor: { only: [:id, :nome] }
        })
      else
        render json: @tarefa.errors, status: :unprocessable_entity
      end
    end

    def destroy
      unless @current_user.is_a?(Professor) && @tarefa.professor_id == @current_user.id
        return render json: { error: 'Acesso negado' }, status: :forbidden
      end

      @tarefa.destroy
      head :no_content
    end

    private

    def set_professor
      @professor = Professor.find(params[:professore_id])
    rescue ActiveRecord::RecordNotFound
      Rails.logger.debug "Professor not found with id: #{params[:professore_id]}"
      render json: { error: "Professor não encontrado" }, status: :not_found
    end

    def set_tarefa
      @tarefa = Tarefa.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Tarefa não encontrada" }, status: :not_found
    end

    def tarefa_params
      params.require(:tarefa).permit(:titulo, :descricao, :data_entrega, :turma)
    end
  end
end