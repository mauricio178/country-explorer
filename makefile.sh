## Para o container
docker stop country-explorer-frontend-container

## Remove o container
docker rm -f  country-explorer-frontend-container

## Remove a imagem
docker rmi country-explorer-frontend

## Build da nova imagem
docker build -t country-explorer-frontend --no-cache .

## Inicia o container
docker run --name country-explorer-frontend-container \
           -e NEXT_PUBLIC_API_URL="https://restcountries.com/v3.1" \
           -p 3000:3000 country-explorer-frontend