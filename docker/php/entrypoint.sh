#!/bin/sh
set -eu
umask 0022

cd /var/www/html

if [ ! -f .env ]; then
  cp .env.example .env
fi

if [ ! -d vendor ]; then
  composer install --no-interaction --prefer-dist --no-dev
fi

mkdir -p \
  storage/app/public/midia \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

if ! grep -Eq '^APP_KEY=base64:.+' .env; then
  php artisan key:generate --force
fi

echo "Aguardando o MySQL..."
i=0
until php -r '
  $host = getenv("DB_HOST") ?: "mysql";
  $port = getenv("DB_PORT") ?: "3306";
  $database = getenv("DB_DATABASE") ?: "lpf";
  $user = getenv("DB_USERNAME") ?: "lpf";
  $password = getenv("DB_PASSWORD") ?: "lpf_secret";
  new PDO("mysql:host={$host};port={$port};dbname={$database}", $user, $password);
'; do
  i=$((i + 1))
  if [ "$i" -gt 40 ]; then
    echo "O MySQL não respondeu a tempo."
    exit 1
  fi
  sleep 2
done

php artisan migrate --force
php artisan db:seed --force
php artisan storage:link --force || true

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache
chmod -R a+rX storage/app/public

touch /tmp/ready

exec docker-php-entrypoint "$@"
