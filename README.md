
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

# don't do sudo apt-get install npm but instead do (as root)
sudo apt-get install nodejs

# we'll need to compile some stuff later, so install g++ (needs root)
sudo apt-get install g++

# globally install typescript and tsd (needs root)
sudo npm install --global typescript
sudo npm install --global tsd

# install the build automation tool (needs root)
sudo npm install --global gulp

# let node install packages from package.json
npm install

# let tsd generate the typing information from tsd.json
tsd install


```


