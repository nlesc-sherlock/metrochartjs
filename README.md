
# Live demo

See the live demo [here](http://jspaaks.github.io/metrochart/)!


# Usage (Linux Ubuntu)

```bash

# install version management git (needs root)
sudo apt-get install git

# get a copy of the repository
git clone https://github.com/jspaaks/metrochart.git

# change into the directory
cd metrochart

# install curl
sudo apt-get install curl

# Add new PPA and install nodejs version from it, not from the ubuntu
# repo; don't do sudo apt-get install npm
sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install nodejs

# we'll need to compile some stuff later, so install g++ (needs root)
sudo apt-get install g++
sudo apt-get install make

# globally install typescript and tsd (needs root)
sudo npm install --global typescript
sudo npm install --global tsd

# install the build automation tool (needs root)
sudo npm install --global gulp

# npm package node-gyp needs python 2.7
sudo apt-get install python2.7

# let node install packages from package.json
npm install

# let tsd generate the typing information from tsd.json
tsd install

# transpile the TypeScript to make a build
gulp clean && gulp build

# change into the build/ directory, and serve the webapp from there using python's
# SimpleHttpServer on port 8089
cd build
python -m SimpleHTTPServer 8089

# Use your browser to go to http://localhost:8089 to see the webapp being served

```

