class AddCodeAdminToEscolas < ActiveRecord::Migration[8.0]
  def change
    add_column :escolas, :codeAdmin, :string
  end
end
