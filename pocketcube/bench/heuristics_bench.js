var pocketcube = require('../../build/pocketcube.js');
var bench = require('../../bench.js');

function benchmarkFullHeuristic() {
  bench('FullHeuristic(5)', function(n) {
    while (n--) {
      new pocketcube.FullHeuristic(5);
    }
  });
}

benchmarkFullHeuristic();