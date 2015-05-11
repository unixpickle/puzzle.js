(function() {

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
      for (var relativeLayer = 0; relativeLayer < move.width; ++relativeLayer) {
        res = res._turnSliceStickersClockwise(move.face, j);
      }
      res._turnOuterStickersClockwise(move.face);
    }
    return res;
  };

  StickerCube.prototype._indicesForBFLayer = function(layer) {
    var indices = [];
    var faceCount = this.size * this.size;

    // Top indices.
    for (var i = 0; i < this.size; ++i) {
      indices.push(this.size*layer + i);
    }
    // Right indices.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*4 + this.size*i + (this.size-layer-1));
    }
    // Bottom indices.
    var bottomOffset = this.size * (this.size-layer-1);
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount + bottomOffset + (this.size-i-1));
    }
    // Left indices.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*5 + this.size*(this.size-i-1) + layer);
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
    // Front face.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*2 + i*this.size + layer);
    }
    // Bottom face.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount + i*this.size + layer);
    }
    // Back face.
    for (var i = 0; i < this.size; ++i) {
      var backIndex = this.size - (layer + 1);
      indices.push(faceCount*3 + i*this.size + backIndex);
    }

    return indices;
  };

  StickerCube.prototype._indicesForUDLayer = function(layer) {
    var indices = [];
    var faceCount = this.size * this.size;

    // Front face.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*2 + this.size*layer + i);
    }
    // Right face.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*4 + this.size*layer + i);
    }
    // Back face.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*3 + this.size*layer + i);
    }
    // Left face.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*5 + this.size*layer + i);
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
    // TODO: this.
    throw new Error('NYI');
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

})();
