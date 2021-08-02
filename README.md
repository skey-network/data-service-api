# Data Service Api

App used to fetch data from data service. Documentation is avaialble at `/graphql`

## Run in development

```bash
# Install dependencies
yarn

# Create env
cp .env.example .env

# Run server
npm run start:dev
```

## Run with docker

```bash
docker compose build && docker compose up
```

## Environment variables

| Property                     | Default value        | Description                         |
| ---------------------------- | -------------------- | ----------------------------------- |
| APP_PORT                     | 3000                 | Port used by the server             |
| APP_DEFAULT_PAGINATION_LIMIT | 25                   | Amount of items returned by default |
| APP_MAX_PAGINATION_LIMIT     | 1000                 | Maximal amount of items returned    |
| APP_REQUIRE_API_KEY          | true                 | Whether app should require api key  |
| APP_API_KEY                  | super-secret-api-key | Api key                             |
| DB_NAME                      | admin                | Database name                       |
| DB_HOST                      | localhost            | Database host                       |
| DB_PORT                      | 27017                | Database port                       |
| DB_USERNAME                  | root                 | Database username                   |
| DB_PASSWORD                  | password             | Database password                   |
