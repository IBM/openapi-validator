#!/usr/bin/env bash

set -e

deploy() {
    local travis_tag=$1
    login "$DOCKER_HUB_TOKEN"
    deploy_docker "$travis_tag"
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
    local tag=$1
    [[ "$tag" =~ ibm-openapi-validator@([[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+) ]]
    local docker_tag=${BASH_REMATCH[1]}

    npm run build-docker
    docker tag ibmdevxsdk/openapi-validator:latest ibmdevxsdk/openapi-validator:"$docker_tag"

    docker push ibmdevxsdk/openapi-validator:"$docker_tag"
    docker push ibmdevxsdk/openapi-validator:latest
}

deploy "$@"
