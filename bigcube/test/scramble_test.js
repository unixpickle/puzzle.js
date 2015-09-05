var assert = require('assert');
var bigcube = require('../../build/bigcube.js');

function testScrambleCompleteness() {
  for (var size = 4; size <= 8; size += 2) {
    var stickerCubes = [];
    for (var i = 0; i < 80; ++i) {
      var scramble = bigcube.wcaMoveScramble(size, 150);
      var stickerCube = new bigcube.StickerCube(size);
      for (var move = 0, len = scramble.length; move < len; ++move) {
        stickerCube = stickerCube.move(scramble[move]);
      }
      stickerCubes.push(stickerCube);
    }
    for (var i = 0, len = stickerCubes[0].stickers.length; i < len; ++i) {
      var sticker = stickerCubes[0].stickers[i];
      var differs = false;
      for (var j = 1, len1 = stickerCubes.length; j < len1; ++j) {
        if (stickerCubes[j].stickers[i] != sticker) {
          differs = true;
          break;
        }
      }
      assert(differs, "stickers " + i + " did not change for " + size);
    }
  }
}

testScrambleCompleteness();
console.log('PASS');
