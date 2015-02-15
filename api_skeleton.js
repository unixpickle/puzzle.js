// This is the compiled APINAME API.
(function() {

  var exports;
  if ('undefined' !== typeof window) {
    // Browser
    if (!window.puzzlejs) {
      window.puzzlejs = {APINAME: {}};
    } else if (!window.puzzlejs.APINAME) {
      window.puzzlejs.APINAME = {};
    }
    exports = window.puzzlejs.APINAME;
  } else if ('undefined' !== typeof self) {
    // WebWorker
    if (!self.puzzlejs) {
      self.puzzlejs = {APINAME: {}};
    } else if (!self.puzzlejs.APINAME) {
      self.puzzlejs.APINAME = {};
    }
    exports = self.puzzlejs.APINAME;
  } else if ('undefined' !== typeof module) {
    // Node.js
    if (!module.exports) {
      module.exports = {};
    }
    exports = module.exports;
  }
  
  APIBODY

})();
