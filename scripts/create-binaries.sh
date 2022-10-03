./node_modules/.bin/pkg --out-path=./bin ./packages/validator/package.json

cd ./bin
mv ibm-openapi-validator-macos lint-openapi-macos
mv ibm-openapi-validator-linux lint-openapi-linux
mv ibm-openapi-validator-win.exe lint-openapi-win.exe
