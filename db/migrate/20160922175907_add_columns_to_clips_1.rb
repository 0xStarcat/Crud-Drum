class AddColumnsToClips1 < ActiveRecord::Migration[5.0]
  def change
    add_column :clips, :coords, :string
  end
end
