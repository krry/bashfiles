# dotfiles
Ready to BASH some consoles? Now you are.

## How to use these dotfiles
1. Clone this repo where I tell you to: `git clone git@github.com:krry/dotfiles.git ~/dotfiles`
2. Run the setup script: `./getdotty.sh`
3. Refresh your shell's dotfiles: `. ~/.bashrc`

## Benefits
Comments for most of the shell mods are inline in the dotfiles. Here are a few highlights:
* a nicely color-coded shell prompt complete with timestamp, clear line breaks, current directory, and current git branch
* a slew of environment variables and configurations to make `git` and `node` run smoothly
* a boatload of aliases for common console, git, and git flow commands

## Coming soon
* checks and installers for
  * `git`
  * `node`
  * `brew`
  * global `npm` packages like `gulp`, `bower`, `nodemon`
  * `git flow`
  * `git-completion.bash`
* support for `zsh`

## Thanks
Beers and cheers to Michael Smalley for pubbing [his approach to cloud-based dotfiles](http://blog.smalleycreative.com/tutorials/using-git-and-github-to-manage-your-dotfiles/) back in aught-twelve. I adapted his `makesymlinks.sh` herein because writing shell scripts is like eating uncooked pasta.*

*hard to do, hard to watch, better left to daredevils and machines
