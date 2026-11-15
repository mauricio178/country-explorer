@echo off

:: Para o container
docker stop country-explorer-frontend-container

:: Remove o container
docker rm -f  country-explorer-frontend-container

:: Remove a imagem
docker rmi country-explorer-frontend

:: Build da nova imagem
docker build -t country-explorer-frontend --no-cache .

:: Inicia o container
docker run --name country-explorer-frontend-container ^
           -e REST_COUNTRIES_API_KEY="%REST_COUNTRIES_API_KEY%" ^
           -p 3000:3000 country-explorer-frontend

pause