var assert = require('assert');
var rubik = require('../build/rubik.js');

function testPhase1() {
  var algo = rubik.parseMoves('U R L D F B');
  var cube = new rubik.CubieCube();
  for (var i = 0, len = algo.length; i < len; ++i) {
    cube.move(algo[i]);
  }
  
  var heuristic = new rubik.P1Heuristic();
  heuristic.generate();
  rubik.solvePhase1(cube, heuristic, function(moves) {
    for (var i = 0, len = moves.length; i < len; ++i) {
      cube.move(moves[i]);
    }
    assert(rubik.phase1Solved(cube));
    return false;
  });
}

// Run tests.
testPhase1();
console.log('PASS');
