#!/usr/bin/env bash

# Enable shell debug mode so we get a few additional details in the build log.
set -x

# This script will be run when "npm run pkg" is executed from within
# the "packages/validator" directory.
# The commands below assume that the current directory is packages/validator.

# Before creating the executables, we need to remove the "openapi-ruleset"
# and "openapi-ruleset-utilities" dependencies from the packages/validator/node_modules
# and packages/ruleset/node_modules directories (respectively).
# We need to do this because those locations will actually contain the prior version 
# of the dependency if we've published a new release of it during the same build.
# By removing them from the packages/[validator,ruleset] directories, we ensure that
# the correct version of these dependencies is obtained from the project's top-level
# node_modules directory instead.
if [[ -e "node_modules/@ibm-cloud" ]]; then
    rm -fr "node_modules/@ibm-cloud"
fi

if [[ -e "../ruleset/node_modules/@ibm-cloud" ]]; then
    rm -fr "../ruleset/node_modules/@ibm-cloud"
fi

# Create the executables
../../node_modules/.bin/pkg --out-path=./bin ./package.json

# Rename the executables and set their execute bit.
cd ./bin
mv ibm-openapi-validator-macos lint-openapi-macos
mv ibm-openapi-validator-linux lint-openapi-linux
mv ibm-openapi-validator-win.exe lint-openapi-win.exe
chmod +x lint-openapi-win.exe
