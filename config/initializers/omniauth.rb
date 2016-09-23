Rails.application.config.middleware.use OmniAuth::Builder do
  provider :spotify, ENV["spotify_client_id"], ENV["spotify_client_secret"], scope: 'playlist-read-private user-read-private user-read-email'
end

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, ENV["gemTwitterCID"], ENV["gemTwitterCS"]
end


