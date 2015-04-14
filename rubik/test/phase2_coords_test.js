var rubik = require('../../build/rubik.js');
var perms = require('../../build/perms.js');
var assert = require('assert');

function testP2CornerSymmetryPermute() {
  var applied = [
    // y0, y1, y2, y3
    [0, 1, 2, 3, 4, 5, 6, 7],
    [4, 0, 6, 2, 5, 1, 7, 3],
    [5, 4, 7, 6, 1, 0, 3, 2],
    [1, 5, 3, 7, 0, 4, 2, 6],
    // LR*y0, LR*y1, LR*y2, LR*y3
    [1, 0, 3, 2, 5, 4, 7, 6],
    [0, 4, 2, 6, 1, 5, 3, 7],
    [4, 5, 6, 7, 0, 1, 2, 3],
    [5, 1, 7, 3, 4, 0, 6, 2],
    // UD*y0, UD*y1, UD*y2, UD*y3
    [2, 3, 0, 1, 6, 7, 4, 5],
    [6, 2, 4, 0, 7, 3, 5, 1],
    [7, 6, 5, 4, 3, 2, 1, 0],
    [3, 7, 1, 5, 2, 6, 0, 4],
    // UD*LR*y0, UD*LR*y1, UD*LR*y2, UD*LR*y3
    [3, 2, 1, 0, 7, 6, 5, 4],
    [2, 6, 0, 4, 3, 7, 1, 5],
    [6, 7, 4, 5, 2, 3, 0, 1],
    [7, 3, 5, 1, 6, 2, 4, 0]
  ];
  
  var identity = applied[0];
  for (var i = 0; i < 0x10; ++i) {
    var sym = identity.slice();
    rubik.p2CornerSymmetryPermute(i, sym);
    assert.deepEqual(sym, applied[i], "Invalid result for symmetry " + i +
      ": " + sym.join(', '));
  }
}

function testP2EdgeSymmetryPermute() {
  var applied = [
    // y0, y1, y2, y3
    [0, 1, 2, 3, 4, 5, 6, 7],
    [3, 0, 1, 2, 7, 4, 5, 6],
    [2, 3, 0, 1, 6, 7, 4, 5],
    [1, 2, 3, 0, 5, 6, 7, 4],
    // LR*y0, LR*y1, LR*y2, LR*y3
    [0, 3, 2, 1, 4, 7, 6, 5],
    [3, 2, 1, 0, 7, 6, 5, 4],
    [2, 1, 0, 3, 6, 5, 4, 7],
    [1, 0, 3, 2, 5, 4, 7, 6],
    // UD*y0, UD*y1, UD*y2, UD*y3
    [4, 5, 6, 7, 0, 1, 2, 3],
    [7, 4, 5, 6, 3, 0, 1, 2],
    [6, 7, 4, 5, 2, 3, 0, 1],
    [5, 6, 7, 4, 1, 2, 3, 0],
    // UD*LR*y0, UD*LR*y1, UD*LR*y2, UD*LR*y3
    [4, 7, 6, 5, 0, 3, 2, 1],
    [7, 6, 5, 4, 3, 2, 1, 0],
    [6, 5, 4, 7, 2, 1, 0, 3],
    [5, 4, 7, 6, 1, 0, 3, 2]
  ];
  
  var identity = applied[0];
  for (var i = 0; i < 0x10; ++i) {
    var sym = identity.slice();
    rubik.p2EdgeSymmetryPermute(i, sym);
    assert.deepEqual(sym, applied[i], "Invalid result for symmetry " + i +
      ": " + sym.join(', '));
  }
}

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

function testPhase2CornerSym() {
  var sym = new rubik.Phase2CornerSym(perms.allPerms(8));
  
  // Make sure there are exactly 2768 unique cases (up to symmetry).
  var caseCount = 0;
  var gotten = {};
  for (var i = 0; i < 40320; ++i) {
    var s = sym.rawToSym(i) >> 4;
    if (!gotten[s]) {
      gotten[s] = true;
      ++caseCount;
    }
  }
  assert.equal(caseCount, 2768, "invalid number of unique cases: " + caseCount);
}

