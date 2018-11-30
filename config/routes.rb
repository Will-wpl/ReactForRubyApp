Rails.application.routes.draw do
  namespace :admin do
    resources :email_templates
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # require 'resque/server'
  # mount Resque::Server, at: '/jobs'

  # root to: 'home#index'
  resources :home, only: %i[index term] do
    collection do
      get 'term'
    end
  end

  devise_for :users, skip: %i[sessions home]
  as :user do
    get 'users/pwds/edit', to: 'devise/pwds#edit'
    patch 'users/pwds/update', to: 'devise/pwds#update'
    get 'users/choose', to: 'devise/registrations#choose'
    root to: 'devise/sessions#new'
    get 'log_in', to: 'devise/sessions#new', as: :new_user_session
    post 'sign_up', to: 'devise/sessions#create', as: :user_session
    match 'log_out', to: 'devise/sessions#destroy', as: :destroy_user_session, via: Devise.mappings[:user].sign_out_via
  end
  #
  # namespace :devise do
  #   resource :pwds
  # end

  namespace :api do
    namespace :admin do
      resources :users, only: %i[show retailers retailers_deleted buyers buyers_deleted approval_buyer_entities approval_buyer approval_retailer validate_for_delete remove_retailer remove_buyer] do
        collection do
          get 'retailers'
          get 'retailers_deleted'
          get 'buyers'
          get 'buyers_deleted'
          put 'approval_buyer_entities'
          put 'approval_buyer'
          put 'approval_retailer'
          put 'validate_for_delete'
          put 'remove_retailer'
          put 'remove_buyer'
        end
      end
      resources :auctions, only: %i[obtain link create update delete publish hold confirm destroy unpublished published retailers buyers selects send_mails check_buyer_type delete_selected_buyer] do
        member do
          put 'publish'
          put 'hold'
          post 'confirm'
          get 'retailers'
          get 'buyers'
          get 'selects'
          put 'send_mails'
          put 'check_buyer_type'
          put 'delete_selected_buyer'
          get 'retailer_dashboard'
          get 'buyer_dashboard'
          get 'pdf'
          get 'log'
        end
        collection do
          get 'obtain'
          get 'unpublished'
          get 'published'
          get 'letter_of_award_pdf'
          get 'filter_date'
        end
      end
      resource :auction_histories, only: %i[list last] do
        collection do
          get 'list'
          get 'last'
        end
      end
      resources :auction_attachments, only: %i[index create destroy] do
      end
      resources :arrangements, only: %i[index show obtain update destroy update_status] do
        member do
          put 'update_status'
        end
        collection do
          get 'obtain'
        end
      end
      resources :consumptions, only: %i[index show destroy update_status approval_consumption] do
        member do
          put 'update_status'
        end
        collection do
          put 'approval_consumption'
        end
      end
      resources :consumption_details, only: %i[index] do
      end
      resources :tenders, only: %i[] do
        member do
          get 'current'
          get 'node3_admin'
          get 'node4_admin'
          post 'node3_send_response'
          post 'node4_admin_accept'
          post 'node4_admin_reject'
        end
        collection do
          get 'history'
        end
      end
      resources :auction_results, only: %i[index] do
        member do
          get 'award'
        end
        end
      resources :user_attachments, only: %i[index create destroy find_last_by_type] do
        member do
          put 'find_last_by_type'
        end
      end
      resources :user_extensions, only: %i[index]
      resources :email_templates, only: %i[index show update]
      resources :templates, only: %i[show update list] do
        collection do
          get 'list'
        end
      end
      resources :registrations, only: %i[index retailer_info buyer_info] do
        member do
          get 'retailer_info'
          get 'buyer_info'
        end
      end
    end
  end

  namespace :api do
    namespace :retailer do
      resources :users, only: %i[show_current_user update_attachment_status] do
        collection do
          get 'show_current_user'
          put 'update_attachment_status'
        end
      end
      resources :auctions, only: %i[obtain published] do
        collection do
          get 'obtain'
          get 'published'
          get 'letter_of_award_pdf'
        end
      end
      resource :auction_histories, only: %i[show] do
      end
      resources :auction_attachments, only: %i[index create destroy] do
      end
      resources :arrangements, only: %i[index show obtain update] do
        collection do
          get 'obtain'
        end
      end
      resources :tenders, only: %i[] do
        member do
          get 'current'
          post 'node1_retailer_accept'
          post 'node1_retailer_reject'
          post 'node2_retailer_accept_all'
          post 'node2_retailer_propose_deviations'
          post 'node3_retailer_withdraw_all_deviations'
          post 'node3_retailer_submit_deviations'
          post 'node3_retailer_next'
          post 'node3_retailer_save'
          post 'node4_retailer_submit'
          post 'node4_retailer_next'
          post 'node5_retailer_submit'
          get 'node1_retailer'
          get 'node2_retailer'
          get 'node3_retailer'
          get 'node4_retailer'
          get 'node5_retailer'
          post 'node3_retailer_withdraw'
          post 'node3_retailer_save'
          post 'node3_retailer_back'
        end
        collection do
          get 'history'
        end
      end
      resources :auction_results, only: %i[index] do
        member do
          get 'award'
        end
      end
      resources :consumptions, only: %i[index] do
        member do
          post 'acknowledge'
        end
        collection do
          post 'acknowledge_all'
        end
      end
      resources :registrations, only: %i[index update sign_up validate] do
        member do
          put 'sign_up'
          put 'validate'
        end
      end
      resources :user_attachments, only: %i[create destroy] do
      end
    end
  end

  namespace :api do
    namespace :buyer do
      resources :users, only: %i[show_current_user update_attachment_status] do
        collection do
          get 'show_current_user'
          put 'update_attachment_status'
        end
      end
      resources :consumption_details, only: %i[index update participate reject validate validate_single] do
        collection do
          post 'participate'
          post 'reject'
          post 'save'
          post 'validate'
          put 'validate_single'
        end
      end
      resources :auctions, only: %i[obtain published] do
        member do
          get 'pdf'
          get 'letter_of_award_pdf'
        end
        collection do
          get 'obtain'
          get 'published'
        end
      end
      resources :auction_results, only: %i[index] do

      end
      resources :registrations, only: %i[index update sign_up validate_buyer_entity validate] do
        member do
          put 'sign_up'
          put 'validate'
        end
        collection do
          put 'validate_buyer_entity'
        end
      end
      resources :user_attachments, only: %i[create destroy patch_update_consumption_detail_id] do
        collection do
          put 'patch_update_consumption_detail_id'
        end
      end
    end
  end

  namespace :api do
    resources :base, only: %i[heartbeat] do
      collection do
        post 'heartbeat'
      end
    end
    resources :auctions, only: %i[timer] do
      member do
        get 'timer'
      end
    end
  end

  namespace :admin do
    # get '/' => 'admin/home#index'
    resources :home, only: :index
    resources :users do
      member do
        get 'manage'
      end
      collection do
        get 'retailers'
        get 'buyers'
        get 'del_retailers'
        get 'del_buyers'
        patch 'approval'
      end
    end
    resources :consumptions,only: %i[show]
    resources :auction_results, only: [:index]
    resources :auction_histories, only: []
    resources :auction_events, only: []
    resources :arrangements, only: []
    resources :user_extensions, only: %i[index]
    resources :auction_extend_times, only: []
    resources :auctions, only: %i[new empty goto upcoming online dashboard confirm result report log invitation select comsumption unpublished published buyer_dashboard retailer_dashboard tender contract_expiry] do
      member do
        get 'upcoming' # published and pre-auction page
        get 'online' # published and pre-auction page to retailer online status page
        get 'dashboard' # live page
        get 'confirm' # confirm or void auction page
        get 'choose_winner' # choose winner page
        get 'result' # auction result page
        get 'report' # auction report page
        get 'log' # auction activity log page
        get 'award' # auction activity log page
        get 'invitation' # create RA next page
        get 'select' # select users page
        get 'consumption' # select users page
        get 'buyer_dashboard'
        get 'retailer_dashboard'
        get 'tender'
      end
      collection do
        get 'empty' # no published auction page
        get 'goto'
        get 'unpublished'
        get 'published'
        get 'contract_expiry'
      end
    end
    resources :contract, only: %i[index]
    resources :templates, only: %i[index]
    resources :common_templates, only: %i[index]
    resources :request_auctions, only: %i[index show]
  end

  namespace :retailer do
    resources :home, only: :index
    resources :auctions,only: %i[index] do
      member do
        get 'award' # auction activity log page
      end
    end
    resources :arrangements, only: %i[tender] do
      member do
        get 'tender'
      end
    end
    resources :auction_results, only: [:index]
    resources :auctions, only: %i[upcoming live finish result empty goto message gotobid consumption] do
      member do
        get 'upcoming' # upcoming auction page
        get 'live' # standby and live page
        get 'finish' # finished "thank you" page
        get 'result' # view post ra page
        get 'empty' # no published auction page
        get 'goto'
        get 'message' # no published auction page
        get 'gotobid'
        get 'consumption' # select users page
      end
      collection do
      end
    end
    resources :register, only: [:index]
  end

  namespace :buyer do
    resources :home, only: :index
    resources :auction_results, only: [:index]
    resources :auctions,only: %i[index] do
      member do
        get 'report' # auction report page
        get 'award' # auction activity log page
      end
    end
    resources :consumptions,only: %i[edit]
    resources :register, only: [:index]
    resources :request_auctions, only: %i[index show entity_list]
  end

  require 'sidekiq/web'
  mount Sidekiq::Web => '/sidekiq'
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
end
