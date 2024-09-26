#!/bin/bash

echo "running watch.sh"
echo "working directory:"
ls -la

echo "node version: $(node -v)"
echo "npm version: $(npm -v)"
echo "ts-node version: $(ts-node -v)"
echo "nodemon version: $(nodemon -v)"
echo "typst version: $(typst --version)"

# start 2 watch processes in parallel
# 1. in out/web npm run dev
# 2. in out/pdf-professional nodemon update.sh

# 1. in out/web npm run dev
cd out/web
npm i
npm run dev &
cd ../..

# 2. in out/pdf-professional nodemon update.sh
cd out/pdf-professional
nodemon . &
cd ../..

# wait for both processes to finish
wait