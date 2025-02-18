module Api
  class EscolasController < ApplicationController
    skip_before_action :authenticate_request, only: [:create, :destroy]
    before_action :set_escola, only: [:show, :update, :destroy]
  
    def index
      @escolas = Escola.all
      render json: @escolas
    end
  
    def show
      render json: @escola
    end
  
    def create
      @escola = Escola.new(escola_params)
      if @escola.save
        render json: @escola, status: :created
      else
        render json: @escola.errors, status: :unprocessable_entity
      end
    end
  
    def update
      if @escola.update(escola_params)
        render json: @escola
      else
        render json: @escola.errors, status: :unprocessable_entity
      end
    end
  
    def destroy
      @escola.destroy
      head :no_content
    end
  
    private
  
    def set_escola
      @escola = Escola.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Escola não encontrada" }, status: :not_found
    end
  
    def escola_params
      params.require(:escola).permit(:nomeEscola, :codeAluno, :codeProfessor, :codeAdmin)
    end
  end
end  