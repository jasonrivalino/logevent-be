#!/bin/sh
until nc -z -v -w30 mysql 3306
do
  echo "Waiting for MySQL database connection..."
  sleep 1
done
echo "Running migrations..."
npx prisma migrate deploy
echo "Running seed script..."
npx ts-node prisma/seed.ts
echo "Starting application..."
node dist/index.js
