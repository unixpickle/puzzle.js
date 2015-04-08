var assert = require('assert');
var skewb = require('../../build/skewb.js');

function benchmarkHeuristic() {
  var count = 10;
  
  var start = (new Date()).getTime();
  for (var i = 0; i < count; ++i) {
    new skewb.Heuristic();
  }
  var duration = (new Date()).getTime() - start;
  
  console.log('Benchmark: ' + Math.floor(duration/count) + ' ms/heuristic');
}

function benchmarkMove() {
  var algo = "U' R U' B' R L U' L B L U B' R' U L R' B' U' R U' B R' L' B' L'";
  var moves = skewb.parseMoves(algo);
  var state = new skewb.Skewb();
  
  var start = (new Date()).getTime();
  for (var i = 0; i < 10000000; ++i) {
    state.move(moves[i % 25]);
  }
  var duration = (new Date()).getTime() - start;
  console.log('Benchmark: ' + Math.floor(duration/10) + ' ns/move');
}

function benchmarkSolve() {
  var count = 10;
  var heuristic = new skewb.Heuristic();
  
  var start = (new Date()).getTime();
  for (var i = 0; i < count; ++i) {
    skewb.solve(skewb.randomState(), heuristic);
  }
  var duration = (new Date()).getTime() - start;
  
  console.log('Benchmark: ' + Math.floor(duration/count) + ' ms/solve');
}

benchmarkHeuristic();
benchmarkMove();
benchmarkSolve();
