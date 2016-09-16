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
echo "$(tput setaf 2)WELCOME TO CANSECO"
echo "$(tput setaf 3)a world-series-class bash experience$(tput sgr0)"
echo "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-="

if [ $EUID -ne 0 ]; then
  echo -e "$(tput setaf 3)\nchecking for superuser privileges$(tput sgr0)"
  sudo echo -n "|-- authenticated as "
  id -un
  # opens up number of concurrent processes that can run in terminal to allow high dependency installs like Roots
  echo "|-- increasing concurrent process limit"
  sudo ulimit -u 2048
  sudo ulimit -n 12288
fi

# import shell variables
echo -e "$(tput setaf 3)\nimporting shell variables$(tput sgr0)"
if [ -f ~/.bash_vars ]; then
  source ~/.bash_vars
fi

# import git-friendly shell functions
echo -e "$(tput setaf 3)\nimporting git-friendly shell functions$(tput sgr0)"
if [ -f ~/.bash_git ]; then
  source ~/.bash_git
fi

# import custom shell prompt
echo -e "$(tput setaf 3)\nimporting custom shell prompt$(tput sgr0)"
if [ -f ~/.bash_prompt ]; then
  source ~/.bash_prompt
fi

# make sure mongoDB is running
# echo -e "$(tput setaf 3)\n => making sure mongoDB is running$(tput sgr0)"
# if ! ps -ef | grep mongo[d]
  # then mongod --dbpath ~/mongo/db &
# fi

# # load nvm shell ---- note you'll need nvm for this to work
# source ~/.nvm/nvm.sh

# # load RVM into a shell session *as a function*
# [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm"

# import project alias script
echo -e "$(tput setaf 3)\nimporting project aliases$(tput sgr0)"
if [ -f ~/.bash_projects ]; then
  source ~/.bash_projects
fi

# import git auto-completion script
echo -e "$(tput setaf 3)\nimporting bash aliases$(tput sgr0)"
if [ -f ~/.bash_aliases ]; then
  source ~/.bash_aliases
fi

# import npm auto-completion script
# TODO: check if npm-completion script is present, if not download it
echo -e "$(tput setaf 3)\nenabling npm command auto-completion$(tput sgr0)"
if [ -f ~/.npm-completion.sh ]; then
  source ~/.npm-completion.sh
fi

# import git auto-completion script
# TODO: check if git-completion script is present, if not download it
echo -e "$(tput setaf 3)\nenabling git command auto-completion$(tput sgr0)"
if [ -f ~/.git-completion.sh ]; then
  source ~/.git-completion.sh
fi

# import git auto-completion script
# TODO: check if git-flow-completion script is present, if not download it
echo -e "$(tput setaf 3)\nenabling git flow auto-completion$(tput sgr0)"
if [ -f ~/.git-flow-completion.sh ]; then
  source ~/.git-flow-completion.sh
fi
