# Obv.io - Event Web App

Please see the [wiki](https://gitlab.com/obviobysage/event/web/-/wikis/home) for
docs.

## Dev

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/develop/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/develop)
[![coverage report](https://gitlab.com/obviobysage/event/web/badges/develop/coverage.svg)](https://gitlab.com/obviobysage/event/web/-/commits/develop)

`npm run dev` to start server at `localhost:3000`. 


> Currently setting `GENERATE_SOURCEMAP=false` in `npm run dev` to hide pusher js missing sourcemap error. See issue here: https://github.com/pusher/pusher-js/issues/535

However for the development you need to work on http://app.obv.localhost:3000/.

This subdomain doesn't work on the safari browser by default. so you need to add domain resolve record to the local hosts file.
```
sudo nano /etc/hosts
```
Then add this line 
```
127.0.0.1       app.obv.localhost
```

## Build

Run `npm run build` to verify build works. This is automatically run in CI, but as a smoke test, you may run this locally to make sure your feature branch will deploy as expected.

> We're also setting max node GC size to 8GB via `--max_old_space_size=8192` to fix OOM error when building.


### Storybook

Stories are automatically published to [Chromatic](https://chromatic.com) on `develop`. Click [here](https://www.chromatic.com/builds?appId=61a97cbf671694004a5ab164) to see the project.

For local development, run `npm run storybook` to see storybook at `localhost:6006`.

## Staging

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/staging/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/staging)

Merge into the `staging` branch to deploy to base url: https://staging.obv.io

## Production

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/production/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/production)

Merge into the `production` branch to deploy to prod: https://\*.obv.io
