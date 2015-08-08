var EDGE_LF = 0;
var EDGE_RF = 1;
var EDGE_DF = 2;
var EDGE_LR = 3;
var EDGE_LD = 4;
var EDGE_RD = 5;

var PermsAPI = includeAPI('perms');

// An Edge represents a single edge on the pyraminx.
//
// The piece is a number between 0 and 5 (inclusive) representing the physical slot where the edge
// belongs on a solved pyraminx. Physical slots are indexed 0 through 5, denoting the LF, RF, DF,
// LR, LD, and RD edges respectively.
//
// The orientation is a boolean indicating whether or not the edge is "oriented". Solved edges are
// always oriented. The definition of orientation works as follows. Every physical edge piece has a
// primary sticker and a secondary sticker. For the LF, RF and DF edges, the F sticker is secondary.
// For the RD and LD edges, the D sticker is secondary. For the LR edge, the R sticker is secondary.
// An edge is considered oriented if its secondary sticker is in the same place as the secondary
// sticker of the physical slot where it is situated.
function Edge(piece, orientation) {
  this.piece = piece;
  this.orientation = orientation;
}

// Edges stores and manipulates an array of 6 Edge objects.
// If pieces is undefined, this will construct solved Edges.
function Edges(pieces) {
  if (pieces) {
    this.edges = pieces;
  } else {
    this.edges = [];
    for (var i = 0; i < 6; ++i) {
      this.edges[i] = new Edge(i, true);
    }
  }
}

// hash returns the perfect hash of the Edges.
Edges.prototype.hash = function() {
  var eo = 0;
  for (var i = 0; i < 5; ++i) {
    eo |= this.edges[i].orientation ? (1 << i) : 0;
  }
  var permutation = [];
  for (var i = 0; i < 6; ++i) {
    permutation[i] = this.edges[i].piece;
  }
  return PermsAPI.encodeDestructablePerm(permutation);
};

// move applies a Move to the Edges.
Edges.prototype.move = function(m) {
  if (m.clockwise) {
    switch (m.corner) {
    case 0: // R
      var t = this.edges[EDGE_RF];
      this.edges[EDGE_RF] = this.edges[EDGE_DF];
      this.edges[EDGE_DF] = this.edges[EDGE_RD];
      this.edges[EDGE_RD] = t;
      this.edges[EDGE_RF].orientation = !this.edges[EDGE_RF].orientation;
      this.edges[EDGE_RD].orientation = !this.edges[EDGE_RD].orientation;
      break;
    case 1: // L
      var t = this.edges[EDGE_LF];
      this.edges[EDGE_LF] = this.edges[EDGE_LD];
      this.edges[EDGE_LD] = this.edges[EDGE_DF];
      this.edges[EDGE_DF] = t;
      this.edges[EDGE_LF].orientation = !this.edges[EDGE_LF].orientation;
      this.edges[EDGE_DF].orientation = !this.edges[EDGE_DF].orientation;
      break;
    case 2: // U
      var t = this.edges[EDGE_LF];
      this.edges[EDGE_LF] = this.edges[EDGE_RF];
      this.edges[EDGE_RF] = this.edges[EDGE_LR];
      this.edges[EDGE_LR] = t;
      this.edges[EDGE_LF].orientation = !this.edges[EDGE_LF].orientation;
      this.edges[EDGE_LR].orientation = !this.edges[EDGE_LR].orientation;
      break;
    case 3: // B
      var t = this.edges[EDGE_LR];
      this.edges[EDGE_LR] = this.edges[EDGE_RD];
      this.edges[EDGE_RD] = this.edges[EDGE_LD];
      this.edges[EDGE_LD] = t;
      this.edges[EDGE_LD].orientation = !this.edges[EDGE_LD].orientation;
      this.edges[EDGE_RD].orientation = !this.edges[EDGE_RD].orientation;
      break;
    }
  } else {
    switch (m.corner) {
    case 0: // R'
      var t = this.edges[EDGE_RF];
      this.edges[EDGE_RF] = this.edges[EDGE_RD];
      this.edges[EDGE_RD] = this.edges[EDGE_DF];
      this.edges[EDGE_DF] = t;
      this.edges[EDGE_RF].orientation = !this.edges[EDGE_RF].orientation;
      this.edges[EDGE_DF].orientation = !this.edges[EDGE_DF].orientation;
      break;
    case 1: // L'
      var t = this.edges[EDGE_LF];
      this.edges[EDGE_LF] = this.edges[EDGE_DF];
      this.edges[EDGE_DF] = this.edges[EDGE_LD];
      this.edges[EDGE_LD] = t;
      this.edges[EDGE_LF].orientation = !this.edges[EDGE_LF].orientation;
      this.edges[EDGE_LD].orientation = !this.edges[EDGE_LD].orientation;
      break;
    case 2: // U'
      var t = this.edges[EDGE_LF];
      this.edges[EDGE_LF] = this.edges[EDGE_LR];
      this.edges[EDGE_LR] = this.edges[EDGE_RF];
      this.edges[EDGE_RF] = t;
      this.edges[EDGE_LF].orientation = !this.edges[EDGE_LF].orientation;
      this.edges[EDGE_RF].orientation = !this.edges[EDGE_RF].orientation;
      break;
    case 3: // B'
      var t = this.edges[EDGE_LR];
      this.edges[EDGE_LR] = this.edges[EDGE_LD];
      this.edges[EDGE_LD] = this.edges[EDGE_RD];
      this.edges[EDGE_RD] = t;
      this.edges[EDGE_LD].orientation = !this.edges[EDGE_LD].orientation;
      this.edges[EDGE_LR].orientation = !this.edges[EDGE_LR].orientation;
      break;
    }
  }
};

// solved returns true if all the edges are permuted and oriented properly.
Edges.prototype.solved = function() {
  for (var i = 0; i < 6; ++i) {
    if (!this.edges[i].orientation || this.edges[i].piece !== i) {
      return false;
    }
  }
  return true;
};

exports.Edge = Edge;
exports.Edges = Edges;
exports.EDGE_LF = EDGE_LF;
exports.EDGE_RF = EDGE_RF;
exports.EDGE_DF = EDGE_DF;
exports.EDGE_LR = EDGE_LR;
exports.EDGE_LD = EDGE_LD;
exports.EDGE_RD = EDGE_RD;
