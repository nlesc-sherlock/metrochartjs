
**Usage (Linux Ubuntu)**

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

# let node install packages from package.json
npm install

# globally install bower (needs root)
sudo npm install --global bower

# let bower install packages from bower.json
bower install

# globally install typescript and tsd (needs root)
sudo npm install --global typescript
sudo npm install --global tsd

# let tsd generate the typing information from tsd.json
tsd install

# install the documentation generation tool
npm install gulp-typedoc

# install the build automation tool (needs root)
sudo npm install --global gulp

# transpile the typescript, make the library, serve at localhost:3000
gulp dev-watch

# after running a gulp dev-watch, open up a browser and navigate 
# to http://localhost:3000/ to inspect the website. You've been served!

```



