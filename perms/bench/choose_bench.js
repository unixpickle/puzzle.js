var perms = require('../../build/perms.js');
var bench = require('../../bench.js');

function benchmarkEncodeChoose() {
  var cases = [];
  for (var i = 0; i < 12; ++i) {
    for (var j = i+1; j < 12; ++j) {
      for (var k = j+1; k < 12; ++k) {
        for (var l = k+1; l < 12; ++l) {
          var perm = [false, false, false, false, false, false, false, false,
            false, false, false, false];
          perm[i] = true;
          perm[j] = true;
          perm[k] = true;
          perm[l] = true;
          cases.push(perm);
        }
      }
    }
  }
  
  bench('encodeChoose', cases.length, function(count) {
    var len = cases.length;
    var count = Math.round(count / len);
    while (count--) {
      for (var i = 0; i < len; ++i) {
        perms.encodeChoose(cases[i]);
      }
    }
  });
}

benchmarkEncodeChoose();
