# Obv.io - Event Web App

Please see the [wiki](https://gitlab.com/obviobysage/event/web/-/wikis/home) for
docs.

## Dev

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/develop/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/develop)
[![coverage report](https://gitlab.com/obviobysage/event/web/badges/develop/coverage.svg)](https://gitlab.com/obviobysage/event/web/-/commits/develop)

`npm run dev` to start server at `localhost:3000`. 

However for the development you need to work on http://app.obv.localhost:3000/.

This subdomain doesn't work on the safari browser by default. so you need to add domain resolve record to the local hosts file.
```
sudo nano /etc/hosts
```
Then add this line 
```
127.0.0.1       app.obv.localhost
```


### Storybook

Stories are automatically published to [Chromatic](https://chromatic.com) on `develop`. Click [here](https://www.chromatic.com/builds?appId=61a97cbf671694004a5ab164) to see the project.

For local development, run `npm run storybook` to see storybook at `localhost:6006`.

## Staging

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/staging/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/staging)

Merge into the `staging` branch to deploy to base url: https://staging.obv.io

## Production

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/production/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/production)

Merge into the `production` branch to deploy to prod: https://\*.obv.io
