#!/usr/bin/env bash
cd /vagrant

# Update apt repositories
echo "Updating apt repositories"
apt-get update

# git
echo "Installing git"
sudo apt-get -y install git git-man git-doc

# node.js
echo "Installing Node.js"
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get -y install nodejs
sudo apt-get install build-essential
