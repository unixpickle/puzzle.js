var perms = require('../../build/perms.js');
var bench = require('../../bench.js');

function benchmarkEncodePerm() {
  var testSet = perms.allPerms(8);
  var len = testSet.length;
  bench('encodePerm', len, function(count) {
    for (var i = 0; i < count; ++i) {
      perms.encodePerm(testSet[i % len]);
    }
  });
}

function benchmarkParity() {
  var list = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
  bench('parity [worst]', function(count) {
    while (count--) {
      perms.parity(list);
    }
  });
  
  list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  bench('parity [best]', function(count) {
    while (count--) {
      perms.parity(list);
    }
  });
}

benchmarkEncodePerm();
benchmarkParity();
