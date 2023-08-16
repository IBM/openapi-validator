FROM node:18-alpine
LABEL org.opencontainers.image.source="https://github.com/IBM/openapi-validator"
LABEL org.opencontainers.image.documentation="https://github.com/IBM/openapi-validator#container-image"
LABEL org.opencontainers.image.licenses="Apache-2.0"
LABEL org.opencontainers.image.title="OpenAPI Validator"
LABEL org.opencontainers.image.description="The IBM OpenAPI Validator lets you validate OpenAPI 3.x documents according to the OpenAPI 3.x specification, as well as IBM-defined best practices."

WORKDIR /src
# Copy and cache dependencies first for faster local rebuilds.
COPY ./package.json ./package-lock.json /src/
COPY ./packages/ruleset/package.json /src/packages/ruleset/package.json
COPY ./packages/validator/package.json /src/packages/validator/package.json
COPY ./packages/utilities/package.json /src/packages/utilities/package.json
RUN npm ci

# Add validator to executable $PATH for easy integration in custom downstream images.
ENV PATH=/usr/local/lib/node_modules:$PATH
# Add IBM ruleset to Node module search path for easy volume mounts and ruleset extensions.
ENV NODE_PATH=/usr/local/lib/node_modules
COPY . /src
RUN npm run link

WORKDIR /data
ENTRYPOINT ["/usr/local/bin/lint-openapi"]
