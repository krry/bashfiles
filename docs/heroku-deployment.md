# Deploying Flannel to Heroku

## Key Differences

To deploy Flannel to Heroku, we had to alter the build slightly. Most of the changes occurred in the app's `package.json`.

1. We moved the `devDependencies` into the `dependencies`. In order to build the app on the remote Heroku server, we have to run `gulp` and all its dependencies. And Heroku's default node buildpack runs `npm install --production` which ignores the `devDependencies`. So rather than alter the buildpack.
2. We added `.buildpacks` which is used when the [`multi` buildpack](https://github.com/ddollar/heroku-buildpack-multi) is set in the Heroku config.
3. We're using [krry's custom node-bower-gulp buildpack](https://github.com/krry/heroku-buildpack-nodejs-gulp) for now though.
4. Added a `heroku:production` gulp task, which is what the Heroku buildpack runs to build the app.
5. Added a `Procfile` which tells Heroku how to run the app.
