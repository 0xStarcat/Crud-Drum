# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'
Rails.application.config.assets.precompile += %w( drum-machine/pattern_maker.js )
Rails.application.config.assets.precompile += %w( drum-machine/data_exchange.js )
Rails.application.config.assets.precompile += %w( drum-machine/user_interface.js )
Rails.application.config.assets.precompile += %w( drum-machine/song_maker.js )
Rails.application.config.assets.precompile += %w( drum-machine/audio_engine.js )
Rails.application.config.assets.precompile += %w( drum-machine/loading.js )

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
