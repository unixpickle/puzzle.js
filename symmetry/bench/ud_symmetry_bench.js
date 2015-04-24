var symmetry = require('../../build/symmetry.js');
var bench = require('../../bench.js');

function benchmarkInverse() {
  bench('inverse', function(n) {
    for (var i = 0; i < n; ++i) {
      symmetry.udSymmetryInverse(i & 0xf);
    }
  });
}

function benchmarkProduct() {
  bench('product', 0x10, function(n) {
    for (var i = 0, len = n >>> 4; i < len; ++i) {
      for (var j = 0; j < 0x10; ++j) {
        symmetry.udSymmetryProduct(i & 0xf, j);
      }
    }
  });
}

benchmarkInverse();
benchmarkProduct();
