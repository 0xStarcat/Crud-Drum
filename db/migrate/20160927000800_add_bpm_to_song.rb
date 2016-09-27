class AddBpmToSong < ActiveRecord::Migration[5.0]
  def change
    add_column :songs, :bpm, :integer
  end
end
