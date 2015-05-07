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
    for (var i = 0; i < move.width; ++i) {
      for (var j = 0; j < move.turns; ++j) {
        res = res._turnLayerOnce(move.face, i);
      }
    }
    return res;
  };

  StickerCube.prototype._permuteBackwards = function(indices) {
    var res = this.copy();
    for (var i = 0, len = indices.length; i < len; ++i) {
      var sourceIndex = indices[(i + this.size) % len];
      var destIndex = indices[i];
      res.stickers[destIndex] = this.stickers[sourceIndex];
    }
    return res;
  };

  StickerCube.prototype._permuteForwards = function(indices) {
    var res = this.copy();
    for (var i = 0, len = indices.length; i < len; ++i) {
      var sourceIndex = indices[i];
      var destIndex = indices[(i + this.size) % len];
      res.stickers[destIndex] = this.stickers[sourceIndex];
    }
    return res;
  };

  StickerCube.prototype._rlIndicesForLayer = function(layer) {
    var indices = [];

    var faceCount = this.size * this.size;

    // Top face indices.
    for (var i = 0; i < this.size; ++i) {
      indices.push(i*this.size + layer);
    }

    // Front face indices.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount*2 + i*this.size + layer);
    }

    // Bottom face indices.
    for (var i = 0; i < this.size; ++i) {
      indices.push(faceCount + i*this.size + layer);
    }

    // Back face indices.
    for (var i = 0; i < this.size; ++i) {
      var backIndex = this.size - (layer + 1);
      indices.push(faceCount*3 + i*this.size + backIndex);
    }

    return indices;
  };

  StickerCube.prototype._turnLayerOnce = function(face, layer) {
    var indices = null;
    var forwards = false;
    if (face === 'R' || face === 'L') {
      var rlLayer = layer;
      if (face === 'L') {
        rlLayer = this.size - (layer + 1);
      }
      indices = this._rlIndicesForLayer(rlLayer);
      if (face === 'L') {
        return this._permuteForwards(indices);
      } else {
        return this._permuteBackwards(indices);
      }
    }
    // TODO: the other axes
    throw new Error('NYI');
  };

})();
