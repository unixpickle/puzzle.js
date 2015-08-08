var pyraminx = require('../../build/pyraminx.js');
var bench = require('../../bench.js');

function benchmarkEdgesHeuristic() {
  bench('EdgesHeuristic(7)', function(count) {
    while (count--) {
      new pyraminx.EdgesHeuristic(7);
    }
  });
}

benchmarkEdgesHeuristic();
