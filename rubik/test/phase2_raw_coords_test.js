var rubik = require('../../build/rubik.js');
var perms = require('../../build/perms.js');
var assert = require('assert');

function testP2SliceSymmetryPermute() {
  var applied = [
    // y0, y1, y2, y3
    [0, 1, 2, 3],
    [2, 0, 3, 1],
    [3, 2, 1, 0],
    [1, 3, 0, 2],
    // LR*y0, LR*y1, LR*y2, LR*y3
    [1, 0, 3, 2],
    [0, 2, 1, 3],
    [2, 3, 0, 1],
    [3, 1, 2, 0],
    // UD*y0, UD*y1, UD*y2, UD*y3
    [0, 1, 2, 3],
    [2, 0, 3, 1],
    [3, 2, 1, 0],
    [1, 3, 0, 2],
    // UD*LR*y0, UD*LR*y1, UD*LR*y2, UD*LR*y3
    [1, 0, 3, 2],
    [0, 2, 1, 3],
    [2, 3, 0, 1],
    [3, 1, 2, 0],
  ];

  var identity = applied[0];
  for (var i = 0; i < 0x10; ++i) {
    var sym = identity.slice();
    rubik.p2SliceSymmetryPermute(i, sym);
    assert.deepEqual(sym, applied[i], "Invalid result for symmetry " + i +
      ": " + sym.join(', '));
  }
}

function testPhase2ChooseCoordMove() {
  var coord = new rubik.Phase2ChooseCoord();

  // Apply the completely random moves D' D' B2 B2 D D2 D2 D B2 U D2 B2 L2 U'
  // D' D U' R2 L2 U2 U2 U2 U D L2 U2 D' U' L2 U2 D2 D2 U D2 D F2 L2 F2 U' L2
  // U' D U2 D D2 F2 U' F2 U D.
  // This case can be created in 12 moves: R2 F2 U R2 U B2 D F2 D2 F2 U' R2.
  var moves = [8, 8, 1, 1, 7, 9, 9, 7, 1, 4, 9, 1, 3, 5, 8, 7, 5, 2, 3, 6, 6,
    6, 4, 7, 3, 6, 8, 5, 3, 6, 9, 9, 4, 9, 7, 0, 3, 0, 5, 3, 5, 7, 6, 7, 9, 0,
    5, 0, 4, 7];

  var choose = perms.encodeChoose([false, false, true, true, false, false, true,
    true]);
  for (var i = 0; i < moves.length; ++i) {
    choose = coord.move(choose, moves[i]);
  }

  assert.equal(choose, perms.encodeChoose([true, false, false, false, true,
    true, false, true]));
}

function testPhase2SliceCoordMove() {
  var coord = new rubik.Phase2SliceCoord(perms.allPerms(4));

  // Apply the completely random moves D' D' B2 B2 D D2 D2 D B2 U D2 B2 L2 U'
  // D' D U' R2 L2 U2 U2 U2 U D L2 U2 D' U' L2 U2 D2 D2 U D2 D F2 L2 F2 U' L2
  // U' D U2 D D2 F2 U' F2 U D.
  // This case can be created in 12 moves: R2 F2 U R2 U B2 D F2 D2 F2 U' R2.
  var moves = [8, 8, 1, 1, 7, 9, 9, 7, 1, 4, 9, 1, 3, 5, 8, 7, 5, 2, 3, 6, 6,
    6, 4, 7, 3, 6, 8, 5, 3, 6, 9, 9, 4, 9, 7, 0, 3, 0, 5, 3, 5, 7, 6, 7, 9, 0,
    5, 0, 4, 7];

  var slicePerm = 0;
  for (var i = 0; i < moves.length; ++i) {
    slicePerm = coord.move(slicePerm, moves[i]);
  }

  assert.equal(slicePerm, perms.encodePerm([3, 2, 0, 1]));
}

testP2SliceSymmetryPermute();
testPhase2ChooseCoordMove();
testPhase2SliceCoordMove();
console.log('PASS');
