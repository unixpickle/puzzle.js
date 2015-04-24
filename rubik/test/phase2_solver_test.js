var rubik = require('../../build/rubik.js');
var assert = require('assert');

function phase2Scramble(coords) {
  var cube = new rubik.Phase2Cube();
  var scramble = [];
  for (var i = 0; i < 25; ++i) {
    var move = Math.floor(Math.random() * 10);
    cube.move(move, coords);
    scramble.push(move);
  }
  return {cube: cube, scramble: scramble};
}

function testPhase2Solver() {
  var coords = new rubik.Phase2Coords();
  var heuristic = new rubik.Phase2Heuristic(coords);

  // Do a bunch of random sequences and make sure a solution is found.
  for (var k = 0; k < 10; ++k) {
    var x = phase2Scramble(coords);
    var cube = x.cube;
    var solution = rubik.solvePhase2(cube, 18, heuristic, coords);
    assert(solution !== null, 'failed to solve: ' + x.scramble);

    // Make sure the solution actually works.
    for (var i = 0; i < solution.length; ++i) {
      cube.move(solution[i], coords);
    }
    assert(cube.solved(), "solution " + solution + " did not solve " +
      x.scramble);
  }
}

testPhase2Solver();
console.log('PASS');
