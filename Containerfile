FROM node:current-alpine3.17 AS builder

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN cd packages/validator && npm pack && mv ibm-openapi-validator-*.tgz /tmp/ibm-openapi-validator-latest.tgz

FROM node:current-alpine3.17

RUN apk add --no-cache git

COPY --from=builder /tmp/ibm-openapi-validator-latest.tgz /tmp
# not possible to install from github directly https://github.com/npm/npm/issues/2974
RUN npm install -g /tmp/ibm-openapi-validator-latest.tgz \
  && npm cache clean --force

WORKDIR /code
ENTRYPOINT ["lint-openapi", "--config", "/config.json", "--codeclimate"]
