var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testHeuristic() {
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  for (var length = 1; length <= 12; ++length) {
    for (var i = 0; i < 100; ++i) {
      var scramble = rubik.scrambleMoves(length);
      var cube = new rubik.Phase1Cube();
      for (var j = 0; j < length; ++j) {
        cube.move(scramble[j], moves);
      }
      assert(heuristic.lowerBound(cube) <= length, "Bad heuristic value for " +
        scramble.join(' ') + ': ' + heuristic.lowerBound(cube));
    }
  }
}

testHeuristic();
console.log('PASS');
