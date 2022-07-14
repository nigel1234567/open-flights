Rails.application.routes.draw do
  root 'pages#index'

  namespace :api do
    namespace :v1 do
      resources :airlines, param: :slug
      resources :reviews, only: [:create, :destroy]
    end
  end

  # Handles Routing to React components without interfering with Rails Routes for our api
  get '*path', to: 'pages#index', via: :all
end
