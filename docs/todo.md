# TODO

Generally, with a mind for not stepping on each other's toes, let's try to avoid merge conflicts. This is a working doc—update every chance you get.

* Use specific branches for specific objectives: 
	* Boxes - (currently, not permanently) state routing
	* Gulp - fixing gulp
	* Templates - update templates
	* Style - CSS updates
	* etc...

* Avoid drastic folder restructuring outside of commits
	* Use `git rm` && `git mv` instead of Finder

* Once new features on a branch are stable
    1. bring all the other stable features into the branch, and place the new ones on top - `git rebase master`
    2. merge the new features into master: `git checkout master; git merge <branch>`

## krry

* styles
    [ ] import core styles from Silkroad
    [x] implement Sass build in gulp
* template layout


## Lazarus

* button service
	[ ] zoom controls
	[ ] pan controls
	[ ] area focus controls

* layer service
	[x] area
	[ ] static map
	[ ] panels
	[ ] 
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
