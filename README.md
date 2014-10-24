EdLiteR
=======


PRODUCITON:
here's what's necessary to host from the installation directory on the server
```` nohup forever start --watch server/server.js ````

DEVELOPMENT ENVIRONMENT:
here's what's necessary to host from the installation directory on the server
```` nohup forever start --watch server/dev-server.js ````


This is a mobile application built from a template that uses the [Ionic Framework](http://ionicframework.com/), as well as [Angular UI Router](http://angular-ui.github.io/ui-router/), [Angular-UI-Bootstrap](http://angular-ui.github.io/), [Express JS](http://expressjs.com/). 

What's missing: 
* Testing
* Compiled JS files instead of a new line in index for every new directive... ie. Gulp isn't working yet but it's there to help when ready
* there's probably a lot of other stuff missing... submit issues when you find them

Where'd it come from?
* github.com/lazaruslarue/lame-ionic-app

## Deploy steps

set environment variables & hooks. Upload. 

## Dev steps

clone it. 

then: 

```bash
$ npm install -g ionic cordova gulp express nodemon
$ npm install
$ bower install
$ nodemon --watch

```
Unless you have a PORT environment variable set, you'll find your app sitting at ````localhost:3000````

### To build the Ionic app:
from the root of the app run:

```bash
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios
```

Substitute ios for android if not on a Mac, but if you can, the ios development toolchain is a lot easier to work with until you need to do anything custom to Android.

## Issues
Open up a new issue or comment on an existing one. PRs are graciously accepted

## everything below here is lifted from the Ionic page about their APP template

## Using Sass (optional)

This project makes it easy to use Sass (the SCSS syntax) in your projects. This enables you to override styles from Ionic, and benefit from
Sass's great features.

Just update the `./scss/ionic.app.scss` file, and run `gulp` or `gulp watch` to rebuild the CSS files for Ionic.

Note: if you choose to use the Sass method, make sure to remove the included `ionic.css` file in `index.html`, and then uncomment
the include to your `ionic.app.css` file which now contains all your Sass code and Ionic itself:

```html
<!-- IF using Sass (run gulp sass first), then remove the CSS include above
<link href="css/ionic.app.css" rel="stylesheet">
-->
```

## Updating Ionic

To update to a new version of Ionic, open bower.json and change the version listed there.

For example, to update from version `1.0.0-beta.4` to `1.0.0-beta.5`, open bower.json and change this:

```
"ionic": "driftyco/ionic-bower#1.0.0-beta.4"
```

To this:

```
"ionic": "driftyco/ionic-bower#1.0.0-beta.5"
```

After saving the update to bower.json file, run `gulp install`.

Alternatively, install bower globally with `npm install -g bower` and run `bower install`.
