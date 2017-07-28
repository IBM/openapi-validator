#! /bin/sh

# must have docker-clean installed
docker-clean all
npm i
npm run build
docker build --no-cache -t swagger-editor .
docker run -p 8090:8080 swagger-editor
