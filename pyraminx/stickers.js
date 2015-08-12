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

// colorAt gets the color of the sticker at a given physical slot (index).
Stickers.prototype.colorAt = function(index) {
  if (index < 0 || index >= 36) {
    throw new Error('sticker index out of bounds: ' + index);
  }
  return this._stickers[index];
};

// move applies a StickerMove to the stickers.
Stickers.prototype.move = function(stickerMove) {
  this._applyMoveToTip(stickerMove);
  if (!stickerMove.tip) {
    this._applyMoveToNonTip(stickerMove);
  }
};

Stickers.prototype._applyMoveToNonTip = function(stickerMove) {
  var front = 0;
  var bottom = 9;
  var right = 18;
  var left = 27;
  
  if (stickerMove.clockwise) {
    switch (stickerMove.corner) {
    case 0: // R
      this._threeCycle(front+7, right+5, bottom+3);
      this._threeCycle(front+6, right+1, bottom+7);
      this._threeCycle(bottom+2, front+3, right+6);
      break;
    case 1: // L
      this._threeCycle(front+5, bottom+1, left+7);
      this._threeCycle(front+1, bottom+2, left+6);
      this._threeCycle(front+6, bottom+5, left+3);
      break;
    case 2: // U
      this._threeCycle(front+2, left+2, right+2);
      this._threeCycle(front+1, left+1, right+1);
      this._threeCycle(front+3, left+3, right+3);
      break;
    case 3: // B
      this._threeCycle(left+5, bottom+6, right+7);
      this._threeCycle(left+1, bottom+5, right+6);
      this._threeCycle(right+3, left+6, bottom+7);
      break;
    default:
      throw new Error('invalid corner: ' + stickerMove.corner);
    }
  } else {
    switch (stickerMove.corner) {
    case 0: // R'
      this._reverseThreeCycle(front+7, right+5, bottom+3);
      this._reverseThreeCycle(front+6, right+1, bottom+7);
      this._reverseThreeCycle(bottom+2, front+3, right+6);
      break;
    case 1: // L'
      this._reverseThreeCycle(front+5, bottom+1, left+7);
      this._reverseThreeCycle(front+1, bottom+2, left+6);
      this._reverseThreeCycle(front+6, bottom+5, left+3);
      break;
    case 2: // U'
      this._reverseThreeCycle(front+2, left+2, right+2);
      this._reverseThreeCycle(front+1, left+1, right+1);
      this._reverseThreeCycle(front+3, left+3, right+3);
      break;
    case 3: // B'
      this._reverseThreeCycle(left+5, bottom+6, right+7);
      this._reverseThreeCycle(left+1, bottom+5, right+6);
      this._reverseThreeCycle(right+3, left+6, bottom+7);
      break;
    default:
      throw new Error('invalid corner: ' + stickerMove.corner);
    }
  }
};

Stickers.prototype._applyMoveToTip = function(stickerMove) {
  var front = 0;
  var bottom = 9;
  var right = 18;
  var left = 27;
  
  if (stickerMove.clockwise) {
    switch (stickerMove.corner) {
    case 0: // r
      this._threeCycle(front+8, right+4, bottom+4);
      break;
    case 1: // l
      this._threeCycle(front+4, bottom, left+8);
      break;
    case 2: // u
      this._threeCycle(front, left, right);
      break;
    case 3: // b
      this._threeCycle(left+4, bottom+8, right+8);
      break;
    default:
      throw new Error('invalid corner: ' + stickerMove.corner);
    }
  } else {
    switch (stickerMove.corner) {
    case 0: // r'
      this._reverseThreeCycle(front+8, right+4, bottom+4);
      break;
    case 1: // l'
      this._reverseThreeCycle(front+4, bottom, left+8);
      break;
    case 2: // u'
      this._reverseThreeCycle(front, left, right);
      break;
    case 3: // b'
      this._reverseThreeCycle(left+4, bottom+8, right+8);
      break;
    default:
      throw new Error('invalid corner: ' + stickerMove.corner);
    }
  }
};

Stickers.prototype._threeCycle = function(idx1, idx2, idx3) {
  var temp = this._stickers[idx3];
  this._stickers[idx3] = this._stickers[idx2];
  this._stickers[idx2] = this._stickers[idx1];
  this._stickers[idx1] = temp;
};

Stickers.prototype._reverseThreeCycle = function(idx1, idx2, idx3) {
  this._threeCycle(idx1, idx2, idx3);
  this._threeCycle(idx1, idx2, idx3);
};

exports.Stickers = Stickers;
