class AddInstrumentColumnToClip < ActiveRecord::Migration[5.0]
  def change
    add_column :clips, :instrument, :string
  end
end
