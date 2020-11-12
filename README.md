# Obv.io - Event Web App

## URLs

This is a single app that handles requests at various subdomains:

app.obv.io (obv.io Service Admin) - Handles billing, creating organizations.

myorganization.obv.io (Organization Admin) - Create/manage events, invite team
members, define roles/permisisons

myorganization.obv.io/myevent - Event site for attendees

## Testing

`npm run test` to run tests, or `npm run test:watch` to run tests any time a
file changes.

## Dev

`npm run dev` to start server at `localhost:3000`

## Staging

Merge into the `staging` branch to deploy to base url: https://staging.obv.io

## Production

Merge into the `production` branch to deploy to prod: https://\*.obv.io
