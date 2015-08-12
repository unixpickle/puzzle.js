// Stickers represents the stickers on the Pyraminx and facilitates the rendering of a 3D pyraminx
// based on its stickers.
//
// Colors are represented by the numbers 0 through 3 (inclusive). 0 is green, 1 yellow, 2 blue, and
// 3 red.
//
// Stickers are indexed from 0 through 35 (inclusive). The start from the green face, going left to
// right from the tip down. Next is the yellow face, going left to right from the base to the tip.
// Next is the blue face, read like the green face, and finally the red face, also read like the
// green face.
function Stickers() {
  this._stickers = [];
  for (var sticker = 0; sticker < 4; ++sticker) {
    for (var i = 0; i < 9; ++i) {
      this._stickers.push(sticker);
    }
  }
}

// move applies a StickerMove to the stickers.
Stickers.prototype.move = function(stickerMove) {
  this._applyMoveToTip(stickerMove);
  if (!stickerMove.tip) {
    this._applyMoveToNonTip(stickerMove);
  }
};

StickerMove.prototype._applyMoveToNonTip = function(stickerMove) {
  // TODO: this
};

StickerMove.prototype._applyMoveToTip = function(stickerMove) {
  var front = 0;
  var bottom = 9;
  var right = 18;
  var left = 27;
  
  if (stickerMove.clockwise) {
    switch (stickerMove.corner) {
    case 0: // r
      this._threeCycle(front+8, right+4, bottom+4);
    case 1: // l
      this._threeCycle(front+4, bottom, left+8);
    case 2: // u
      this._threeCycle(front, left, right);
    case 3: // b
      this._threeCycle(left+4, bottom+8, right+8);
    default:
      throw new Error('invalid corner: ' + stickerMove.corner);
    }
  } else {
    switch (stickerMove.corner) {
    case 0: // r'
      this._reverseThreeCycle(front+8, right+4, bottom+4);
    case 1: // l'
      this._reverseThreeCycle(front+4, bottom, left+8);
    case 2: // u'
      this._reverseThreeCycle(front, left, right);
    case 3: // b'
      this._reverseThreeCycle(left+4, bottom+8, right+8);
    default:
      throw new Error('invalid corner: ' + stickerMove.corner);
    }
  }
};

StickerMove.prototype._threeCycle = function(idx1, idx2, idx3) {
  var temp = this._stickers[idx3];
  this._stickers[idx3] = this._stickers[idx2];
  this._stickers[idx2] = this._stickers[idx1];
  this._stickers[idx1] = temp;
};

StickerMove.prototype._reverseThreeCycle = function(idx1, idx2, idx3) {
  // NOTE: Inverting a three-cycle is the same thing as doing it twice.
  for (var i = 0; i < 2; ++i) {
    this._threeCycle(idx1, idx2, idx3);
  }
};

exports.Stickers = Stickers;
