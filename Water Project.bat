@echo off
cd ./server
start cmd /k npm start
cd ../client
start cmd /k npm start