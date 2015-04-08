var rubik = require('../../build/rubik.js');

function benchmarkHeuristic() {
  var count = 2;
  var moves = new rubik.Phase1Moves();
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    new rubik.Phase1Heuristic(moves);
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + Math.ceil(duration/count) + ' ms/Phase1Heuristic');
}

benchmarkHeuristic();
