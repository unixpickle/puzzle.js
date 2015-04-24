var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkConversion() {
  var coords = new rubik.Phase2Coords();
  var cubieCube = new rubik.CubieCube();

  var scramble = rubik.parseMoves("R2 U' D' L2 B2 D' R2 F2 U2 D' L2");
  var cubes = [];
  for (var i = 0; i < scramble.length; ++i) {
    cubieCube.move(scramble[i]);
    cubes[i] = cubieCube.copy();
  }

  bench('convertCubieToPhase2', cubes.length, function(count) {
    var len = cubes.length;
    for (var i = 0; i < count/len; ++i) {
      for (var j = 0; j < len; ++j) {
        rubik.convertCubieToPhase2(cubes[j], 1, coords);
      }
    }
  });
}

function benchmarkPhase2CubeMove() {
  var coords = new rubik.Phase2Coords();
  var cube = new rubik.Phase2Cube();
  bench('Phase2Cube.move', 10, function(count) {
    for (var i = 0; i < count; ++i) {
      cube.move(i % 10, coords);
    }
  });
}

function benchmarkPhase2Coords() {
  bench('Phase2Coords', function(count) {
    while (count--) {
      new rubik.Phase2Coords();
    }
  });
}

benchmarkConversion();
benchmarkPhase2CubeMove();
benchmarkPhase2Coords();
