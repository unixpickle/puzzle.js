var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testMove() {
  // Setup the cube.
  var moves = rubik.parseMoves("B U D B' L2 D' R' F2 L F D2 R2 F' U2 R B2 L' " +
    "U'");
  var cube = new rubik.CubieCube();
  for (var i = 0, len = moves.length; i < len; ++i) {
    cube.move(moves[i]);
  }

  // Verify the corners.
  var pieces = [5, 7, 4, 3, 0, 2, 6, 1];
  var orientations = [0, 2, 2, 0, 0, 0, 2, 1];
  for (var i = 0; i < 8; ++i) {
    assert.equal(cube.corners.corners[i].piece, pieces[i],
      'Bad piece for corner ' + i);
  }
  for (var i = 0; i < 8; ++i) {
    assert.equal(cube.corners.corners[i].orientation, orientations[i],
      'Bad orientation for corner ' + i);
  }

  // Verify the edges.
  pieces = [9, 4, 5, 1, 11, 6, 0, 10, 8, 7, 3, 2];
  orientations = [true, true, false, false, false, false, true, false,
    true, true, false, true];
  for (var i = 0; i < 12; ++i) {
    assert.equal(cube.edges.edges[i].piece, pieces[i],
      'Bad piece for edge ' + i);
  }
  for (var i = 0; i < 12; ++i) {
    assert.equal(cube.edges.edges[i].flip, orientations[i],
      'Bad orientation for edge ' + i);
  }
}

// Run tests.
testMove();
console.log('PASS');

