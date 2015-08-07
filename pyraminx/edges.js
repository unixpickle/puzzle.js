var EDGE_LF = 0;
var EDGE_RF = 1;
var EDGE_DF = 2;
var EDGE_LR = 3;
var EDGE_LD = 4;
var EDGE_RD = 5;

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
  this._piece = piece;
  this._orientation = orientation;
}

// Edges stores and manipulates an array of 6 Edge objects.
function Edges(pieces) {
  this._pieces = pieces;
}

// solved returns a set of solved Edges.
Edges.solved = function() {
  var pieces = [];
  for (var i = 0; i < 6; ++i) {
    pieces[i] = new Edge(i, true);
  }
  return new Edges(pieces);
};

// move applies a Move to the Edges.
Edges.prototype.move = function(m) {
  if (m.clockwise) {
    switch (m.corner) {
    case 0: // R
      var t = this._pieces[EDGE_RF];
      this._pieces[EDGE_RF] = this._pieces[EDGE_DF];
      this._pieces[EDGE_DF] = this._pieces[EDGE_RD];
      this._pieces[EDGE_RD] = t;
      this._pieces[EDGE_RF]._orientation = !this._pieces[EDGE_RF]._orientation;
      this._pieces[EDGE_RD]._orientation = !this._pieces[EDGE_RD]._orientation;
    case 1: // L
      var t = this._pieces[EDGE_LF];
      this._pieces[EDGE_LF] = this._pieces[EDGE_LD];
      this._pieces[EDGE_LD] = this._pieces[EDGE_DF];
      this._pieces[EDGE_DF] = t;
      this._pieces[EDGE_LF]._orientation = !this._pieces[EDGE_LF]._orientation;
      this._pieces[EDGE_DF]._orientation = !this._pieces[EDGE_DF]._orientation;
    case 2: // U
      var t = this._pieces[EDGE_LF];
      this._pieces[EDGE_LF] = this._pieces[EDGE_RF];
      this._pieces[EDGE_RF] = this._pieces[EDGE_LR];
      this._pieces[EDGE_LR] = t;
      this._pieces[EDGE_LF]._orientation = !this._pieces[EDGE_LF]._orientation;
      this._pieces[EDGE_LR]._orientation = !this._pieces[EDGE_LR]._orientation;
    case 3: // B
      var t = this._pieces[EDGE_LR];
      this._pieces[EDGE_LR] = this._pieces[EDGE_RD];
      this._pieces[EDGE_RD] = this._pieces[EDGE_LD];
      this._pieces[EDGE_LD] = t;
      this._pieces[EDGE_LD]._orientation = !this._pieces[EDGE_LD]._orientation;
      this._pieces[EDGE_RD]._orientation = !this._pieces[EDGE_RD]._orientation;
    }
  } else {
    switch (m.corner) {
    case 0: // R'
      var t = this._pieces[EDGE_RF];
      this._pieces[EDGE_RF] = this._pieces[EDGE_RD];
      this._pieces[EDGE_RD] = this._pieces[EDGE_DF];
      this._pieces[EDGE_DF] = t;
      this._pieces[EDGE_RF]._orientation = !this._pieces[EDGE_RF]._orientation;
      this._pieces[EDGE_DF]._orientation = !this._pieces[EDGE_DF]._orientation;
    case 1: // L'
      var t = this._pieces[EDGE_LF];
      this._pieces[EDGE_LF] = this._pieces[EDGE_DF];
      this._pieces[EDGE_DF] = this._pieces[EDGE_LD];
      this._pieces[EDGE_LD] = t;
      this._pieces[EDGE_LF]._orientation = !this._pieces[EDGE_LF]._orientation;
      this._pieces[EDGE_LD]._orientation = !this._pieces[EDGE_LD]._orientation;
    case 2: // U'
      var t = this._pieces[EDGE_LF];
      this._pieces[EDGE_LF] = this._pieces[EDGE_LR];
      this._pieces[EDGE_LR] = this._pieces[EDGE_RF];
      this._pieces[EDGE_RF] = t;
      this._pieces[EDGE_LF]._orientation = !this._pieces[EDGE_LF]._orientation;
      this._pieces[EDGE_RF]._orientation = !this._pieces[EDGE_RF]._orientation;
    case 3: // B'
      var t = this._pieces[EDGE_LR];
      this._pieces[EDGE_LR] = this._pieces[EDGE_LD];
      this._pieces[EDGE_LD] = this._pieces[EDGE_RD];
      this._pieces[EDGE_RD] = t;
      this._pieces[EDGE_LD]._orientation = !this._pieces[EDGE_LD]._orientation;
      this._pieces[EDGE_LR]._orientation = !this._pieces[EDGE_LR]._orientation;
    }
  }
};

// solved returns true if all the edges are permuted and oriented properly.
Edges.prototype.solved = function() {
  for (var i = 0; i < 6; ++i) {
    if (!this._pieces[i]._orientation || this._pieces[i]._piece !== i) {
      return false;
    }
  }
  return true;
};

exports.Edge = Edge;
exports.Edges = Edges;
