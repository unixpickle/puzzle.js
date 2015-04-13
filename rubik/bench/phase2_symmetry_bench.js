var rubik = require('../../build/rubik.js');
var bench = require('../../bench.js');

function benchmarkPhase2EdgeSym() {
  bench('Phase2EdgeSym', function(n) {
    while (n--) {
      new rubik.Phase2EdgeSym();
    }
  });
}

benchmarkPhase2EdgeSym();