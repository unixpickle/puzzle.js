var scrambler = require('../../build/scrambler.js');
var assert = require('assert');

function test2x2State() {
  for (var i = 0; i < 10; ++i) {
    var scramble = scrambler.generateScramble('2x2x2', 'State', -1);
    var l = scramble.split(' ').length;
    assert(l > 7 && l < 12, "Scramble was wrong length: " + scramble);
  }
}

test2x2State();
console.log('PASS');
