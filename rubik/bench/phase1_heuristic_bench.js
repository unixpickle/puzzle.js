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

function benchmarkLowerBound() {
  var count = 10000000;
  var moves = new rubik.Phase1Moves();
  var heuristic = new rubik.Phase1Heuristic(moves);
  
  // Generate a semi-scrambled cube to test with.
  var cube = new rubik.Phase1Cube();
  for (var i = 0; i < 6; ++i) {
    cube.move(new rubik.Move(i), moves);
  }
  
  var start = new Date().getTime();
  for (var i = 0; i < count; ++i) {
    heuristic.lowerBound(cube);
  }
  var duration = new Date().getTime() - start;
  
  console.log('Benchmark: ' + Math.ceil(1000000*duration/count) +
    ' ns/lowerBound');
}

benchmarkHeuristic();
benchmarkLowerBound();
