var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkHeuristic() {
  var moves = new rubik.Phase1Moves();  
  bench('Phase1Heuristic', function(count) {
    while (count--) {
      new rubik.Phase1Heuristic(moves);
    }
  });
}

function benchmarkShouldPrune() {
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  
  // Generate a semi-scrambled cube to test with.
  var cube = new rubik.Phase1AxisCubes();
  for (var i = 0; i < 6; ++i) {
    cube.move(new rubik.Move(i), moves);
  }
  
  bench('shouldPrune', function(count) {
    while (count--) {
      heuristic.shouldPrune(cube, 13);
    }
  });
}

benchmarkHeuristic();
benchmarkShouldPrune();
