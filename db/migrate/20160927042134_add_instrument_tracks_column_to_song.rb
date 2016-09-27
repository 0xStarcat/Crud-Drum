class AddInstrumentTracksColumnToSong < ActiveRecord::Migration[5.0]
  def change
    add_column :songs, :instrument_tracks, :string
  end
end
