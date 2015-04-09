var skewb = require('../../build/skewb.js');
var bench = require('../../bench.js');

function benchmarkHeuristic() {
  bench('heuristic', function(count) {
    while (count--) {
      new skewb.Heuristic();
    }
  });
}

function benchmarkMove() {
  var algo = "U' R U' B' R L U' L B L U B' R' U L R' B' U' R U' B R' L' B' L'";
  var moves = skewb.parseMoves(algo);
  var state = new skewb.Skewb();
  
  bench('move', 25, function(count) {
    for (var i = 0; i < count; ++i) {
      state.move(moves[i % 25]);
    }
  });
}

function benchmarkSolve() {
  var heuristic = new skewb.Heuristic();
  
  bench('solve', function(count) {
    while (count--) {
      skewb.solve(skewb.randomState(), heuristic);
    }
  });
}

benchmarkHeuristic();
benchmarkMove();
benchmarkSolve();
