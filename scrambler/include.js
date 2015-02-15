var RubikAPI = null;
var SkewbAPI = null;

if ('undefined' !== typeof window) {
  RubikAPI = window.puzzlejs.rubik;
  SkewbAPI = window.puzzlejs.skewb;
} else if ('undefined' !== typeof self) {
  RubikAPI = self.puzzlejs.rubik;
  SkewbAPI = self.puzzlejs.skewb;
} else if ('function' === typeof require) {
  RubikAPI = require('./rubik.js');
  SkewbAPI = require('./skewb.js');
}
