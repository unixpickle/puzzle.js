var pocketcube = require('../../build/pocketcube.js');
var assert = require('assert');

function benchmarkMove() {
  // Setup the cube.
  var moves = pocketcube.parseMoves("B U D B' L2 D' R' F2 L F D2 R2 F' U2 R " +
    "B2 L' U'");
  var cube = new pocketcube.Cube();
  
  var start = (new Date()).getTime();
  for (var i = 0; i < 20000000; ++i) {
    cube.move(moves[i % moves.length]);
  }
  var duration = (new Date()).getTime() - start;
  console.log('Benchmark: ' + Math.ceil(duration/20) + ' ns/move.');
}

benchmarkMove();

