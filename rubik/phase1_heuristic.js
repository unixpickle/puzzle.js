// Phase1Heuristic stores the data needed to effectively prune the search for a
// solution for phase-1.
function Phase1Heuristic(moves) {
  // This is packed with two 4-bit depth values per byte.
  this.coEO = new Uint8Array(2239488);
  
  // This is packed with one depth value per byte.
  this.eoSlice = new Uint8Array(1013760);
  
  this._computeCOEO(moves);
  this._computeEOSlice(moves);
}

// lowerBound returns the minimum number of moves needed to solve at least one
// phase-1 axis.
Phase1Heuristic.prototype.lowerBound = function(c) {
  var xEO = c.xEO();
  
  var slice0 = this.eoSlice[c.mSlice*2048 + xEO];
  var slice1 = this.eoSlice[c.eSlice*2048 + c.fbEO];
  var slice2 = this.eoSlice[c.sSlice*2048 + c.udEO];
  
  // Bitfield accesses are kind of ugly.
  var hash = xEO | (c.xCO << 11);
  var eo0 = (this.coEO[hash >>> 1] >>> ((hash & 1) << 2)) & 0xf;
  hash = c.fbEO | (c.yCO << 11);
  var eo1 = (this.coEO[hash >>> 1] >>> ((hash & 1) << 2)) & 0xf;
  hash = c.udEO | (c.zCO << 11);
  var eo2 = (this.coEO[hash >>> 1] >>> ((hash & 1) << 2)) & 0xf;
  
  // Return the least of the three heuristic values.
  var a = Math.max(slice0, eo0);
  var b = Math.max(slice1, eo1);
  var c = Math.max(slice2, eo2);
  if (b < a) {
    return Math.min(b, c);
  } else {
    return Math.min(a, c);
  }
  
  // NOTE: using Math.min() with three arguments might slow down v8 since it
  // doesn't like polymorphic functions.
  // return Math.min(Math.max(slice0, eo0), Math.max(slice1, eo1),
  //   Math.max(slice2, eo2));
};

// _computeCOEO generates the CO+EO table.
Phase1Heuristic.prototype._computeCOEO = function(moves) {
  // Set all the depths to 0x8.
  for (var i = 0; i < 2239488; ++i) {
    this.coEO[i] = 0x88;
  }
  
  // Each node is encoded as follows:
  // (LSB) (4 bits: depth) (11 bits: EO) (12 bits: CO)
  
  // States are hashed as follows:
  // (LSB) (11 bits: EO) (12 bits: CO)
  
  // Create the queue with the starting node. I found empirically that there
  // will never be more than 549711 nodes in the queue.
  var queue = new NumberQueue(549711);
  queue.push(1093 << 15);
  
  // Set the first node to have a depth of zero.
  this.coEO[1093 << 10] = 0x80;
  
  while (!queue.empty()) {
    // Shift a node and extract its fields.
    var node = queue.shift();
    var depth = node & 0xf;
    var eo = (node >>> 4) & 0x7ff;
    var co = (node >>> 15);
    
    // Apply moves to this state.
    for (var i = 0; i < 18; ++i) {
      var newEO = moves.eo[eo*18 + i];
      var newCO = moves.co[co*18 + i];
      var hash = newEO | (newCO << 11);
      
      // idx is the byte index of the hash.
      var idx = hash >>> 1;
      
      // shift is the bit offset for this hash. It is either 0 or 4.
      var shift = (hash & 1) << 2;
      
      if (((this.coEO[idx] >>> shift) & 0xf) === 0x8) {
        // Right now the bitfield contains 0x8, so we xor it with (depth+1)^8.
        // Think about it.
        this.coEO[idx] ^= ((depth + 1) ^ 0x8) << shift;
        if (depth < 6) {
          queue.push((depth + 1) | (hash << 4));
        }
      }
    }
  }
};

// _computeEOSlice generates the EOSlice table.
Phase1Heuristic.prototype._computeEOSlice = function(moves) {
  for (var i = 0; i < 1013760; ++i) {
    this.eoSlice[i] = 8;
  }
  
  // Each node is encoded as follows:
  // (LSB) (3 bits: depth) (11 bits: EO) (9 bits: slice)
  
  // States are hashed for eoSlice as follows:
  // (slice << 11) | EO.
  // In other words, shifting the node to the right by 3 bits gives you the hash
  // for that node (although I never actually use this, lol).
  
  // Generate the queue with the starting node. I have found empirically that
  // there are never more than 238263 nodes in the queue.
  var queue = new NumberQueue(238263);
  queue.push(220 << 14);
  
  // We have visited the first node.
  this.eoSlice[220 << 11] = 0;
  
  while (!queue.empty()) {
    // Shift the node and extract its bitfields.
    var node = queue.shift();
    var depth = node & 0x7;
    var eo = (node >>> 3) & 0x7ff;
    var slice = (node >>> 14);
    
    // Apply each move to the node.
    for (var i = 0; i < 18; ++i) {
      var newEO = moves.eo[eo*18 + i];
      var newSlice = moves.slice[slice*18 + i];
      var hash = (newSlice << 11) | newEO;
      if (this.eoSlice[hash] === 8) {
        this.eoSlice[hash] = depth + 1;
        if (depth < 6) {
          queue.push((depth + 1) | (hash << 3));
        }
      }
    }
  }
};

exports.Phase1Heuristic = Phase1Heuristic;
