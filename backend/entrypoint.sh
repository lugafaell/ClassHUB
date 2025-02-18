#!/bin/bash
set -e

echo "Aguardando banco de dados..."

export PGPASSWORD=$POSTGRES_PASSWORD

# Aguarda o PostgreSQL ficar disponível
until psql -h "db" -U "$POSTGRES_USER" -d "postgres" -c '\q'; do
  >&2 echo "Postgres não está pronto ainda - aguardando..."
  sleep 3
done

echo "Verificando banco de dados..."
# Tenta criar o banco explicitamente
psql -h "db" -U "$POSTGRES_USER" -d "postgres" -c "CREATE DATABASE eduDB;" || true

echo "Rodando migrations..."
bundle exec rails db:migrate || bundle exec rails db:setup

echo "Configurando ambiente..."
bundle exec rails db:environment:set RAILS_ENV=production

echo "Iniciando aplicação..."
exec "$@"