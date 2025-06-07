#!/bin/bash

echo "running watch.sh"
echo "working directory:"
ls -la

echo "node version: $(node -v)"
echo "npm version: $(npm -v)"
echo "ts-node version: $(ts-node -v)"
echo "nodemon version: $(nodemon -v)"
echo "typst version: $(typst --version)"

# start 3 watch processes in parallel
# 1. in out/web npm run dev
# 2. in out/pdf-professional nodemon update.sh
# 3. in out/github-readme nodemon .

# 1. in out/web npm run dev
cd out/web
npm i
npm run dev &
cd ../..

# 2. in out/pdf-professional nodemon update.sh
cd out/pdf-professional
npm i
nodemon . &
cd ../..

# 3. in out/github-readme nodemon .
cd out/github-readme
npm i
nodemon . &
cd ../..

# wait for both processes to finish
wait