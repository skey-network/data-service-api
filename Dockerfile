FROM node:15.0.0-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

ADD . .

RUN yarn run build

CMD [ "node", "dist/src/main" ]
