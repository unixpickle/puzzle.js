var rubik = require('../../build/rubik.js');
var assert = require('assert');

function cancellationCase(algorithm, shortestLength) {
  var moves = rubik.parseMoves(algorithm);
  var cancelled = rubik.cancelMoves(moves);
  assert.equal(cancelled.length, shortestLength, 'Algorithm "' + algorithm + '" failed to ' +
    'simplify to ' + shortestLength + ' moves. Got "' + rubik.movesToString(cancelled) + '".');
  var cube = new rubik.CubieCube();
  for (var i = 0; i < cancelled.length; ++i) {
    cube.move(cancelled[i]);
  }
  for (var i = moves.length-1; i >= 0; --i) {
    cube.move(moves[i].inverse());
  }
  assert(cube.solved(), 'Algorithm "' + algorithm + '" incorrectly cancelled to "' +
    rubik.movesToString(cancelled) + '".');
}

function testCancelMoves() {
  cancellationCase("R2 U D' F2 F' F' D L2 L' L R2 D2 U2 B2 B D2 L' L'", 9);
  cancellationCase("R2 L R2", 1);
  cancellationCase("R R2 L R2", 2);
  cancellationCase("R R2 L R", 1);
  cancellationCase("R L R L'", 1);
  cancellationCase("L R L' R L", 2);
  cancellationCase("L R L R2 R L' R2 L' R2", 0);
  cancellationCase("L R L R2 R L' R2 L' R2", 0);
  cancellationCase("D R U' R D U D2 F2 L' U2 L2 F2 L D2 R D2 L2 F2 U2", 18);
}

testCancelMoves();
console.log('PASS');
