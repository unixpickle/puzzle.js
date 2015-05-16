#!/bin/bash

# This script encapsulates JavaScript code in a function.
# It provides the code with an exports variable which differs depending on the
# environment.

if [ "$#" -ne 2 ]; then
  echo 'Usage: skeletize.sh <api_name> <file.js>'
  exit 1
fi

APINAME=$1
SOURCEFILE=$2
TEMPFILE=${SOURCEFILE}.tmp

echo "// This is the compiled ${APINAME} API.
(function() {

  var exports;
  if ('undefined' !== typeof window) {
    // Browser
    if (!window.puzzlejs) {
      window.puzzlejs = {${APINAME}: {}};
    } else if (!window.puzzlejs.${APINAME}) {
      window.puzzlejs.${APINAME} = {};
    }
    exports = window.puzzlejs.${APINAME};
  } else if ('undefined' !== typeof self) {
    // WebWorker
    if (!self.puzzlejs) {
      self.puzzlejs = {${APINAME}: {}};
    } else if (!self.puzzlejs.${APINAME}) {
      self.puzzlejs.${APINAME} = {};
    }
    exports = self.puzzlejs.${APINAME};
  } else if ('undefined' !== typeof module) {
    // Node.js
    if (!module.exports) {
      module.exports = {};
    }
    exports = module.exports;
  }

  function includeAPI(name) {
    if ('undefined' !== typeof window) {
      return window.puzzlejs[name];
    } else if ('undefined' !== typeof self) {
      return self.puzzlejs[name];
    } else if ('function' === typeof require) {
      return require('./' + name + '.js');
    } else {
      throw new Error('Unable to include: ' + name);
    }
  }
" >$TEMPFILE

# Read the source file and indent it.
cat $SOURCEFILE | sed -e 's/^/  /g' | sed -e 's/ *$//g' >>$TEMPFILE

echo "" >>$TEMPFILE
echo "})();" >>$TEMPFILE

mv $TEMPFILE $SOURCEFILE