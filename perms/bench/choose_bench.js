var perms = require('../../build/perms.js');

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
  
  var start = new Date().getTime();
  for (var i = 0; i < 1000; ++i) {
    for (var j = 0, len = cases.length; j < len; ++j) {
      perms.encodeChoose(cases[j]);
    }
  }
  var duration = new Date().getTime() - start;
  
  console.log('Benchmark: ' + Math.round(duration*1000000/495000) +
    ' ns/encodeChoose');
}

benchmarkEncodeChoose();
