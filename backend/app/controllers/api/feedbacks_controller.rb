module Api
  class FeedbacksController < ApplicationController
    def create
      @feedback = @current_user.feedbacks_enviados.build(feedback_params)
      
      unless turma_valida?
        return render json: { error: 'Usuário não pertence à turma correta' }, 
                      status: :unauthorized
      end
      
      if @feedback.save
        render json: @feedback, status: :created
      else
        render json: @feedback.errors, status: :unprocessable_entity
      end
    end
    
    def index
      @feedbacks = if @current_user.is_a?(Professor)
        Feedback.where("(destinatario_id = ? AND destinatario_type = ?) OR 
                       (tarefa_id IN (?))", 
          @current_user.id, 
          'Professor',
          @current_user.tarefas.pluck(:id)
        )
      else
        @current_user.feedbacks_recebidos
      end
      
      render json: @feedbacks.as_json(include: {
        autor: { only: [:id, :nome] },
        tarefa: { only: [:id, :titulo] }
      })
    end

    private
    
    def turma_valida?
      if @current_user.is_a?(Professor)
        destinatario = Aluno.find_by(id: feedback_params[:destinatario_id])
        return false unless destinatario
        
        @current_user.turmas.include?(destinatario.turma)
      else
        return true unless feedback_params[:tarefa_id].present?
        
        tarefa = Tarefa.find_by(id: feedback_params[:tarefa_id])
        return false unless tarefa
        
        professor = tarefa.professor
        if professor.turmas.include?(@current_user.turma)
          unless @current_user.tarefas.include?(tarefa)
            @current_user.tarefas << tarefa
          end
          true
        else
          false
        end
      end
    end

    def feedback_params
      params.require(:feedback).permit(
        :conteudo,
        :destinatario_id,
        :destinatario_type,
        :tarefa_id,
        :tipo
      )
    end
  end
end