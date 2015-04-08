var pocketcube = require('../../build/pocketcube.js');
var assert = require('assert');

function benchmarkSolve() {
  var cube = new pocketcube.Cube();
  var heuristic = new pocketcube.FullHeuristic(5);
  
  var count = 50;
  
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    var cube = pocketcube.randomState();
    pocketcube.solve(cube, heuristic);
  }
  var duration = new Date().getTime() - start;
  
  console.log('Benchmark: ' + Math.ceil(duration/count) +
    ' ms/solve.');
}

benchmarkSolve();
