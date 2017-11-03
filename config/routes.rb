Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # root to: 'home#index'
  resources :home, only: :index

  devise_for :users, skip: [:sessions]
  as :user do
    root :to => 'devise/sessions#new'
    get 'log_in', to: 'devise/sessions#new', as: :new_user_session
    post 'sign_up', to: 'devise/sessions#create', as: :user_session
    match 'log_out', to: 'devise/sessions#destroy', as: :destroy_user_session, via: Devise.mappings[:user].sign_out_via
  end

  namespace :api do
    resources :arrangements do
      collection do
      end
    end
    resources :auctions do
      member do
        put 'publish'
        put 'hold'
        post 'confirm'
      end
      collection do
        get 'obtain'
        get 'links'
      end
    end
  end

  namespace :admin do
    # get '/' => 'admin/home#index'
    resources :home, only: :index
    resources :users
    resources :auction_results
    resources :auction_histories
    resources :auction_events
    resources :arrangements
    resources :auctions do
      member do
        get 'upcoming' # published and pre-auction page
        get 'online' # published and pre-auciton page to retailer online status page
        get 'dashboard' # live page
        get 'confirm' # confirm or void auction page
        get 'result' # auciton result page
        get 'report' # auciton report page
        get 'log' # auction activity log page
      end
      collection do
        get 'empty' # no published auction page
      end
    end
  end

  namespace :retailer do
    resources :home, only: :index
    resources :arrangements
    resources :auctions do
      member do
        get 'live'
        get 'finish'
      end
    end
  end
end
