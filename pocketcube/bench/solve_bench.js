var pocketcube = require('../../build/pocketcube.js');
var bench = require('../../bench.js');

function benchmarkSolve() {
  var cube = new pocketcube.Cube();
  var heuristic = new pocketcube.FullHeuristic(5);

  bench('solve', function(count) {
    while (count--) {
      var cube = pocketcube.randomState();
      pocketcube.solve(cube, heuristic);
    }
  });
}

benchmarkSolve();
