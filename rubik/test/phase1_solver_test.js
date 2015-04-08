var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testSolver() {
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  for (var length = 1; length <= 12; ++length) {
    for (var i = 0; i < 3; ++i) {
      var scramble = rubik.scrambleMoves(length);
      var cube = new rubik.Phase1Cube();
      for (var j = 0; j < length; ++j) {
        cube.move(scramble[j], moves);
      }
      var solved = false;
      rubik.solvePhase1(cube, heuristic, moves, function(solution) {
        // Apply the moves
        for (var j = 0; j < solution.length; ++j) {
          cube.move(solution[j], moves);
        }
        assert(cube.anySolved());
        assert(solution.length <= length, 'Solution too long: ' +
          solution.join(' '));
        solved = true;
        return false;
      }, 10000);
      assert(solved);
    }
  }
}

testSolver();
console.log('PASS');
