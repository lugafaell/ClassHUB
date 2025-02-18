class CreateTarefas < ActiveRecord::Migration[8.0]
  def change
    create_table :tarefas do |t|
      t.string :titulo
      t.text :descricao
      t.date :data_entrega
      t.string :turma
      t.references :professor, null: false, foreign_key: true
      t.references :escola, null: false, foreign_key: true
      t.string :status

      t.timestamps
    end
  end
end
