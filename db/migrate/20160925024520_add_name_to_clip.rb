class AddNameToClip < ActiveRecord::Migration[5.0]
  def change
    add_column :clips, :name, :string
  end
end
