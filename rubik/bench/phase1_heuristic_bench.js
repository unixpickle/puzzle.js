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

function benchmarkLowerBound() {
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  
  // Generate a semi-scrambled cube to test with.
  var cube = new rubik.Phase1Cube();
  for (var i = 0; i < 6; ++i) {
    cube.move(new rubik.Move(i), moves);
  }
  
  bench('lowerBound', function(count) {
    while (count--) {
      heuristic.lowerBound(cube);
    }
  });
}

benchmarkHeuristic();
benchmarkLowerBound();
