var pyraminx = require('../../build/pyraminx.js');
var assert = require('assert');

function testParseStickerMoves() {
  var moves = pyraminx.parseStickerMoves("R L U B R' L' U' B' r l u b r' l' u' b'");
  var expected = [
    new pyraminx.StickerMove(0, true, false),
    new pyraminx.StickerMove(1, true, false),
    new pyraminx.StickerMove(2, true, false),
    new pyraminx.StickerMove(3, true, false),
    new pyraminx.StickerMove(0, false, false),
    new pyraminx.StickerMove(1, false, false),
    new pyraminx.StickerMove(2, false, false),
    new pyraminx.StickerMove(3, false, false),
    new pyraminx.StickerMove(0, true, true),
    new pyraminx.StickerMove(1, true, true),
    new pyraminx.StickerMove(2, true, true),
    new pyraminx.StickerMove(3, true, true),
    new pyraminx.StickerMove(0, false, true),
    new pyraminx.StickerMove(1, false, true),
    new pyraminx.StickerMove(2, false, true),
    new pyraminx.StickerMove(3, false, true)
  ];

  assert.equal(moves.length, expected.length);
  for (var i = 0; i < 8; ++i) {
    assert.equal(moves[i].corner, expected[i].corner);
    assert.equal(moves[i].clockwise, expected[i].clockwise);
    assert.equal(moves[i].tip, expected[i].tip);
  }

  assert.throws(function() {
    pyraminx.parseStickerMoves("R2");
  });
  assert.throws(function() {
    pyraminx.parseStickerMoves("r2");
  });
}

function testToString() {
  var str = "R L U B R' L' U' B' r l u b r' l' u' b'";
  var moves = pyraminx.parseStickerMoves(str);
  assert.equal(pyraminx.stickerMovesToString(moves), str);
}

testParseStickerMoves();
testToString();
console.log('PASS');
