class ApplicationController < ActionController::API
  include JsonWebToken
  before_action :authenticate_request
  def authorize_admin
    unless @current_user.is_a?(Admin)
      render json: { error: "Acesso não autorizado" }, status: :unauthorized
    end
  end
end