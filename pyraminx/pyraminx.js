// A Pyraminx represents both the edges and the axial pieces (not including the tips) of the
// pyraminx.
//
// The axialTwists is an array of four numbers. Each number ranges between 0 and 2 (inclusive). A
// value of 0 means the corner is untwisted. 1 means that the corner is twisted clockwise. 2 means
// counter-clockwise.
function Pyraminx() {
  this.axialTwists = [0, 0, 0, 0];
  this.edges = new Edges();
}

// copy returns a deep copy of the Pyraminx.
Pyraminx.prototype.copy = function() {
  var res = new Pyraminx();
  for (var i = 0; i < 4; ++i) {
    res.axialTwists[i] = this.axialTwists[i];
  }
  res.edges = this.edges.copy();
  return res;
};

// move applies a move to the pyraminx.
Pyraminx.prototype.move = function(m) {
  this.edges.move(m);
  this.axialTwists[m.corner] += m.clockwise ? 1 : 2;
  if (this.axialTwists[m.corner] >= 3) {
    this.axialTwists[m.corner] -= 3;
  }
};

// solved returns true if the Pyraminx is solved.
Pyraminx.prototype.solved = function() {
  for (var i = 0; i < 4; ++i) {
    if (this.axialTwists !== 0) {
      return false;
    }
  }
  return this.edges.solved();
};

exports.Pyraminx = Pyraminx;
