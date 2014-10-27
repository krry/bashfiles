flannel
=======

## How to *dev*

Clone the repo:
`git clone git@github.com:SolarCity/flannel.git`

Install the dependencies:
```bash
$ npm install -g gulp nodemon bower #might hafta sudo
$ npm install
$ bower install
```

Start devving:
`npm run dev`

You should see the gulp task logs as the app builds, then a new tab in your browser should open containing the app with a small "Connected to Browser Sync" badge in the top right corner.

## How to *gulp*

This app features some heavy-duty `gulp`itude.

### `gulp`

Runs the default gulp tasks (build, watch, BrowserSync)

### `gulp reload`

Runs the leet version of gulp, reloading gulp itself when the gulpfile is changed.

### `gulp refresh`

Cleans out the static files in `public/`, then runs `gulp reload`

