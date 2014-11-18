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

For development flow, please see *How to git flow*, below.

## How to *gulp*

This app features some heavy-duty `gulp`itude.

### `gulp`

Runs the default gulp tasks (build, watch, BrowserSync)

### `gulp reload`

Runs the leet version of gulp, reloading gulp itself when the gulpfile is changed.

### `gulp refresh`

Cleans out the static files in `public/`, then runs `gulp reload`

## How to *git flow*

Install [git flow](https://github.com/nvie/gitflow/wiki/Installation) from github.  **It does not interfere with git** and will make life easier.

Clone the repo:
`git clone git@github.com:SolarCity/flannel.git`
`cd flannel`

Check out the develop branch:
`git checkout origin/develop -b develop`

Initialize git flow:
`git flow init -d`

The *develop* branch should always be functional and should be the latest development goodness.  You should never commit to it directly.  Instead:
`git flow feature start "the next big feature"`
Do your coding on your feature.  When it's done:
`git rebase develop`
to make a nice clean commit to the end of the development branch. and then:
`git flow feature finish "the next big feature"`

Production is always what is on the *master* branch.  Commits should never happen to master.  When getting ready to release:
`git flow release start "the next release name"`
Fixes get done to the release branch.  When done:
`git flow release finish "the next release name"`

For production hotfixes:
`git flow hotfix start "fix the bug"`
Do the fix.  Then:
`git flow hotfix finish "fix the bug"`
