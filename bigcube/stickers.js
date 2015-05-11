// A StickerCube represents any sized cube in terms of its stickers.
function StickerCube(size) {
  var sideCount = size * size;
  this.size = size;
  this.stickers = new Uint8Array(sideCount * 6);
  for (var i = 0; i < sideCount*6; ++i) {
    var sticker = Math.floor(i / sideCount);
    this.stickers[i] = sticker;
  }
}

StickerCube.prototype.copy = function() {
  var res = new StickerCube(this.size);
  for (var i = 0; i < this.stickers.length; ++i){
    res.stickers[i] = this.stickers[i];
  }
  return res;
};

StickerCube.prototype.move = function(move) {
  var res = this;
  for (var i = 0; i < move.turns; ++i) {
    for (var layer = 0; layer < move.width; ++layer) {
      res = res._turnSliceStickersClockwise(move.face, layer);
    }
    res = res._turnOuterStickersClockwise(move.face);
  }
  return res;
};

StickerCube.prototype._indicesForBFLayer = function(layer) {
  var indices = [];
  var faceCount = this.size * this.size;

  // Top face.
  for (var i = 0; i < this.size; ++i) {
    indices.push(this.size*layer + i);
  }

  var rightFaceStart = faceCount * 4;
  for (var i = 0; i < this.size; ++i) {
    indices.push(rightFaceStart + this.size*i + (this.size-layer-1));
  }

  var bottomOffset = this.size * (this.size-layer-1);
  var bottomFaceStart = faceCount;
  for (var i = 0; i < this.size; ++i) {
    indices.push(bottomFaceStart + bottomOffset + (this.size-i-1));
  }

  var leftFaceStart = faceCount * 5;
  for (var i = 0; i < this.size; ++i) {
    indices.push(leftFaceStart + this.size*(this.size-i-1) + layer);
  }

  return indices;
};

StickerCube.prototype._indicesForLRLayer = function(layer) {
  var indices = [];
  var faceCount = this.size * this.size;

  // Top face.
  for (var i = 0; i < this.size; ++i) {
    indices.push(i*this.size + layer);
  }

  var frontFaceStart = faceCount * 2;
  for (var i = 0; i < this.size; ++i) {
    indices.push(frontFaceStart + i*this.size + layer);
  }

  var bottomFaceStart = faceCount;
  for (var i = 0; i < this.size; ++i) {
    indices.push(bottomFaceStart + i*this.size + layer);
  }

  var backFaceStart = faceCount * 3;
  for (var i = 0; i < this.size; ++i) {
    var backIndex = this.size - (layer + 1);
    indices.push(backFaceStart + (this.size-i-1)*this.size + backIndex);
  }

  return indices;
};

StickerCube.prototype._indicesForUDLayer = function(layer) {
  var indices = [];
  var faceCount = this.size * this.size;

  var frontFaceStart = faceCount * 2;
  for (var i = 0; i < this.size; ++i) {
    indices.push(frontFaceStart + this.size*layer + i);
  }

  var rightFaceStart = faceCount * 4;
  for (var i = 0; i < this.size; ++i) {
    indices.push(rightFaceStart + this.size*layer + i);
  }

  var backFaceStart = faceCount * 3;
  for (var i = 0; i < this.size; ++i) {
    indices.push(backFaceStart + this.size*layer + i);
  }

  var leftFaceStart = faceCount * 5;
  for (var i = 0; i < this.size; ++i) {
    indices.push(leftFaceStart + this.size*layer + i);
  }

  return indices;
};

StickerCube.prototype._permuteLayerBackwards = function(indices) {
  var res = this.copy();
  for (var i = 0, len = indices.length; i < len; ++i) {
    var sourceIndex = indices[(i + this.size) % len];
    var destIndex = indices[i];
    res.stickers[destIndex] = this.stickers[sourceIndex];
  }
  return res;
};

StickerCube.prototype._permuteLayerForwards = function(indices) {
  var res = this.copy();
  for (var i = 0, len = indices.length; i < len; ++i) {
    var sourceIndex = indices[i];
    var destIndex = indices[(i + this.size) % len];
    res.stickers[destIndex] = this.stickers[sourceIndex];
  }
  return res;
};

StickerCube.prototype._turnOuterStickersClockwise = function(face) {
  var faceIndex = ['U', 'D', 'F', 'B', 'R', 'L'].indexOf(face);
  if (faceIndex < 0) {
    throw new Error('unknown face: ' + face);
  }
  var faceCount = this.size * this.size;
  var stickerStartIndex = faceCount * faceIndex;
  var res = this.copy();
  for (var x = 0; x < this.size; ++x) {
    for (var y = 0; y < this.size; ++y) {
      var destY = x;
      var destX = (this.size - y - 1);
      res.stickers[stickerStartIndex + destX + destY*this.size] =
        this.stickers[stickerStartIndex + x + y*this.size];
    }
  }
  return res;
};

StickerCube.prototype._turnSliceStickersClockwise = function(face, layer) {
  var indices = null;
  var forwards = false;
  if (face === 'R' || face === 'L') {
    var layerLR = layer;
    if (face === 'R') {
      layerLR = this.size - (layer + 1);
    }
    indices = this._indicesForLRLayer(layerLR);
    forwards = (face === 'L');
  } else if (face === 'U' || face === 'D') {
    var layerUD = layer;
    if (face === 'D') {
      layerUD = this.size - (layer + 1);
    }
    indices = this._indicesForUDLayer(layerUD);
    forwards = (face === 'D');
  } else if (face === 'F' || face === 'B') {
    var layerBF = layer;
    if (face === 'F') {
      layerBF = this.size - (layer + 1);
    }
    indices = this._indicesForBFLayer(layerBF);
    forwards = (face === 'F');
  } else {
    throw new Error('unknown face: ' + face);
  }
  if (forwards) {
    return this._permuteLayerForwards(indices);
  } else {
    return this._permuteLayerBackwards(indices);
  }
};

exports.StickerCube = StickerCube;
