var pocketcube = require('../../build/pocketcube.js');
var assert = require('assert');

function benchmarkFullHeuristic() {  
  var start = (new Date()).getTime();
  new pocketcube.FullHeuristic(5);
  var duration = (new Date()).getTime() - start;
  
  console.log('Benchmark: ' + Math.ceil(duration) + ' ms/FullHeuristic(5).');
}

benchmarkFullHeuristic();
