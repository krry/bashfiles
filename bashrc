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
echo -e "\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="
echo "WELCOME TO CANSECO"
echo "a world-series-class bash experience"
echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="

if [ $EUID -ne 0 ]; then
  echo -e "\nchecking for superuser privileges"
  sudo echo -n "|-- authenticated as "
  id -un
  # opens up number of concurrent processes that can run in terminal to allow high dependency installs like Roots
  echo "|-- increasing concurrent process limit"
  sudo ulimit -u 2048
  sudo ulimit -n 12288
fi

# import shell variables
echo -e "\nimporting shell variables"
if [ -f ~/.bash_vars ]; then
  source ~/.bash_vars
fi

# import git-friendly shell functions
echo -e "\nimporting git-friendly shell functions"
if [ -f ~/.bash_git ]; then
  source ~/.bash_git
fi

# import custom shell prompt
echo -e "\nimporting custom shell prompt"
if [ -f ~/.bash_prompt ]; then
  source ~/.bash_prompt
fi

# make sure mongoDB is running
# echo -e "\n => making sure mongoDB is running"
# if ! ps -ef | grep mongo[d]
  # then mongod --dbpath ~/mongo/db &
# fi

# # load nvm shell ---- note you'll need nvm for this to work
# source ~/.nvm/nvm.sh

# # load RVM into a shell session *as a function*
# [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

# import project alias script
echo -e "\nimporting project aliases"
if [ -f ~/.bash_projects ]; then
  source ~/.bash_projects
fi

# import git auto-completion script
echo -e "\nimporting bash aliases"
if [ -f ~/.bash_aliases ]; then
  source ~/.bash_aliases
fi

# import npm auto-completion script
# TODO: check if npm-completion script is present, if not download it
echo -e "\nenabling npm command auto-completion"
if [ -f ~/.npm-completion.sh ]; then
  source ~/.npm-completion.sh
fi

# import git auto-completion script
# TODO: check if git-completion script is present, if not download it
echo -e "\nenabling git command auto-completion"
if [ -f ~/.git-completion.sh ]; then
  source ~/.git-completion.sh
fi

# import git auto-completion script
# TODO: check if git-flow-completion script is present, if not download it
echo -e "\nenabling git flow auto-completion"
if [ -f ~/.git-flow-completion.sh ]; then
  source ~/.git-flow-completion.sh
fi
