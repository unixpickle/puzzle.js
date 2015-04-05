var pocketcube = require('../../build/pocketcube.js');
var assert = require('assert');

function benchmarkFullHeuristic() {  
  var start = (new Date()).getTime();
  new pocketcube.FullHeuristic(5);
  var duration = (new Date()).getTime() - start;
  
  console.log('Benchmark: ' + Math.ceil(duration) + ' ms/FullHeuristic(5).');
}

function testFullHeuristic() {
  var heuristic = new pocketcube.FullHeuristic(5);
  // Make sure scrambles of a bunch of lengths work.
  for (var len = 0; len < 12; ++len) {
    for (var i = 0; i < 10; ++i) {
      var scramble = pocketcube.scrambleMoves(len);
      var cube = new pocketcube.Cube();
      for (var j = 0; j < scramble.length; ++j) {
        cube.move(scramble[j]);
      }
      assert(heuristic.lookup(cube) <= scramble.length,
        "Heuristic overshot for: " + pocketcube.movesToString(scramble));
    }
  }
}

testFullHeuristic();
benchmarkFullHeuristic();
console.log('PASS');
