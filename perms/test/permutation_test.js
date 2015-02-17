var assert = require('assert');
var perms = require('../../build/perms.js');

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

function testFactorial() {
  var product = 1;
  for (var i = 0; i < 15; ++i) {
    if (i > 1) {
      product *= i;
    }
    assert.equal(perms.factorial(i), product);
  }
}

function testParity() {
  // Basic tests
  assert.equal(perms.parity([]), true);
  assert.equal(perms.parity([0]), true);
  assert.equal(perms.parity([0, 1]), true);
  assert.equal(perms.parity([1, 0]), false);
  assert.equal(perms.parity([0, 1, 2]), true);
  assert.equal(perms.parity([2, 0, 1]), true);
  assert.equal(perms.parity([1, 0, 2]), false);
  assert.equal(perms.parity([0, 1, 2, 3]), true);
  assert.equal(perms.parity([2, 0, 1, 3]), true);
  assert.equal(perms.parity([1, 0, 2, 3]), false);
  
  // Rigorous tests
  for (var swaps = 0; swaps < 20; ++swaps) {
    var list = [0, 1, 2, 3, 4, 5, 6, 7];
    
    // Perform the given number of swaps.
    for (var i = 0; i < swaps; ++i) {
      var firstIdx = Math.floor(Math.random() * list.length);
      var secondIdx = Math.floor(Math.random() * (list.length-1));
      if (secondIdx >= firstIdx) {
        ++secondIdx;
      }
      var first = list[firstIdx];
      list[firstIdx] = list[secondIdx];
      list[secondIdx] = first;
    }
    
    assert.equal(perms.parity(list), (swaps%2) == 0);
  }
}

function testRandomPermParity() {
  for (var len = 2; len < 20; ++len) {
    for (var i = 0; i < 10; ++i) {
      for (var p = 0; p < 2; ++p) {
        var check = perms.randomPermParity(len, p == 0);
        assert.equal(perms.parity(check), p == 0);
      }
    }
  }
}

benchmarkParity();
testFactorial();
testParity();
testRandomPermParity();
console.log('PASS');
