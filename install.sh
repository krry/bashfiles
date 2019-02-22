#!/bin/bash

###########################################################
#
# install.sh
#
# This script creates symlinks from the home directory
# to any desired dotfiles in ~/dotfiles
#
###########################################################

# it makes the variables
dir=~/.dotfiles          # dotfiles directory
olddir=~/.dotfiles/old   # old dotfiles backup directory
bashfiles="bashrc bash_vars bash_aliases bash_git bash_profile bash_prompt bash_projects"

# it makes a place to back up old dotfiles
echo "creating backup dir at $olddir"
mkdir -p $olddir

# it changes to the dotfiles directory
echo "navigating to $dir"
cd $dir

# it moves any existing dotfiles in homedir to $olddir,
# then creates symlinks from the homedir to any files in the
# $dir specified in $files
echo "moving old dotfiles to $olddir"
echo "symlinking .bashfiles to $HOME."
for file in $bashfiles; do
    mv -f ~/.$file $olddir 2> /dev/null
    echo " => linking .$file"
    ln -s $dir/$file $HOME/.$file 2> /dev/null
done

# TODO: it adds checks and installers for
# `node`, `brew`, global `npm` packages,
# `git`, `git flow`, `git-completion.bash`, etc.
