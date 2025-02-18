# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_02_18_010537) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "admins", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.bigint "escola_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["escola_id"], name: "index_admins_on_escola_id"
  end

  create_table "alunos", force: :cascade do |t|
    t.string "nome"
    t.date "data_nascimento"
    t.string "cpf"
    t.string "email"
    t.string "escola"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.bigint "escola_id", null: false
    t.string "turma"
    t.index ["escola_id"], name: "index_alunos_on_escola_id"
  end

  create_table "escolas", force: :cascade do |t|
    t.string "nomeEscola"
    t.string "codeAluno"
    t.string "codeProfessor"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "codeAdmin"
  end

  create_table "event_notification_trackers", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "trackable_id"
    t.string "trackable_type"
    t.index ["event_id"], name: "index_event_notification_trackers_on_event_id"
    t.index ["trackable_id", "trackable_type"], name: "index_event_trackers_on_trackable"
  end

  create_table "events", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.datetime "date"
    t.bigint "admin_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "location"
    t.text "simple_description"
    t.time "start_time"
    t.time "end_time"
    t.index ["admin_id"], name: "index_events_on_admin_id"
  end

  create_table "feedbacks", force: :cascade do |t|
    t.text "conteudo"
    t.string "autor_type"
    t.bigint "autor_id"
    t.string "destinatario_type"
    t.bigint "destinatario_id"
    t.bigint "tarefa_id"
    t.integer "tipo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["autor_type", "autor_id"], name: "index_feedbacks_on_autor"
    t.index ["destinatario_type", "destinatario_id"], name: "index_feedbacks_on_destinatario"
    t.index ["tarefa_id"], name: "index_feedbacks_on_tarefa_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.string "notifiable_type", null: false
    t.bigint "notifiable_id", null: false
    t.text "message"
    t.boolean "read", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "recipient_id"
    t.string "recipient_type"
    t.index ["notifiable_type", "notifiable_id"], name: "index_notifications_on_notifiable"
    t.index ["recipient_id", "recipient_type"], name: "index_notifications_on_recipient_id_and_recipient_type"
  end

  create_table "professors", force: :cascade do |t|
    t.string "nome"
    t.date "data_nascimento"
    t.string "cpf"
    t.string "email"
    t.string "escola"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.bigint "escola_id", null: false
    t.string "materia"
    t.string "turmas"
    t.string "dias_aula", default: [], array: true
    t.index ["escola_id"], name: "index_professors_on_escola_id"
  end

  create_table "tarefa_alunos", force: :cascade do |t|
    t.bigint "tarefa_id", null: false
    t.bigint "aluno_id", null: false
    t.boolean "concluida", default: false
    t.datetime "data_conclusao"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["aluno_id"], name: "index_tarefa_alunos_on_aluno_id"
    t.index ["tarefa_id", "aluno_id"], name: "index_tarefa_alunos_on_tarefa_id_and_aluno_id", unique: true
    t.index ["tarefa_id"], name: "index_tarefa_alunos_on_tarefa_id"
  end

  create_table "tarefas", force: :cascade do |t|
    t.string "titulo"
    t.text "descricao"
    t.date "data_entrega"
    t.string "turma"
    t.bigint "professor_id", null: false
    t.bigint "escola_id", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "materia", null: false
    t.index ["escola_id"], name: "index_tarefas_on_escola_id"
    t.index ["professor_id"], name: "index_tarefas_on_professor_id"
  end

  add_foreign_key "admins", "escolas"
  add_foreign_key "alunos", "escolas"
  add_foreign_key "event_notification_trackers", "events", on_delete: :cascade
  add_foreign_key "events", "admins"
  add_foreign_key "professors", "escolas"
  add_foreign_key "tarefa_alunos", "alunos", on_delete: :cascade
  add_foreign_key "tarefa_alunos", "tarefas", on_delete: :cascade
  add_foreign_key "tarefas", "escolas"
  add_foreign_key "tarefas", "professors", on_delete: :cascade
end
