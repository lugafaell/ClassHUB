class CreateEscolas < ActiveRecord::Migration[8.0]
  def change
    create_table :escolas do |t|
      t.string :nomeEscola
      t.string :codeAluno
      t.string :codeProfessor

      t.timestamps
    end
  end
end
