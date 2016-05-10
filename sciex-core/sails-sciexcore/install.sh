#!/bin/bash

# This script creates npm package and the same is installed in the home directory

# script variables

APPNAME="sciex"
PACKAGENAME=$(npm pack)
APPATH=node_modules/$APPNAME
INSTALLOG="$APPNAME"-install.log
TESTLOG="$APPNAME"-test.log
echo $PACKAGENAME
echo $APPATH

# move npm package created to home directory

mv $PACKAGENAME $HOME/$PACKAGENAME && cd 

# check if it was previously installed and running

if [ -d "$APPATH" ]
then
  echo "$file found."
  cd $APPATH
  npm stop
  cd
  rm -rf $APPATH
fi

# install, test and start 

echo "installing package"
npm install $PACKAGENAME >> $HOME/$INSTALLOG 2>&1
cd $APPATH 

echo "testing package"
npm test >> $HOME/$TESTLOG 2>&1

echo "starting package"
npm start

# check if the process is running

ps aux | grep node
