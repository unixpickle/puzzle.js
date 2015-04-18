var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testHeuristic() {
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  for (var length = 1; length <= 12; ++length) {
    for (var i = 0; i < 100; ++i) {
      var scramble = rubik.scrambleMoves(length);
      var cube = new rubik.Phase1AxisCubes();
      for (var j = 0; j < length; ++j) {
        cube.move(scramble[j], moves);
      }
      
      var axes = ['x', 'y', 'z'];
      for (var axis = 0; axis < 3; ++axis) {
        var bound = heuristic.axisLowerBound(cube[axes[axis]]);
        assert(bound <= length, 'Bad ' + axes[axis] + ' lower bound for ' +
          scramble.join(' ') + ': ' + bound);
      }
      assert(!heuristic.shouldPrune(cube, length));
    }
  }
}

testHeuristic();
console.log('PASS');
