# flannel

--------------
## How to `git` into it really fast

Clone the repo:
`git clone git@github.com:SolarCity/flannel.git`

Install the dependencies:
```bash
$ npm install -g gulp nodemon bower karma jshint # sudone?
$ npm install
$ bower install
```

Start devving:
`npm run dev`

You should see the gulp task logs as the app builds.

Depending on whether BrowserSync is set to manhandle your tabs, a new tab in your browser might open containing the dev environment of the app with a small, dark "Connected to Browser Sync" badge in the top right corner.

------------------
## How to build via *gulp*
For development flow, please see *How to git flow*, below.

This app features some heavy-duty `gulp`itude.

### `gulp`

Runs the default gulp tasks (build, watch, BrowserSync)

### `gulp reload`

Runs the leet version of gulp, reloading gulp itself when the gulpfile is changed.

### `gulp refresh`

Cleans out the static files in `public/`, then runs `gulp reload`

----------------
## How to dev via [git flow](https://github.com/nvie/gitflow)

Install [git flow](https://github.com/nvie/gitflow/wiki/Installation) from github. **It does not interfere with git** and will make life easier.

Clone the repo:
`git clone git@github.com:SolarCity/flannel.git`
`cd flannel`

Check out the develop branch:
`git checkout origin/develop -b develop`

Or (especially if you'd previously cloned the repo) fetch the current branches and pull the develop branch:
`git fetch`
`git checkout develop`
`git pull origin develop`

Initialize git flow with the usual defaults:
`git flow init -d`

### `develop` branch (persistent)
    * represents the most current, working build
    * merge only with a feature or a previously applied hotfix

The *develop* branch should always be functional and should be the latest development goodness. You should never commit to it directly.

### `features-*` branches
    * `git flow feature start "FEATURE_NAME"`: should be branched from `develop`
    * `git flow feature finish "FEATURE_NAME"`: when features are complete, `develop` should be rebased upon that `feature/FEATURE_NAME` branch

Instead:
`git flow feature start "THE_NEXT_BIG_FEATURE"`
Do your coding on your feature.  When it's done:
`git rebase develop`
to make a nice clean commit to the end of the development branch. and then:
`git flow feature finish "THE_NEXT_BIG_FEATURE"`

### `master` branch (persistent)
    * represents the most stable, most recent build
    * merge only with a release or a hotfix

Production is always what is on the *master* branch. Commits should never happen to master.

### `releases-*` branches
    * should replicate `develop` when it is quite stable
    * after testing they should be merged with master for automatic deploy via hooks

When getting ready to release:
`git flow release start "THE_NEXT_RELEASE_NAME"`
Fixes get done to the release branch.  When done:
`git flow release finish "THE_NEXT_RELEASE_NAME"`

### `hotfix-*` branches
    * should replicate `master` soon after a release
    * then `develop` should be rebased upon them to preserve the hotfixes

For production hotfixes:
`git flow hotfix start "THE_BUG_FIX_NAME"`
Do the fix.  Then:
`git flow hotfix finish "THE_BUG_FIX_NAME"`
