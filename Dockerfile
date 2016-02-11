## First install docker on your machine
## Then you can build the docker image with this command (the build looks
## in this file):
# docker build -t image-metrochart .
## Then run the docker container using this command:
# docker run -p 5001:5000 --name magnificent-metrochart image-metrochart
# Now you should be able to open a browser (on the host) and navigate to
# http://localhost:5001 and see the webapp being served.



# start from ubuntu 14.04 (download from dockerhub)
FROM ubuntu:14.04

# open network port (at outside of the container)
EXPOSE 5000

# do the updates
RUN apt-get update

# install version management git
RUN apt-get install -y git

# get a copy of the repository
RUN git clone https://github.com/jspaaks/metrochart.git

# change into the directory
WORKDIR /metrochart

# install curl
RUN apt-get install -y curl

# Add new PPA and install nodejs version from it, not from the ubuntu
# repo; don't do apt-get install npm
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs

# we'll need to compile some stuff later, so install g++
RUN apt-get install -y g++
RUN apt-get install -y make

# globally install typescript and tsd
RUN npm install --global typescript
RUN npm install --global tsd

# install the build automation tool
RUN npm install --global gulp

# npm package node-gyp needs python 2.7
RUN apt-get install -y python2.7

# let node install packages from package.json
RUN PYTHON=/usr/bin/python2.7 npm install

# let tsd generate the typing information from tsd.json
RUN tsd install

# transpile the TypeScript to make a build
RUN gulp clean build tsdoc

# change into the build directory
WORKDIR /metrochart/build

# define the container's task: serving the app
CMD python2.7 -m SimpleHTTPServer 5000

