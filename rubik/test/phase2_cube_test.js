var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testPhase2Moves() {
  // Do the algorithm "R2 U F2 D2 L2 D' B2 R2 L2 D2 U' F2 D R2 U R2 D2"
	var moves = [2, 4, 0, 9, 3, 8, 1, 2, 3, 9, 5, 0, 7, 2, 4, 2, 9];
  var table = new rubik.Phase2Moves();
  var state = new rubik.Phase2Cube();
  for (var i = 0; i < moves.length; ++i) {
    state.move(moves[i], table);
  }
  assert.equal(state.cornerPerm, 29024);
  assert.equal(state.edgePerm, 14092);
  assert.equal(state.slicePerm, 2);
}

testPhase2Moves();
console.log('PASS');