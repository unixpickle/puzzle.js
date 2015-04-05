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

function testMove() {
  // Apply some random algorithm to the Skewb.
  var algo = "U' R U' B' R L U' L B L U B' R' U L R' B' U' R U' B R' L' B' L'";
  var moves = skewb.parseMoves(algo);
  var state = new skewb.Skewb();
  for (var i = 0, len = moves.length; i < len; ++i) {
    state.move(moves[i]);
  }
  
  // Verify corner permutation.
  var corners = [6, 4, 1, 3, 2, 0, 5, 7];
  for (var i = 0; i < 8; ++i) {
    assert.equal(corners[i], state.corners[i].piece,
      'Bad corner piece at ' + i);
  }
  
  // Verify corner orientations.
  var orientations = [1, 2, 0, 1, 2, 1, 2, 1];
  for (var i = 0; i < 8; ++i) {
    assert.equal(corners[i], state.corners[i].piece,
      'Bad corner orientation at ' + i);
  }
  
  // Verify center permutations.
  var centers = [5, 4, 1, 0, 2, 3];
  for (var i = 0; i < 6; ++i) {
    assert.equal(centers[i], state.centers[i], 'Bad center at ' + i);
  }
}

function testSolve() {
  var heuristic = new skewb.Heuristic();
  for (var i = 0; i < 10; ++i) {
    var state = skewb.randomState();
    var solution = skewb.solve(state, heuristic);
    for (var i = 0; i < solution.length; ++i) {
      state.move(solution[i]);
    }
    assert(state.solved(), "Solution failed: " + skewb.movesToString(solution));
  }
}

testMove();
testSolve();
benchmarkHeuristic();
benchmarkMove();
benchmarkSolve();
console.log('PASS');
