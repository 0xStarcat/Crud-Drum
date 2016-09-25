class ChangeColumnName < ActiveRecord::Migration[5.0]
  def change
    rename_column :songs, :data, :song_data
  end
end
