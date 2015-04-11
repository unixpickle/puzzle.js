var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testNoCrash() {
  for (var i = 0; i < 100; ++i) {
    assert.doesNotThrow(rubik.randomState);
  }
}

testNoCrash();
console.log('PASS');