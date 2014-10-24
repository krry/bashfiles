# TODO

Generally, with a mind for not stepping on each other's toes, let's try to avoid merge conflicts. This is a working doc—update every chance you get.

* Use specific branches for specific objectives: 
	* Boxes - (currently, not permanently) state routing
	* Gulp - fixing gulp
	* Templates - update templates
	* Style - CSS updates
	* etc...

* Avoid drastic folder restructuring outside of commits
	* Use ````git rm```` && ````git mv```` instead of Finder

* Once new features on a branch are stable
    1. bring all the other stable features into the branch, and place the new ones on top - `git rebase master`
    2. merge the new features into master: `git checkout master; git merge <branch>`


## krry

* styles
    [ ] import core styles from Silkroad
    [x] implement Sass build in gulp
* template layout


## Lazarus

* steps and their states
* template mapping
