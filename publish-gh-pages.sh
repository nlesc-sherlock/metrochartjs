
# This script commits the contents of ./publish/ to gh-pages such that it
# may be served automatically on http://<username>.github.io/<repository-name>
#
# Use a gulp build task to fill ./publish with something meaningful.


# Record the current directory
THE_ORIGINAL_DIR="$PWD"

# Define the name of a temporary directory and create it
THE_PUBLISH_DIR=`mktemp -d`

# Retrieve the remote's URL
THE_REPOSITORY_URL=`git config --get remote.origin.url`

# Change into the temporary directory
cd ${THE_PUBLISH_DIR}

# Clone the repository
git clone ${THE_REPOSITORY_URL}

# Change into the subdirectory
cd `ls -1`

# Checkout the gh-pages branch
git checkout gh-pages

# Copy the original's /publish/ directory's contents to this directory
cp -r ${THE_ORIGINAL_DIR}/publish/* .

# Add all the new files to git's index...
git add .

# and commit them
git commit -m 'publishing commit'

# Now push the changes back to the gh-pages branch on the remote
git push origin gh-pages

# Now get back to the directory that we started from...
cd ${THE_ORIGINAL_DIR}

# ... and remove the temporary directory
rm -rf ${THE_PUBLISH_DIR}

