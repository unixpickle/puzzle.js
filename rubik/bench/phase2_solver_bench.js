var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkSolvePhase2() {
  // These pre-defined scrambles are random. I pre-defined them so that I could
  // easily track performance improvements.
  var scrambles = [
    [7, 3, 4, 0, 3, 3, 4, 8, 2, 9, 2, 8, 9, 4, 5, 9, 8, 1, 5, 8, 3, 2, 9, 5, 7],
    [9, 6, 5, 7, 6, 5, 1, 6, 6, 6, 5, 7, 8, 2, 8, 5, 0, 6, 9, 4, 3, 5, 3, 3, 6],
    [8, 7, 5, 1, 2, 8, 2, 3, 3, 9, 7, 5, 0, 0, 0, 4, 1, 9, 1, 9, 2, 8, 5, 0, 5],
    [3, 5, 7, 9, 9, 5, 4, 8, 7, 4, 5, 3, 2, 5, 8, 7, 1, 2, 4, 2, 6, 3, 1, 7, 7],
    [7, 6, 3, 0, 7, 3, 5, 1, 7, 4, 3, 5, 4, 6, 6, 6, 8, 5, 2, 0, 5, 5, 9, 5, 8],
    [9, 2, 3, 0, 6, 1, 9, 3, 6, 8, 0, 2, 3, 0, 1, 7, 4, 9, 4, 6, 0, 4, 9, 0, 0],
    [2, 8, 5, 6, 4, 2, 7, 8, 1, 8, 6, 6, 2, 2, 2, 6, 8, 6, 0, 7, 4, 6, 3, 3, 8],
    [7, 0, 6, 1, 1, 9, 8, 8, 0, 2, 1, 2, 2, 8, 4, 1, 3, 6, 7, 9, 4, 3, 0, 8, 4],
    [5, 4, 3, 1, 6, 6, 5, 6, 2, 8, 8, 2, 3, 4, 0, 3, 8, 5, 1, 4, 8, 9, 8, 9, 7],
    [1, 3, 2, 5, 3, 8, 1, 3, 1, 4, 7, 7, 8, 8, 0, 9, 2, 4, 5, 1, 3, 3, 8, 6, 9],
    [5, 9, 7, 8, 4, 6, 1, 1, 7, 2, 1, 3, 3, 6, 5, 1, 1, 8, 0, 4, 6, 6, 8, 1, 5],
    [3, 2, 6, 4, 1, 2, 4, 3, 7, 6, 4, 0, 8, 0, 0, 0, 4, 5, 7, 3, 3, 6, 8, 2, 3],
    [7, 2, 0, 9, 4, 1, 5, 9, 6, 2, 2, 5, 5, 7, 0, 4, 6, 0, 2, 6, 6, 4, 9, 9, 9],
    [6, 6, 2, 7, 8, 2, 5, 6, 8, 7, 4, 9, 2, 8, 1, 1, 1, 0, 7, 1, 7, 4, 8, 4, 4],
    [0, 2, 0, 0, 7, 8, 5, 0, 3, 6, 9, 0, 3, 7, 8, 7, 8, 9, 8, 8, 6, 4, 6, 3, 4]
  ];
  
  var coords = new rubik.Phase2Coords();
  var heuristic = new rubik.Phase2Heuristic(coords);
  bench('solvePhase2', scrambles.length, function(count) {
    for (var i = 0; i < count; ++i) {
      var scramble = scrambles[i % scrambles.length];
      var cube = new rubik.Phase2Cube();
      for (var j = 0; j < scramble.length; ++j) {
        cube.move(scramble[j], coords);
      }
      rubik.solvePhase2(cube, 18, heuristic, coords);
    }
  });
}

benchmarkSolvePhase2();
