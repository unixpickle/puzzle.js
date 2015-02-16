var assert = require('assert');
var rubik = require('../build/rubik.js');

function benchmarkPhase1() {
  var scrambles = [
    "D' R' F' L B U L F' B' D2 L2 R' D2 R' F B2 D' U B' U' B' D' F' B2 U",
    "B2 L U2 F' D' R2 B' F U2 R2 L2 B2 L' B2 D' B R F L' U2 B' U' F2 R' U'",
    "U' F2 R2 F2 R F U D' B L U2 B L B' L2 D L U2 D2 L2 B' F' L' R U",
    "B' L2 F' D U2 R2 F' L U D' R2 U L U F L' U2 L' U D' L2 R2 B2 F R",
    "D R' U2 L' R' F' U' B' D R' L' D' U2 L B F' U2 B2 U2 L' R D L2 U D'",
    "F2 D L2 D2 U' L2 B L F' B2 D' U F' R B F' U F B2 U' L' U' D' L2 R",
    "R B' F' U2 L D F U L B D2 L B U L' F2 D' L2 D B' R' F' R2 L' D2",
    "R' U' L' R D B U' B2 F D F2 B' D' L F2 L U' R2 B2 U L2 F2 L2 R U'",
    "R' L U F D2 L R F2 L U R B L' F2 L2 B' D' B' U' B' L' D2 F R L'",
    "U2 R2 D' B' F' L' B' D' B2 F D R' U R D2 L2 F2 D L D' F2 L B F U"
  ];
  
  var heuristic = new rubik.P1Heuristic();
  heuristic.generate();
  
  var start = new Date().getTime();
  for (var i = 0; i < scrambles.length; ++i) {
    // Generate a cube.
    var moves = rubik.parseMoves(scrambles[i]);
    var cube = new rubik.CubieCube();
    for (var j = 0; j < moves.length; ++j) {
      cube.move(moves[j]);
    }
    
    // Solve phase 1.
    rubik.solvePhase1(cube, heuristic, function(moves) {
      return false;
    });
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration/scrambles.length + ' ms/solvePhase1');
}

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
benchmarkPhase1();
console.log('PASS');
