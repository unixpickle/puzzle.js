var assert = require('assert');
var perms = require('../build/perms.js');

function factorial(x) {
  if (x <= 1) {
    return 1;
  }
  return x * factorial(x-1);
}

function manualChoose(a, b) {
  var res = 1;
  for (var i = 0; i < b; ++i) {
    res *= a--;
  }
  return res / factorial(b);
}

function testChoose() {
  for (var n = 0; n < 15; ++n) {
    for (var x = 0; x < n; ++x) {
      assert.equal(manualChoose(n, x), perms.choose(n, x));
    }
  }
}

function testEncodeChoose() {
  var answer = 0;
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
          
          assert.equal(answer, perms.encodeChoose(perm));
          answer++;
          
        }
      }
    }
  }
}

testChoose();
testEncodeChoose();
console.log('PASS');
