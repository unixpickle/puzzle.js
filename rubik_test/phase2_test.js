var assert = require('assert');
var rubik = require('../build/rubik.js');

function benchmarkPhase2() {
  var scrambles = [
    "U2 F2 L R B2 D2 R' L2 B2 U2 L R2 U2 R' L2 U2 R'",
    "L R' U2 F2 L2 D2 R' F2 L' B2 D2 R U2 D2 R L B2",
    "R L' F2 L B2 F2 R U2 L' F2 D2 R L' U2 B2 D2 R'"
  ];
  
  var heuristic = new rubik.P2Heuristic();
  heuristic.generate();
  
  var start = new Date().getTime();
  for (var i = 0; i < scrambles.length; ++i) {
    // Generate a cube.
    var moves = rubik.parseMoves(scrambles[i]);
    var cube = new rubik.CubieCube();
    for (var j = 0; j < moves.length; ++j) {
      cube.move(moves[j]);
    }
    
    // Solve phase 2.
    rubik.solvePhase2(cube, heuristic, function(moves) {
      return false;
    });
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration/scrambles.length + ' ms/solvePhase2');
}

function testPhase2() {
  var algo = rubik.parseMoves("L R' U2 F2 L2 D2");
  var cube = new rubik.CubieCube();
  for (var i = 0, len = algo.length; i < len; ++i) {
    cube.move(algo[i]);
  }
  
  var heuristic = new rubik.P2Heuristic();
  heuristic.generate();
  rubik.solvePhase2(cube, heuristic, function(moves) {
    for (var i = 0, len = moves.length; i < len; ++i) {
      cube.move(moves[i]);
    }
    assert(cube.solved());
    return false;
  });
}

// Run tests.
testPhase2();
benchmarkPhase2();
console.log('PASS');