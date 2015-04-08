var rubik = require('../../build/rubik.js');

function benchmarkSolver() {
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  var count = 10;
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    var scramble = rubik.scrambleMoves(25);
    var cube = new rubik.Phase1Cube();
    for (var j = 0; j < 25; ++j) {
      cube.move(scramble[j], moves);
    }
    rubik.solvePhase1(cube, heuristic, moves, function(solution) {
      return false;
    }, 10000);
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + Math.ceil(duration/count) + ' ms/solvePhase1');
}

benchmarkSolver();
