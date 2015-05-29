###########################################################
#
#  CANSECO
#  a World Series-class .bashrc file
#
#  Canseco draws from a few others' shell profiles, namely:
#  killfall's ===> https://github.com/killfall/terminal-piperita
#  and another couple I can't place at the moment
#
###########################################################
echo ""
echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
echo "WELCOME TO CANSECO"
echo "a world-series-class bash experience"
echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
echo ""

# import shell variables
echo "=> importing shell variables"
if [ -f ~/.bash_vars ]; then
  source ~/.bash_vars
fi

# import git-friendly shell functions
echo "=> importing git-friendly shell functions"
if [ -f ~/.bash_git ]; then
  source ~/.bash_git
fi

# import custom shell prompt
echo "=> importing custom shell prompt"
if [ -f ~/.bash_prompt ]; then
  source ~/.bash_prompt
fi

# opens up number of concurrent processes that can run in terminal to allow high dependency installs like Roots
echo "=> expanding concurrent process limit to enable high-dependency packages to install"
ulimit -n 16384
ulimit -u 2048

# make sure mongoDB is running
# echo "=> making sure mongoDB is running"
# if ! ps -ef | grep mongo[d]
  # then mongod --dbpath ~/mongo/db &
# fi

# # load nvm shell ---- note you'll need nvm for this to work
# source ~/.nvm/nvm.sh

# # load RVM into a shell session *as a function*
# [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

# import project alias script
echo "=> importing project aliases"
if [ -f ~/.projects ]; then
  source ~/.projects
fi

# import git auto-completion script
echo "=> importing bash aliases"
if [ -f ~/.bash_aliases ]; then
  source ~/.bash_aliases
fi

# import npm auto-completion script
echo "=> enabling npm command auto-completion"
if [ -f ~/.npm-completion.sh ]; then
  source ~/.npm-completion.sh
fi

# import git auto-completion script
echo "=> enabling git command auto-completion"
if [ -f ~/.git-completion.sh ]; then
  source ~/.git-completion.sh
fi

# import git auto-completion script
echo "=> enabling git flow auto-completion"
if [ -f ~/.git-flow-completion.sh ]; then
  source ~/.git-flow-completion.sh
fi
