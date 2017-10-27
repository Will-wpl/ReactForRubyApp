Rails.application.routes.draw do
  namespace :admin do
    resources :auction_results
  end
  namespace :admin do
    resources :auction_histories
  end
  namespace :admin do
    resources :auction_events
  end
  namespace :admin do
    resources :arrangements
  end
  namespace :admin do
    resources :auctions
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: 'home#index'

  devise_for :users, skip: [:sessions]
  as :user do
    get 'log_in', to: 'devise/sessions#new', as: :new_user_session
    post 'sign_up', to: 'devise/sessions#create', as: :user_session
    match 'log_out', to: 'devise/sessions#destroy', as: :destroy_user_session, via: Devise.mappings[:user].sign_out_via
  end

  namespace :admin do
    get '/' => 'home#index'
    resources :users
  end
end
