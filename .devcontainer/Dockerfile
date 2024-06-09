FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

ARG PB_VERSION=0.22.13

# download and unzip PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

ENV PATH="${PATH}:/pb"

RUN npm install -g pnpm@9.2.0
RUN pnpm config set store-dir /.pnpm-store
