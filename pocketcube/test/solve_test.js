var pocketcube = require('../../build/pocketcube.js');
var assert = require('assert');

function benchmarkSolve() {
  var basis = pocketcube.basisMoves();
  var cube = new pocketcube.Cube();
  var heuristic = new pocketcube.FullHeuristic(5);
  heuristic.generate(basis);
  
  var scrambles = [
    "R U R' F2 R' U F2 U'",
    "U2 F U F' R2 F U' F",
    "U2 F2 U' F' R U' F R' U'",
    "U' F R' U F2 R' F U' R' U'",
    "R F R2 U2 R' F2 U",
    "F R U' R' U' R U R' F' R U R' U' R' F R F'"
  ];
  
  var start = new Date().getTime();
  for (var i = 0, len = scrambles.length; i < len; ++i) {
    var moves = pocketcube.parseMoves(scrambles[i]);
    var cube = new pocketcube.Cube();
    for (var j = 0, l = moves.length; j < l; ++j) {
      cube.move(moves[j]);
    }
    var solution = pocketcube.solve(cube, heuristic, basis);
  }
  var duration = new Date().getTime() - start;
  
  console.log('Benchmark: ' + Math.ceil(duration/scrambles.length) +
    ' ms/solve.');
}

benchmarkSolve();
console.log('PASS');
