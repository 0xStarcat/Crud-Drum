class AddUserToSong < ActiveRecord::Migration[5.0]
  def change
    add_reference :songs, :user, index: true
  end
end
