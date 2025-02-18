Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  namespace :api do
    get 'validate_token', to: 'tokens#validate'
    post 'login', to: 'auth#login'
    resources :alunos do
      member do
        get 'materias'
        get 'cronograma'
      end
    end
    resources :admins do
      member do
        get 'alunos', to: 'admins#list_alunos'
        put 'alunos/:aluno_id', to: 'admins#update_aluno'
        delete 'alunos/:aluno_id', to: 'admins#delete_aluno'
        
        get 'professores', to: 'admins#list_professores'
        put 'professores/:professor_id', to: 'admins#update_professor'
        delete 'professores/:professor_id', to: 'admins#delete_professor'
      end
    end
    resources :feedbacks, only: [:create, :index]
    resources :events
    resources :tarefas do
      resources :feedbacks, only: [:index], on: :member
    end
    resources :professores do
      resources :tarefas
    end  
    resources :escolas

    resources :tarefas, only: [:index] do
      resources :tarefa_alunos, only: [:create]
    end
    
    get 'minhas_tarefas_concluidas', to: 'tarefa_alunos#index'

    resources :notifications, only: [:index, :destroy] do
      member do
        patch :mark_as_read
      end
      collection do
        patch :mark_all_as_read
      end
    end

  end
end