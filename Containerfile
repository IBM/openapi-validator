FROM node:current-alpine3.17 AS builder

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN cd packages/validator && npm pack && mv ibm-openapi-validator-*.tgz /tmp/ibm-openapi-validator-latest.tgz

FROM node:current-alpine3.17

ARG SOURCE=https://github.com/IBM/openapi-validator

LABEL org.opencontainers.image.source=$SOURCE
LABEL org.opencontainers.image.documentation=$SOURCE/README.md#container-image
LABEL org.opencontainers.image.licenses=Apache-2.0
LABEL org.opencontainers.image.title="OpenAPI Validator"
LABEL org.opencontainers.image.description="The IBM OpenAPI Validator lets you validate OpenAPI 3.x documents according to the OpenAPI 3.x specification, as well as IBM-defined best practices."

RUN apk add --no-cache git

COPY --from=builder /tmp/ibm-openapi-validator-latest.tgz /tmp
RUN npm install -g /tmp/ibm-openapi-validator-latest.tgz \
  && npm cache clean --force

WORKDIR /data
ENTRYPOINT ["lint-openapi"]
