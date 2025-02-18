class AddPasswordDigestToAlunos < ActiveRecord::Migration[8.0]
  def change
    add_column :alunos, :password_digest, :string
  end
end
