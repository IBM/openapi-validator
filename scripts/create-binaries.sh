#!/bin/bash

# This script will be run when "npm run pkg" is executed from within
# the "packages/validator" directory.
# The commands below assume that the current directory is packages/validator.
../../node_modules/.bin/pkg --out-path=./bin ./package.json
 
cd ./bin
mv ibm-openapi-validator-macos lint-openapi-macos
mv ibm-openapi-validator-linux lint-openapi-linux
mv ibm-openapi-validator-win.exe lint-openapi-win.exe
chmod +x lint-openapi-win.exe
