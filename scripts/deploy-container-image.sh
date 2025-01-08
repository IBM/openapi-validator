#!/usr/bin/env bash

set -e

deploy() {
    login "$DOCKER_HUB_TOKEN"
    deploy_docker
}

login() {
    local token=$1
    if [[ -z "$token" ]]; then
        echo 'No Docker Hub token available' >&2
        exit 2
    fi
    docker login --username ibmdevxsdk --password-stdin <<<"$token"
}

deploy_docker() {
    local new_version=`node -p "require('./packages/validator/package.json').version"`

    # Ensure version is present and has semver format
    [[ "$new_version" =~ [[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+ ]]
    new_version=${BASH_REMATCH[0]}

    if [ -z "$new_version" ]
    then
          echo "Next release version missing or incorrectly formatted:"
          echo $new_version
          exit 2
    fi

    npm run build-docker
    docker tag ibmdevxsdk/openapi-validator:latest ibmdevxsdk/openapi-validator:"$new_version"

    docker push ibmdevxsdk/openapi-validator:"$new_version"
    docker push ibmdevxsdk/openapi-validator:latest
}

deploy "$@"