function testPhase2CornerSymMove() {
  var sym = new rubik.Phase2CornerSym(perms.allPerms(8));
  
  // Apply the completely random moves D' D' B2 B2 D D2 D2 D B2 U D2 B2 L2 U'
  // D' D U' R2 L2 U2 U2 U2 U D L2 U2 D' U' L2 U2 D2 D2 U D2 D F2 L2 F2 U' L2
  // U' D U2 D D2 F2 U' F2 U D.
  // This case can be created in 12 moves: R2 F2 U R2 U B2 D F2 D2 F2 U' R2.
  var moves = [8, 8, 1, 1, 7, 9, 9, 7, 1, 4, 9, 1, 3, 5, 8, 7, 5, 2, 3, 6, 6,
    6, 4, 7, 3, 6, 8, 5, 3, 6, 9, 9, 4, 9, 7, 0, 3, 0, 5, 3, 5, 7, 6, 7, 9, 0,
    5, 0, 4, 7];
  
  // Apply all the moves to the solved state.
  var state = 0;
  for (var i = 0; i < moves.length; ++i) {
    state = sym.move(state, moves[i]);
  }
  
  // Make sure the symmetry coordinate represents the correct permutation.
  var perm = null;
  for (var i = 0; i < 40320; ++i) {
    var s = sym.rawToSym(i);
    if ((s >>> 4) === (state >>> 4)) {
      assert.equal(s & 0xf, 0);
      perm = perms.allPerms(8)[i];
      break;
    }
  }
  assert.notEqual(perm, null);
  perm = rubik.p2CornerSymmetryConj(state & 0xf, perm);
  assert.deepEqual(perm, [7, 4, 0, 1, 3, 2, 5, 6]);
}

function testPhase2EdgeSym() {
  var sym = new rubik.Phase2EdgeSym(perms.allPerms(8));
  
  // Make sure there are exactly 2768 unique cases (up to symmetry).
  var caseCount = 0;
  var gotten = {};
  for (var i = 0; i < 40320; ++i) {
    var s = sym.rawToSym(i) >> 4;
    if (!gotten[s]) {
      gotten[s] = true;
      ++caseCount;
    }
  }
  assert.equal(caseCount, 2768, "invalid number of unique cases: " + caseCount);
}

function testPhase2EdgeSymMove() {
  var sym = new rubik.Phase2EdgeSym(perms.allPerms(8));
  
  // Apply the completely random moves D' D' B2 B2 D D2 D2 D B2 U D2 B2 L2 U'
  // D' D U' R2 L2 U2 U2 U2 U D L2 U2 D' U' L2 U2 D2 D2 U D2 D F2 L2 F2 U' L2
  // U' D U2 D D2 F2 U' F2 U D.
  // This case can be created in 12 moves: R2 F2 U R2 U B2 D F2 D2 F2 U' R2.
  var moves = [8, 8, 1, 1, 7, 9, 9, 7, 1, 4, 9, 1, 3, 5, 8, 7, 5, 2, 3, 6, 6,
    6, 4, 7, 3, 6, 8, 5, 3, 6, 9, 9, 4, 9, 7, 0, 3, 0, 5, 3, 5, 7, 6, 7, 9, 0,
    5, 0, 4, 7];
  
  // Apply all the moves to the solved state.
  var state = 0;
  for (var i = 0; i < moves.length; ++i) {
    state = sym.move(state, moves[i]);
  }
  
  // Make sure the symmetry coordinate represents the correct permutation.
  var perm = null;
  for (var i = 0; i < 40320; ++i) {
    var s = sym.rawToSym(i);
    if ((s >>> 4) === (state >>> 4)) {
      assert.equal(s & 0xf, 0);
      perm = perms.allPerms(8)[i];
      break;
    }
  }
  assert.notEqual(perm, null);
  perm = rubik.p2EdgeSymmetryConj(state & 0xf, perm);
  assert.deepEqual(perm, [3, 6, 5, 4, 1, 0, 7, 2]);
}

testP2CornerSymmetryPermute();
testP2EdgeSymmetryPermute();
testP2SliceSymmetryPermute();
testPhase2CornerSym();
testPhase2CornerSymMove();
testPhase2EdgeSym();
testPhase2EdgeSymMove();
console.log('PASS');
