FROM node:14.14.0-alpine

WORKDIR /app

COPY package.json .

# # Hacks to fix type errors
# # https://github.com/apollographql/apollo-server/issues/3339
# RUN yarn remove @nestjs/graphql graphql-tools graphql apollo-server-express
# RUN yarn add @nestjs/graphql graphql-tools graphql apollo-server-express
# # https://github.com/nestjs/graphql/issues/1137
# RUN yarn add ts-morph @apollo/gateway

RUN npm install

ADD . .

RUN npm run build

CMD [ "node", "dist/src/main" ]
