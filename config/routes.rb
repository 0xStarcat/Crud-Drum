Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

root to: "users#index"
resources :clips
resources :users
resources :songs

get 'load_samples', to: 'users#send_samples'

get 'user_req', to: 'users#return_data'
get 'clip_req', to: 'clips#load_clip'
get 'song_req', to: 'songs#load_song'

delete "/clips" => "clips#delete_clip", as: :delete_clip
delete "/songs" => "songs#delete_song", as: :delete_song

get "/auth/:provider/callback" => "sessions#create"
get "signout" => "sessions#destroy", :as => :signout

end
