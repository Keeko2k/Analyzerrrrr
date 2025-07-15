@echo off
start cmd /k "cd server && node index.js"
start cmd /k "cd client && npm run dev"
