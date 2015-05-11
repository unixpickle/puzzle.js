var assert = require('assert');
var bigcube = require('../../build/bigcube.js');

function stickersToString(stickerCube) {
  var result = '';
  var stickerNames = ['w', 'y', 'g', 'b', 'r', 'o'];
  for (var i = 0, len = stickerCube.stickers.length; i < len; ++i) {
    result += stickerNames[stickerCube.stickers[i]];
  }
  return result;
}

function testScramble2x2() {
  var moves = bigcube.parseWCAMoves("U2 R2 U2 R U' R F' R' F2 U2 R U2 R F' U2" +
    " R2 U2 F2 U2 F' U' R U' F' U2");
  var stickerCube = new bigcube.StickerCube(2);
  for (var i = 0, len = moves.length; i < len; ++i) {
    stickerCube = stickerCube.move(moves[i]);
  }
  assert.deepEqual(stickersToString(stickerCube), 'wrrogrygwgobgbybwwyroboy');
}

function testScramble4x4() {
  var moves = bigcube.parseWCAMoves("U' 2Rw 2Fw2 F' R2 U F 2Rw U' 2Rw2 F U2" +
    " 2Fw2 2Rw 2Fw2 R F2 2Fw2 U2 R' U 2Rw U' 2Fw' F2 U 2Rw' R2 F' 2Rw2 F'" +
    " 2Uw2 R2 2Rw F 2Rw 2Fw' U' 2Rw 2Uw2");
  var stickerCube = new bigcube.StickerCube(4);
  for (var i = 0, len = moves.length; i < len; ++i) {
    stickerCube = stickerCube.move(moves[i]);
  }
  assert.deepEqual(stickersToString(stickerCube), 'wrgowgwgbrbyyryw' +
    'rwgbbrbwyywgyyww' + 'ggroooggbyryybyr' + 'gogbbwggrbbbgobb' +
    'goyywoyyrgwwwrwr' + 'oorroorbooywoorb');
}

testScramble2x2();
testScramble4x4();
console.log('PASS');
