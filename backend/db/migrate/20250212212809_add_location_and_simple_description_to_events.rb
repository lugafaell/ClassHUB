class AddLocationAndSimpleDescriptionToEvents < ActiveRecord::Migration[8.0]
  def change
    add_column :events, :location, :string
    add_column :events, :simple_description, :text
  end
end
