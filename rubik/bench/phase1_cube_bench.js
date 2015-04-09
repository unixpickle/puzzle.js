var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkPhase1Conversion() {
  // Generate a cube from a scramble.
  var scramble = rubik.parseMoves("L R2 B2 F2 L2 U' B2 F U R2 F' L2 R' B' F2 " +
    "D2 R U' L' R U2 F2 D U' R2 U B2 F D U");
  var cube = new rubik.CubieCube();
  for (var i = 0; i < scramble.length; ++i) {
    cube.move(scramble[i]);
  }
  
  bench('conversion', function(count) {
    for (var i = 0; i < count; ++i) {
      new rubik.Phase1Cube(cube);
    }
  });
}

function benchmarkPhase1CubeMove() {
  var moves = new rubik.Phase1Moves();
  var cube = new rubik.Phase1Cube();
  var movesToUse = rubik.allMoves();
  
  bench('move', function(count) {
    for (var i = 0; i < count; ++i) {
      cube.move(movesToUse[i % 18], moves);
    }
  });
}

function benchmarkPhase1Moves() {
  bench('Phase1Moves', function(count) {
    for (var i = 0; i < count; ++i) {
      new rubik.Phase1Moves();
    }
  });
}

function benchmarkPhase1XEO() {
  // Generate a semi-scrambled cube to test with. The cube itself doesn't matter
  // too much, I just don't want it to be solved.
  var cubieCube = new rubik.CubieCube();
  for (var i = 0; i < 6; ++i) {
    cubieCube.move(new rubik.Move(i));
  }
  var cube = new rubik.Phase1Cube(cubieCube);
  
  bench('xEO', function(count) {
    for (var i = 0; i < count; ++i) {
      cube.xEO();
    }
  });
}

benchmarkPhase1Conversion();
benchmarkPhase1CubeMove();
benchmarkPhase1Moves();
benchmarkPhase1XEO();
