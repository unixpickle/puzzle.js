var rubik = require('../../build/rubik.js');
var perms = require('../../build/perms.js');
var assert = require('assert');

function assertRawCoordinates(p2Cube, corners, edges, slice, coords) {
  var cornerPerm = null;
  for (var i = 0; i < 40320; ++i) {
    if ((coords.corners.rawToSym(i) >>> 4) === (p2Cube.cornerCoord >>> 4)) {
      cornerPerm = perms.decodePerm(i, 8);
      break;
    }
  }
  cornerPerm = rubik.p2CornerSymmetryConj(p2Cube.cornerCoord & 0xf, cornerPerm);
  assert.equal(perms.encodePerm(cornerPerm), corners);

  var edgePerm = null;
  for (var i = 0; i < 40320; ++i) {
    if ((coords.edges.rawToSym(i) >>> 4) === (p2Cube.edgeCoord >>> 4)) {
      edgePerm = perms.decodePerm(i, 8);
      break;
    }
  }
  edgePerm = rubik.p2EdgeSymmetryConj(p2Cube.edgeCoord & 0xf, edgePerm);
  assert.equal(perms.encodePerm(edgePerm), edges);

  assert.equal(p2Cube.sliceCoord, slice);
}

function testPhase2Conversion() {
  var coords = new rubik.Phase2Coords();

  // I did the same scramble, translated for all three directions.
  var scrambles = [
    "R2 U F2 D2 L2 D' B2 R2 L2 D2 U' F2 D R2 U R2 D2",
		"U2 L F2 R2 D2 R' B2 U2 D2 R2 L' F2 R U2 L U2 R2",
		"R2 F D2 B2 L2 B' U2 R2 L2 B2 F' D2 B R2 F R2 B2"
  ];
  var axes = [1, 0, 2];
  
  for (var i = 0; i < scrambles.length; ++i) {
    // Generate the CubieCube.
    var scramble = rubik.parseMoves(scrambles[i]);
    var cube = new rubik.CubieCube();
    for (var j = 0; j < scramble.length; ++j) {
      cube.move(scramble[j]);
    }
    // Generate the Phase2Cube and make sure it's right.
    var p2Cube = rubik.convertCubieToPhase2(cube, axes[i], coords);
    assertRawCoordinates(p2Cube, 29024, 14092, 2, coords);
  }
}

function testPhase2Moves() {
  // Do the algorithm "R2 U F2 D2 L2 D' B2 R2 L2 D2 U' F2 D R2 U R2 D2"
	var moves = [2, 4, 0, 9, 3, 8, 1, 2, 3, 9, 5, 0, 7, 2, 4, 2, 9];
  var coords = new rubik.Phase2Coords();
  var state = new rubik.Phase2Cube();
  for (var i = 0; i < moves.length; ++i) {
    state.move(moves[i], coords);
  }
  assertRawCoordinates(state, 29024, 14092, 2, coords);
}

testPhase2Conversion();
testPhase2Moves();
console.log('PASS');
