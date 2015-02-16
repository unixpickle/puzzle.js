var rubik = require('../build/rubik.js');

function benchmarkCOHeuristic() {
  var start = new Date().getTime();
  for (var i = 0; i < 10; ++i) {
    new rubik.COHeuristic().generate();
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + duration/10 + ' ms/COHeuristic.');
}

// Run tests.
benchmarkCOHeuristic();
console.log('PASS');
