var pyraminx = require('../../build/pyraminx.js');
var assert = require('assert');

function stickersForAlgorithm(alg) {
  var stickers = new pyraminx.Stickers();
  var moves = pyraminx.parseStickerMoves(alg);
  for (var i = 0, len = moves.length; i < len; ++i) {
    stickers.move(moves[i]);
  }
  return stickers;
}

function stickersToString(stickers) {
  var res = '';
  for (var i = 0; i < 36; ++i) {
    res += ['g', 'y', 'b', 'r'][stickers.colorAt(i)];
  }
  return res;
}

function testMove() {
  var stickers, stickersStr;

  stickers = stickersForAlgorithm("U");
  stickersStr = 'bbbbggggg' + 'yyyyyyyyy' + 'rrrrbbbbb' + 'ggggrrrrr';
  assert.equal(stickersToString(stickers), stickersStr);

  stickers = stickersForAlgorithm("B");
  stickersStr = 'ggggggggg' + 'yyyyyrrrr' + 'bbbybbyyy' + 'rbrrbbbrr';
  assert.equal(stickersToString(stickers), stickersStr);

  stickers = stickersForAlgorithm("U B U B' U B' U B' U B U'");
  stickersStr = 'bbbrggggg' + 'yyyyygbbb' + 'ryrgbbrrr' + 'gbgyyyrrr';
  assert.equal(stickersToString(stickers), stickersStr);

  stickers = stickersForAlgorithm("R");
  stickersStr = 'gggyggyyy' + 'yybbbyyby' + 'bgbbgggbb' + 'rrrrrrrrr';
  assert.equal(stickersToString(stickers), stickersStr);

  stickers = stickersForAlgorithm("L");
  stickersStr = 'grggrrrgg' + 'gggyygyyy' + 'bbbbbbbbb' + 'rrryrryyy';
  assert.equal(stickersToString(stickers), stickersStr);

  stickers = stickersForAlgorithm("R L R L' R' L R' L R L'");
  stickersStr = 'gggrrrgyy' + 'ggybbryyy' + 'bybbggbbb' + 'rrrbrrgyy';
  assert.equal(stickersToString(stickers), stickersStr);

  stickers = stickersForAlgorithm("B R' U L U' B' L' R' l' r' b' R U R U L' U' B L r' U " +
    "L' B U L U B u r b'");
  stickersStr = 'rgbrygbgb' + 'rygygrygr' + 'gbrbybrby' + 'bygybryrg';
  assert.equal(stickersToString(stickers), stickersStr);
}

testMove();
console.log('PASS');
