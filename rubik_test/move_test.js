var move = require('../rubik/move.js');

function benchmarkScramble() {
  var start = (new Date()).getTime();
  for (var i = 0; i < 100000; ++i) {
    move.scrambleMoves(25);
  }
  var duration = (new Date()).getTime() - start;
  console.log('Benchmark: ' + duration*10 + ' ns/scramble.');
}

// Run tests.
benchmarkScramble();
console.log('PASS');
