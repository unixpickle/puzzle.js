var pocketcube = require('../../build/pocketcube.js');
var assert = require('assert');

function benchmarkFullHeuristic() {
  var basis = pocketcube.basisMoves();
  var cube = new pocketcube.Cube();
  
  var start = (new Date()).getTime();
  new pocketcube.FullHeuristic(5).generate(basis);
  var duration = (new Date()).getTime() - start;
  
  console.log('Benchmark: ' + Math.ceil(duration) + ' ms/FullHeuristic(5).');
}

benchmarkFullHeuristic();
console.log('PASS');
