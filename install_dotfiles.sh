#!/bin/bash

###########################################################
#
# getdotty.sh
#
# This script creates symlinks from the home directory
# to any desired dotfiles in ~/dotfiles
#
###########################################################

# it makes the variables
dir=~/dotfiles          # dotfiles directory
olddir=~/dotfiles_old   # old dotfiles backup directory
bashfiles="bashrc bash_aliases bash_apache bash_git bash_profile bash_prompt bash_vars bash_projects"
# zshfiles="zshrc zsh_aliases zsh_apache zsh_git zsh_profile zsh_prompt zsh_vars zsh_projects"
# vimfiles="vimrc vim_aliases vim_apache vim_git vim_profile vim_prompt vim_vars vim_projects"

# it makes a place to back up old dotfiles
echo -n "Creating $olddir for backup of any existing dotfiles in ~ ..."
mkdir -p $olddir
echo "done"

# it changes to the dotfiles directory
echo -n "Changing to the $dir directory ..."
cd $dir
echo "done"

# it moves any existing dotfiles in homedir to $olddir,
# then creates symlinks from the homedir to any files in the
# $dir specified in $files
for file in $bashfiles; do
    echo "Moving any existing dotfiles from ~ to $olddir"
    mv -f ~/.$file $olddir
    echo "Creating symlink to .$file in home directory."
    ln -s $dir/$file ~/.$file
done

# TODO: it adds checks and installers for
# `node`, `brew`, global `npm` packages,
# `git`, `git flow`, `git-completion.bash`, etc.
