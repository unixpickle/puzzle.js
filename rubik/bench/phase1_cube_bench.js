var rubik = require('../../build/rubik.js');
var assert = require('assert');

function benchmarkPhase1Conversion() {
  // Generate a cube from a scramble.
  var scramble = rubik.parseMoves("L R2 B2 F2 L2 U' B2 F U R2 F' L2 R' B' F2 " +
    "D2 R U' L' R U2 F2 D U' R2 U B2 F D U");
  var cube = new rubik.CubieCube();
  for (var i = 0; i < scramble.length; ++i) {
    cube.move(scramble[i]);
  }
  
  // Run a bunch of conversions.
  var count = 300000;
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    new rubik.Phase1Cube(cube);
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + Math.ceil(1000000*duration/count) +
    ' ns/conversion');
}

function benchmarkPhase1CubeMove() {
  var moves = new rubik.Phase1Moves();
  var cube = new rubik.Phase1Cube();
  var movesToUse = rubik.allMoves();
  var count = 10000000;
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    cube.move(movesToUse[i % 18], moves);
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + Math.ceil(1000000*duration/count) +
    ' ns/move');
}

function benchmarkPhase1Moves() {
  var count = 30;
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    new rubik.Phase1Moves();
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + Math.ceil(duration/count) + ' ms/Phase1Moves');
}

function benchmarkPhase1XEO() {
  var count = 10000000;
  
  // Generate a semi-scrambled cube to test with. The cube itself doesn't matter
  // too much, I just don't want it to be solved.
  var cubieCube = new rubik.CubieCube();
  for (var i = 0; i < 6; ++i) {
    cubieCube.move(new rubik.Move(i));
  }
  var cube = new rubik.Phase1Cube(cubieCube);
  
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    cube.xEO();
  }
  var duration = new Date().getTime() - start;
  
  console.log('Benchmark: ' + Math.ceil(1000000*duration/count) + ' ns/xEO');
}

benchmarkPhase1Conversion();
benchmarkPhase1CubeMove();
benchmarkPhase1Moves();
benchmarkPhase1XEO();
