# TODO

Generally, let's define a common system for resolving merge conflicts. They will happen. They are the principal reason to use `git` rather than `svn`.

* Avoid drastic folder restructuring outside of commits
    * Use `git rm` && `git mv` instead of Finder

## krry

* styles
    [x] import core styles from Silkroad
    [x] implement Sass build in gulp
    [x] auto-prefix browser-specific stty
    [?] responsive, relative grid
    [x] auto-sizing typography based on viewport size

* template layouts
    [x] home stage
    [ ] configure stage
    [ ] qualify stage
    [ ] signup stage

* form service
    [ ] location/address
    [ ] name: full split to first and last
    [ ] contact: phone/email
    [ ] usage
    [ ] credit check: optional DOB, etc.

* stages and states and steps
    [ ] advancing
    [ ] retreating
    [ ] completing
    [ ] depleting
    [ ] excreting


## Lazarus

* button service
    [ ] zoom controls
    [ ] pan controls
    [ ] area focus controls

* layer service
    [x] area
    [ ] static map
    [ ] panels
    [?] gutters
    [?] listeners

* angular.constants
    [ ] firebase base constant url
    [ ] static image url (used in LayerService)
    [ ] url builder (is this a provider or a service?)
        [ ] static template url
        [ ] static map URL
        [ ] tenhands
        [ ] design id from firebase

* directives
    [ ] see todo
        [ ] buttons
        [ ] interactions

* ui states
    [x] home
    [x] config
    [ ] qualify

* firebase
    [ ] init service
    [ ] views sync
    [ ] areas sync
    [ ] 

* tenhands
    [ ] template
    [ ] 
    
## Unclaimed

* conditionally load minified versions of dependencies when `process.env.NODE_ENV !== "development"`

* include debug and min versions of lib files in public/ for environment-conditional use
