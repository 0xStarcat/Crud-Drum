class AddInstrumentColumnToSong < ActiveRecord::Migration[5.0]
  def change
    add_column :songs, :instrument, :string
  end
end
