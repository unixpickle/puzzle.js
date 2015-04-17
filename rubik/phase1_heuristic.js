// Phase1Heuristic stores the data needed to effectively prune the search for a
// solution for phase-1.
function Phase1Heuristic(moves) {
  // This stores the number of moves needed to solve both the corner 
  // orientations and the edge orientations for each case. Indices in this
  // array are computed as EdgeOrientations + CornerOrientations*2048.
  this.coEO = new CompactTable(4478976);

  // This stores the number of moves needed to solve the corner orientations and
  // to put the E slice edges in the E slice. Indices in this array are computed
  // as CornerOrientations + Slice*2187.
  this.coSlice = new CompactTable(1082565);
  
  // This stores the number of moves needed to both solve the edge orientations
  // and to put the E slice edges in the E slice. Indices in this array are
  // computed as EdgeOrientations + Slice*2048.
  this.eoSlice = new CompactTable(1013760);
  
  this._computeCOEO(moves);
  this._computeCOSlice(moves);
  this._computeEOSlice(moves);
}

// lowerBound returns the minimum number of moves needed to solve at least one
// phase-1 axis.
Phase1Heuristic.prototype.lowerBound = function(c) {
  var slice0 = this.eoSlice.get(c.xEO | (c.mSlice << 11));
  var slice1 = this.eoSlice.get(c.yEO | (c.eSlice << 11));
  var slice2 = this.eoSlice.get(c.zEO | (c.sSlice << 11));
  var eo0 = this.coEO.get(c.xEO | (c.xCO << 11));
  var eo1 = this.coEO.get(c.yEO | (c.yCO << 11));
  var eo2 = this.coEO.get(c.zEO | (c.zCO << 11));
  var coSlice0 = this.coSlice.get(c.xCO + c.mSlice*2187);
  var coSlice1 = this.coSlice.get(c.yCO + c.eSlice*2187);
  var coSlice2 = this.coSlice.get(c.zCO + c.sSlice*2187);
  
  // Return the least of the three heuristic values.
  // NOTE: we don't use polymorphic Math.max because it hurts some JS engines.
  var a = Math.max(Math.max(slice0, eo0), coSlice0);
  var b = Math.max(Math.max(slice1, eo1), coSlice1);
  var c = Math.max(Math.max(slice2, eo2), coSlice2);
  return Math.min(Math.min(a, b), c);
};

// _computeCOEO generates the CO+EO table.
Phase1Heuristic.prototype._computeCOEO = function(moves) {
  // Set all the depths to 8 since we will never search that deep.
  this.coEO.fillWith(8);
  
  // Each node is encoded as follows:
  // (LSB) (4 bits: depth) (11 bits: EO) (12 bits: CO)
  
  // States are hashed as follows:
  // (LSB) (11 bits: EO) (12 bits: CO)
  
  // Create the queue with the starting node. I found empirically that there
  // will never be more than 549711 nodes in the queue.
  var queue = new NumberQueue(549711);
  queue.push(1093 << 15);
  
  // Set the first node to have a depth of zero.
  this.coEO.set(1093 << 11, 0);
  
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
      if (this.coEO.get(hash) === 8) {
        this.coEO.set(hash, depth + 1);
        if (depth < 6) {
          queue.push((depth + 1) | (hash << 4));
        }
      }
    }
  }
};

Phase1Heuristic.prototype._computeCOSlice = function(moves) {
  this.coSlice.fillWith(0xf);
  
  // Each node is encoded as follows:
  // (LSB) (4 bits: depth) (12 bits: CO) (9 bits: slice)
  
  // States are hashed as CO + 2187*slice
  
  var queue = new NumberQueue(1000000);
  queue.push((1093 << 4) | (220 << 16));
  
  // Set the first node to have a depth of zero.
  this.coSlice.set(1093 + 2187*220, 0);
  
  while (!queue.empty()) {
    // Shift a node and extract its fields.
    var node = queue.shift();
    var depth = node & 0xf;
    var co = (node >>> 4) & 0xfff;
    var slice = (node >>> 16);
    
    // Apply moves to this state.
    for (var i = 0; i < 18; ++i) {
      var newSlice = moves.slice[slice*18 + i];
      var newCO = moves.co[co*18 + i];
      var hash = newCO + newSlice*2187;
      if (this.coSlice.get(hash) === 0xf) {
        this.coSlice.set(hash, depth + 1);
        queue.push((depth + 1) | (newCO << 4) | (newSlice << 16));
      }
    }
  }

  var arr = {};
  for (var i = 0; i < 2187*495; ++i) {
    var count = this.coSlice.get(i);
    if (arr[count]) {
      ++arr[count];
    } else {
      arr[count] = 1;
    }
  }
  console.log(arr);
};

// _computeEOSlice generates the EOSlice table.
Phase1Heuristic.prototype._computeEOSlice = function(moves) {
  // Set all the depths to 8 since that is as deep as we will search.
  this.eoSlice.fillWith(8);
  
  // Each node is encoded as follows:
  // (LSB) (3 bits: depth) (11 bits: EO) (9 bits: slice)
  
  // States are hashed for eoSlice as follows: (slice << 11) | EO.
  // In other words, shifting the node to the right by 3 bits gives you the hash
  // for that node (although I never actually use this, lol).
  
  // Generate the queue with the starting node. I have found empirically that
  // there are never more than 238263 nodes in the queue.
  var queue = new NumberQueue(238263);
  queue.push(220 << 14);
  
  // We have visited the first node.
  this.eoSlice.set(220 << 11, 0);
  
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
      if (this.eoSlice.get(hash) === 8) {
        this.eoSlice.set(hash, depth + 1);
        if (depth < 6) {
          queue.push((depth + 1) | (hash << 3));
        }
      }
    }
  }
};

exports.Phase1Heuristic = Phase1Heuristic;
