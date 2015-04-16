var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkSolver() {
  var scrambles = [
    "D2 L' F2 R2 U2 L U2 L' F2 L' F' R U' F2 R2 B D R D' U F'",
    "U2 F' L2 F L2 R2 B' D2 F' R2 F R B U' B' F2 R2 U' L2 R D2",
    "L2 F2 U2 B2 F2 D L2 D B2 U L2 B R U' L F D' R' B R2 F2",
    "L2 B F U2 L2 U2 L2 F L2 F' U2 L U F2 R D' B R' F2 D2 R",
    "B2 R2 D' R2 D2 F2 R2 F2 R2 U' L2 F R' F2 D L' U L' R' B' U'",
    "F U F R F L2 D F L2 D' R2 U' B2 D' F2 R2 F2 B2 U2",
    "B2 D R2 U' L2 F2 U2 L2 F2 D F2 R F2 U B' F2 D' F' D R2 F",
    "R2 U2 F L2 F2 D2 R2 B' L2 D' F2 R D B F' D U B F2 R'",
    "R' B' D' R' L U' R' F' D' B R' U2 L D2 L2 B2 L B2 U2 L F2",
    "F2 L' B2 F2 U2 R D2 R U2 R' B' L2 D B' R' B2 F' R2 D2",
    "D' F2 L2 D2 B2 F2 D' L2 R2 D' U' R U' R' U' L' R D' L2 B' L2",
    "U' L' F' R F2 B' U' F' L D R2 L2 F2 R2 F L2 F2 L2 U2 B",
    "R2 B2 R2 B' U2 L2 F' L2 B D2 L2 D B2 L' R U2 B' R' U' L' F'",
    "L2 D2 L2 B2 U2 R' D2 L F2 D2 F2 U B' U2 R' B' D2 U' F' L2 R2",
    "R2 U2 B2 U2 F' D2 B' L2 F D2 U B R2 U' F D R' F' D' F2",
    "U2 F' U2 B' D2 R2 F' L2 F2 D2 L2 R' B R' D B D R2 B' D'",
    "D2 F2 U B2 U R2 D L2 D' R2 U R' D' L' D' F2 D2 F U2 L U'",
    "U' B L' B R F2 D' B D F R2 D' L2 B2 D' L2 D2 B2 D B2 U",
    "L2 F2 D' R2 B2 U' F2 D R2 U B2 R F' L' F2 D' B U L R2 D",
    "L2 R2 B2 U2 L2 F R2 B F2 D2 R' D R2 F L D U L2 B' D' F'",
    "D' R2 U2 F2 L2 U' L2 U' L2 R2 U2 R' F2 D' F2 R B L2 F' U"
  ];
  
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  
  var len = scrambles.length;
  bench('solvePhase1', len, function(count) {
    for (var i = 0; i < count; ++i) {
      var scramble = rubik.parseMoves(scrambles[i % len]);
      var cube = new rubik.Phase1Cube();
      for (var j = 0; j < scramble.length; ++j) {
        cube.move(scramble[j], moves);
      }
      rubik.solvePhase1(cube, heuristic, moves, function(solution) {
        return false;
      }, 1000000);
    }
  });
}

benchmarkSolver();
