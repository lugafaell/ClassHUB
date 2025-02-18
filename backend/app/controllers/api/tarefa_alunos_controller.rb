module Api
    class TarefaAlunosController < ApplicationController
      def create
        return render json: { error: 'Acesso negado' }, status: :forbidden unless @current_user.is_a?(Aluno)
  
        @tarefa_aluno = @current_user.tarefa_alunos.build(
          tarefa_id: params[:tarefa_id],
          concluida: true,
          data_conclusao: Time.current
        )
  
        if @tarefa_aluno.save
          render json: { message: 'Tarefa marcada como concluída' }, status: :created
        else
          render json: @tarefa_aluno.errors, status: :unprocessable_entity
        end
      end
      
      def index
        return render json: { error: 'Acesso negado' }, status: :forbidden unless @current_user.is_a?(Aluno)
        
        @tarefas_concluidas = @current_user.tarefa_alunos.where(concluida: true).includes(:tarefa)
        render json: @tarefas_concluidas.as_json(include: :tarefa)
      end
    end
  end