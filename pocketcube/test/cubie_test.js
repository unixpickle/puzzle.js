var pocketcube = require('../../build/pocketcube.js');
var assert = require('assert');

function testMove() {
  // Setup the cube.
  var moves = pocketcube.parseMoves("B U D B' L2 D' R' F2 L F D2 R2 F' U2 R " +
    "B2 L' U'");
  var cube = new pocketcube.Cube();
  for (var i = 0, len = moves.length; i < len; ++i) {
    cube.move(moves[i]);
  }

  // Verify the pieces.
  var pieces = [5, 7, 4, 3, 0, 2, 6, 1];
  var orientations = [0, 2, 2, 0, 0, 0, 2, 1];
  for (var i = 0; i < 8; ++i) {
    assert.equal(cube.corners[i].piece, pieces[i],
      'Bad piece for corner ' + i);
  }
  for (var i = 0; i < 8; ++i) {
    assert.equal(cube.corners[i].orientation, orientations[i],
      'Bad orientation for corner ' + i);
  }
}

// Run tests.
testMove();
console.log('PASS');

