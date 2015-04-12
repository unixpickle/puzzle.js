var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testSolve() {
  var scrambles = [
    "L F L2 B2 U' L D2 B' L' U2 F2 D F B D2 R2 L U' B F D2 U B2 F D'",
    "F' L2 F' L' F' L' U' B' F2 D L2 B' U D L' D F L2 R' U R' F B U F2",
    "B L B' L D2 B R' F2 L2 D B U' B' D2 R' F B2 L2 D F D' L' D2 F R",
    "F2 R2 U' R U' L' D' F2 B U' F R2 B' R' D2 F' B U' R' D2 L2 F' D2 B2 R2",
    "U R2 U F2 U' L2 B D' F R2 B2 D' B' L2 B U R2 L U' R' D2 R' U' F L2",
    "B2 L2 D2 L2 F' L2 F' D B' L' D L U' D2 R' U2 R' U' D' R' F' R U F2 L2",
    "R2 D U2 B2 F' L2 D' L R B2 D' F R' U D' F2 L' U B2 R2 F R F L U'",
    "F L R B F' D' R U D' F R2 B2 L U B U' B U' B2 R L' B2 U R' F",
    "L2 D F U F' L D' U2 F U D B2 R' D R' D R B2 F' L' U' L R2 F B'",
    "U2 F2 R U2 R2 D' F' D B' F R2 L' B2 F R2 D2 F2 B' L2 D F2 L D' R2 D",
    "D' L2 U R2 B' L B2 D L U2 L U2 R' B U2 B' F R F2 D' B' F' L2 D2 R2",
    "B U2 R B2 R R2 U2 R2 B2 U2 B L2 F D2 F' L2"
  ];
  var tables = new rubik.SolveTables();
  var timeouts = new rubik.SolveTimeouts();
  for (var i = 0; i < scrambles.length; ++i) {
    var cube = new rubik.CubieCube();
    var scramble = rubik.parseMoves(scrambles[i]);
    for (var j = 0; j < scramble.length; ++j) {
      cube.move(scramble[j]);
    }
    var solution = rubik.solveCube(cube, tables, timeouts);
    assert(solution !== null);
    for (var j = 0; j < solution.length; ++j) {
      cube.move(solution[j]);
    }
    assert(cube.solved(), "Solution " + solution + " did not solve " +
      scramble);
    // Make sure no faces are repeated.
    var lastFace = 0;
    for (var j = 0; j < solution.length; ++j) {
      var face = solution[j].face();
      assert(face !== lastFace, "Face repeated in solution " +
        solution.join(' '));
      lastFace = face;
    }
  }
}

testSolve();
console.log('PASS');
