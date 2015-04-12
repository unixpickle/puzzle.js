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

function benchmarkPhase2LowerBound() {
  var moves = new rubik.Phase2Moves();
  var heuristic = new rubik.Phase2Heuristic(moves);
  
  // Generate a semi-scrambled cube to test with.
  var cube = new rubik.Phase2Cube();
  for (var i = 0; i < 10; ++i) {
    cube.move(i, moves);
  }
  
  bench('lowerBound', function(count) {
    while (count--) {
      heuristic.lowerBound(cube);
    }
  });
}

benchmarkPhase2Heuristic();
benchmarkPhase2LowerBound();