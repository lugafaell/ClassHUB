class CreateFeedbacks < ActiveRecord::Migration[7.0]
  def change
    create_table :feedbacks do |t|
      t.text :conteudo
      t.references :autor, polymorphic: true  
      t.references :destinatario, polymorphic: true
      t.references :tarefa
      t.integer :tipo
      t.timestamps
    end
  end
end