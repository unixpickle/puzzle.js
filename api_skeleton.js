// This is the compiled APINAME API.
(function() {

  var exports;
  if ('undefined' !== typeof window || 'undefined' !== typeof self) {
    // Browser or Web Worker.
    var w = (window || self);
    if (!w.puzzlejs) {
      w.puzzlejs = {APINAME: {}};
    } else if (w.puzzlejs.APINAME) {
      w.puzzlejs.APINAME = {};
    }
    exports = w.puzzlejs.APINAME;
  } else if ('undefined' !== typeof module) {
    // Node.js
    if (!module.exports) {
      module.exports = {};
    }
    exports = module.exports;
  }
  
  APIBODY

})();
