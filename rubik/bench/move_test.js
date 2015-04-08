var rubik = require('../../build/rubik.js');

function benchmarkScramble() {
  var start = (new Date()).getTime();
  for (var i = 0; i < 100000; ++i) {
    rubik.scrambleMoves(25);
  }
  var duration = (new Date()).getTime() - start;
  console.log('Benchmark: ' + duration*10 + ' ns/scramble.');
}

benchmarkScramble();
