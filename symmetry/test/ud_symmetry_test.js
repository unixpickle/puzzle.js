var symmetry = require('../../build/symmetry.js');
var assert = require('assert');

function testInverse() {
  // Check that all the inverses are correct.
  var inverses = [0, 3, 2, 1, 4, 5, 6, 7, 8, 11, 10, 9, 12, 13, 14, 15];
  for (var i = 0; i < 16; ++i) {
    assert.equal(symmetry.udSymmetryInverse(i), inverses[i]);
  }
}

function testProduct() {
  // Apply all the symmetries sequentially in a pre-randomized order, making
  // sure every intermediate state is correct.
  var operations = [1, 2, 14, 0, 5, 12, 10, 8, 9, 13, 11, 6, 7, 4, 3, 15];
  var states = [1, 3, 13, 13, 8, 4, 14, 6, 13, 0, 11, 13, 10, 14, 15, 0];
  var state = 0;
  for (var i = 0; i < 16; ++i) {
    state = symmetry.udSymmetryProduct(operations[i], state);
    assert.equal(state, states[i], "invalid state at index " + i);
  }
}

testInverse();
testProduct();
console.log('PASS');
