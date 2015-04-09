var rubik = require('../../build/rubik.js');
var assert = require('assert');

function constructPhase2Cube(c, e, s) {
  var res = new rubik.Phase2Cube();
  res.cornerPerm = c;
  res.edgePerm = e;
  res.slicePerm = s;
  return res;
}

function testPhase2Conversion() {
  // I did the same scramble, translated for all three directions.
  var scrambles = [
    "R2 U F2 D2 L2 D' B2 R2 L2 D2 U' F2 D R2 U R2 D2",
		"U2 L F2 R2 D2 R' B2 U2 D2 R2 L' F2 R U2 L U2 R2",
		"R2 F D2 B2 L2 B' U2 R2 L2 B2 F' D2 B R2 F R2 B2"
  ];
  var axes = [1, 0, 2];
  var states = [
    constructPhase2Cube(29024, 14092, 2),
    constructPhase2Cube(29024, 14092, 2),
    constructPhase2Cube(29024, 14092, 2)
  ];
  
  for (var i = 0; i < scrambles.length; ++i) {
    // Generate the CubieCube.
    var scramble = rubik.parseMoves(scrambles[i]);
    var cube = new rubik.CubieCube();
    for (var j = 0; j < scramble.length; ++j) {
      cube.move(scramble[j]);
    }
    // Generate the Phase2Cube and make sure it's right.
    var p2Cube = rubik.convertCubieToPhase2(cube, axes[i]);
    assert.deepEqual(p2Cube, states[i]);
  }
}

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

testPhase2Conversion();
testPhase2Moves();
console.log('PASS');