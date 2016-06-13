# general shell aliases for frequently used commands
echo "|-- adding shell aliases:"
echo "    => .., h, j, ls, ll, la, rm, cp, mv, psef, mkdir"

alias ..='cd ..'
alias h='history'
alias j='jobs -l'
alias ls='ls -GFh'
alias ll="ls -ll"
alias la="ll -a"
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias psef='ps -ef | grep --color=auto'
alias mkdir='mkdir -p'
alias which='type -a'
alias rsb='exec bash -l'

# some helper aliases
echo "|-- adding helper aliases:"
echo "    => path, du, df, loadrc, openrc, openhosts"
echo "    => flushcache, bashrc, filetree, flushdns"

alias path='echo -e ${PATH//:/\\n}'
alias du='du -kh'
alias df='df -kTh'
alias dotty='cd ~/dotfiles; atom .'
alias bashrc='atom ~/.bashrc'
alias bashaliases='atom ~/.bash_aliases'
alias bashgit='atom ~/.bash_git'
alias bashhistory='atom ~/.bash_history'
alias bashprofile='atom ~/.bash_profile'
alias bashprompt='atom ~/.bash_prompt'
alias bashvars='atom ~/.bash_vars'
alias loadrc='. ~/.bashrc'
alias reloadrc='. ~/.bashrc'
alias openhosts='sudo atom /etc/hosts'
alias flushcache='dscacheutil -flushcache'
alias flushdns='sudo killall -HUP mDNSResponder'
alias filetree="ls -R | grep ":$" | sed -e 's/:$//' -e 's/[^-][^\/]*\//--/g' -e 's/^/ /' -e 's/-/|/'"

# some aliases to streamline git commands
echo "|-- adding git aliases:"
echo "    => gst, gd, gad, gch, gcb, gc, gcm, gcam, gl, gf, "
echo "    => gp, gph, gpom, gphom, gphsm, gphhm, gphpm, gpre"

alias gu='git up'
alias gst='git status'
alias gad='git add -A'
alias gco='git checkout'
alias gcob='git checkout -b'
alias gd='git diff'
alias gc='git commit'
alias gcm='git commit -m'
alias gcam='git commit -am'
alias gsh='git stash'
alias gsha='git stash apply'
alias gshp='git stash pop'
alias gf='git fetch'
alias gp='git pull'
alias gph='git push'
alias gpod='git pull origin develop'
alias gpom='git pull origin master'
alias gphom='git push origin master'
alias gphod='git push origin develop'
alias gphsm='git push staging master'
alias gphpm='git push prod master'
alias gphhm='git push heroku master'
alias gpre='git pull --rebase'
alias grc='git rebase --continue'
alias grs='git rebase --skip'
alias gra='git rebase --abort'

# git flow commands
echo "|-- adding git flow shortcuts:"
echo "    => gffs, gffp, gfff, gfrs, gfrp, gfrf, gfhs, gfhp, gfhf"

alias gffs='git flow feature start'
alias gffp='git flow feature publish'
alias gfff='git flow feature finish'
alias gfrs='git flow release start'
alias gfrp='git flow release publish'
alias gfrf='git flow release finish'
alias gfhs='git flow hotfix start'
alias gfhp='git flow hotfix publish'
alias gfhf='git flow hotfix finish'

# a really sweet git log prettifier - thx to JMarsh
alias gl='git log --graph --abbrev-commit --pretty=format:"%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset"'

# open with IA Writer
echo "|-- open docs with iA Writer with 'iamd'"
alias iamd='open -a "iA\ Writer"'

# dig down to the Packages folder for Sublime Text since the beta version doesn't manage its own packages yet
echo "|-- jump to the Sublime Text packages folder with 'sublpkg'"
alias sublpkg='cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages'
