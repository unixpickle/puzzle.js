var pyraminx = require('../../build/pyraminx.js');
var assert = require('assert');

function testParseMoves() {
  var moves = pyraminx.parseMoves("R L U B R' L' U' B'");
  var expected = [
    new pyraminx.Move(0, true),
    new pyraminx.Move(1, true),
    new pyraminx.Move(2, true),
    new pyraminx.Move(3, true),
    new pyraminx.Move(0, false),
    new pyraminx.Move(1, false),
    new pyraminx.Move(2, false),
    new pyraminx.Move(3, false)
  ];

  assert.equal(moves.length, expected.length);
  for (var i = 0; i < 8; ++i) {
    assert.equal(moves[i].corner, expected[i].corner);
    assert.equal(moves[i].clockwise, expected[i].clockwise);
  }

  assert.throws(function() {
    pyraminx.parseMoves("R2");
  });
  assert.throws(function() {
    pyraminx.parseMoves("D");
  });
}

function testToString() {
  var str = "L R U B L' R' U' B' L R U' B' L' R' U B";
  var moves = pyraminx.parseMoves(str);
  assert.equal(pyraminx.movesToString(moves), str);
}

testParseMoves();
testToString();
console.log('PASS');
