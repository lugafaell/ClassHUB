class CreateAlunos < ActiveRecord::Migration[8.0]
  def change
    create_table :alunos do |t|
      t.string :nome
      t.date :data_nascimento
      t.string :cpf
      t.string :email
      t.string :escola

      t.timestamps
    end
  end
end
