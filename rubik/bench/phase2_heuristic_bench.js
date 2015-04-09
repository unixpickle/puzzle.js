var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkPhase2Heuristic() {
  var moves = new rubik.Phase2Moves();
  bench('Phase2Heuristic', function(count) {
    while (count--) {
      new rubik.Phase2Heuristic(moves);
    }
  });
}

benchmarkPhase2Heuristic();
