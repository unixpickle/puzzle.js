var rubik = require('../../build/rubik.js');
var assert = require('assert');

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

function testPhase2EdgeSym() {
  var sym = new rubik.Phase2EdgeSym();
  
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

testP2EdgeSymmetryPermute();
testPhase2EdgeSym();
console.log('PASS');
