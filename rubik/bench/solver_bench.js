var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkSolveTables() {
  bench('SolveTables', function(c) {
    while (c--) {
      new rubik.SolveTables();
    }
  });
}

function benchmarkSolveCube() {
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
    "R2 U2 B2 U2 F' D2 B' L2 F D2 U B R2 U' F D R' F' D' F2"
  ];
  var tables = new rubik.SolveTables();
  var timeouts = new rubik.SolveTimeouts();
  bench('solveCube', scrambles.length, function(count) {
    for (var c = 0; c < count; ++c) {
      var i = c % scrambles.length;
      var cube = new rubik.CubieCube();
      var scramble = rubik.parseMoves(scrambles[i]);
      for (var j = 0; j < scramble.length; ++j) {
        cube.move(scramble[j]);
      }
      rubik.solveCube(cube, tables, timeouts);
    }
  });
}

benchmarkSolveTables();
benchmarkSolveCube();
console.log('PASS');
