var pyraminx = require('../../build/pyraminx.js');
var bench = require('../../bench.js');

function benchmarkSolve() {
  var scrambles = [
    pyraminx.parseMoves("U L B' R' L' B L U"),
    pyraminx.parseMoves("U' R L' U L' U' L"),
    pyraminx.parseMoves("U R' B' U' R' U R U"),
    pyraminx.parseMoves("R U L B L' U B R"),
    pyraminx.parseMoves("L B R' B L R' L B R'"),
    pyraminx.parseMoves("U R U L' U B U"),
    pyraminx.parseMoves("U' R' U' L' B U R'"),
    pyraminx.parseMoves("L R' U R' B' R' L' U'"),
    pyraminx.parseMoves("L U L' U R B' L U' R'"),
    pyraminx.parseMoves("L' R' L' U' R L' R"),
    pyraminx.parseMoves("R B R L B' L R U"),
    pyraminx.parseMoves("B L B R' B U L'"),
    pyraminx.parseMoves("B' U B R L' U' L'"),
    pyraminx.parseMoves("L' R U' B' R' B' U"),
    pyraminx.parseMoves("L B R L' R U' B L"),
    pyraminx.parseMoves("U' L' B' U' B U' R' B'"),
    pyraminx.parseMoves("R' U' L U' L' R' U' L'"),
    pyraminx.parseMoves("L B L' B L U' L R"),
    pyraminx.parseMoves("R' B L R' B U R U"),
    pyraminx.parseMoves("R L R U L' U' B U'")
  ];
  var heuristic = new pyraminx.EdgesHeuristic(7);
  bench('solve', scrambles.length, function(count) {
    for (var i = 0, outerLen = count/scrambles.length; i < outerLen; ++i) {
      for (var j = 0, len = scrambles.length; j < len; ++j) {
        var scramble = scrambles[j];
        var s = new pyraminx.Pyraminx();
        for (var m = 0, len1 = scramble.length; m < len1; ++m) {
          s.move(scramble[m]);
        }
        pyraminx.solve(s, heuristic);
      }
    }
  });
}

benchmarkSolve();
