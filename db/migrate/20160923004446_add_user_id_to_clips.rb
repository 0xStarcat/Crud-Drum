class AddUserIdToClips < ActiveRecord::Migration[5.0]
  def change
     add_reference :clips, :user, index: true
  end
end
