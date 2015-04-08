var perms = require('../../build/perms.js');

function benchmarkEncodePerm() {
  var testSet = perms.allPerms(8);
  var start = new Date().getTime();
  for (var i = 0, len = testSet.length; i < len; ++i) {
    perms.encodePerm(testSet[i]);
  }
  var duration = new Date().getTime() - start;
  console.log('Benchmark: ' + Math.round(duration*1000000/40320) +
    ' ns/encodePerm');
}

function benchmarkParity() {
  var list = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  var start = new Date().getTime();
  for (var i = 0; i < 1000000; ++i) {
    perms.parity(list);
  }
  var duration = new Date().getTime() - start;
  
  console.log('Benchmark: ' + duration + ' ns/parity [worst]');
  
  list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  start = new Date().getTime();
  for (var i = 0; i < 1000000; ++i) {
    perms.parity(list);
  }
  duration = new Date().getTime() - start;
  
  console.log('Benchmark: ' + duration + ' ns/parity [best]');
}

benchmarkEncodePerm();
benchmarkParity();
