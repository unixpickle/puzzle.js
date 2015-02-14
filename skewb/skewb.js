function Corner(piece, orientation) {
  this.piece = piece;
  this.orientation = orientation;
}

Corner.prototype.copy = function() {
  return new Corner(this.piece, this.orientation);
};

function Skewb() {
  this.centers = [0, 1, 2, 3, 4, 5];
  this.corners = [];
  for (var i = 0; i < 8; ++i) {
    this.corners.push(new Corner(i, 0));
  }
}

Skewb.prototype.copy = function() {
  var res = Object.create(Skewb.prototype);
  res.centers = this.centers.slice();
  res.corners = [];
  for (var i = 0; i < 8; ++i) {
    res.corners[i] = this.corners[i].copy();
  }
  return res;
};

Skewb.prototype.move = function(move) {
  switch (move.face) {
  case 0:
    this.turnB(move.clock);
    break;
  case 1:
    this.turnL(move.clock);
    break;
  case 2:
    this.turnR(move.clock);
    break;
  case 3:
    this.turnU(move.clock);
    break;
  }
};

Skewb.prototype.rotateX = function() {
  // Permute the centers.
  var ref = this.centers[2];
  this.centers[2] = this.centers[1];
  this.centers[1] = this.centers[3];
  this.centers[3] = this.centers[0];
  this.centers[0] = ref;
  
  // Permute the corners.
  var ref1 = this.corners[6];
  this.corners[6] = this.corners[4];
  this.corners[4] = this.corners[0];
  this.corners[0] = this.corners[2];
  this.corners[2] = ref1;
  ref1 = this.corners[7];
  this.corners[7] = this.corners[5];
  this.corners[5] = this.corners[1];
  this.corners[1] = this.corners[3];
  this.corners[3] = ref1;
  
  // Swap the y and z orientations.
  for (var i = 0; i < 8; ++i) {
    if (this.corners[i].orientation === 1) {
      this.corners[i].orientation = 2;
    } else if (this.corners[i].orientation === 2) {
      this.corners[i].orientation = 1;
    }
  }
};

Skewb.prototype.rotateY = function() {
  // Permute the centers.
  var ref = this.centers[4];
  this.centers[4] = this.centers[3];
  this.centers[3] = this.centers[5];
  this.centers[5] = this.centers[2];
  this.centers[2] = ref;
  
  // Permute the corners.
  ref1 = this.corners[6];
  this.corners[6] = this.corners[7];
  this.corners[7] = this.corners[3];
  this.corners[3] = this.corners[2];
  this.corners[2] = ref1;
  ref1 = this.corners[4];
  this.corners[4] = this.corners[5];
  this.corners[5] = this.corners[1];
  this.corners[1] = this.corners[0];
  this.corners[0] = ref1;
  
  // Swap the x and z orientations.
  for (var i = 0; i < 8; ++i) {
    if (this.corners[i].orientation === 0) {
      this.corners[i].orientation = 2;
    } else if (this.corners[i].orientation === 2) {
      this.corners[i].orientation = 0;
    }
  }
};

Skewb.prototype.rotateZ = function() {
  // Permute the centers.
  var ref = this.centers[5];
  this.centers[5] = this.centers[1];
  this.centers[1] = this.centers[4];
  this.centers[4] = this.centers[0];
  this.centers[0] = ref;
  
  // Permute the corners.
  var ref1 = this.corners[0];
  this.corners[0] = this.corners[1];
  this.corners[1] = this.corners[3];
  this.corners[3] = this.corners[2];
  this.corners[2] = ref1;
  ref1 = this.corners[4];
  this.corners[4] = this.corners[5];
  this.corners[5] = this.corners[7];
  this.corners[7] = this.corners[6];
  this.corners[6] = ref1;
  
  // Swap the x and y orientations.
  for (var i = 0; i < 8; ++i) {
    if (this.corners[i].orientation === 0) {
      this.corners[i].orientation = 1;
    } else if (this.corners[i].orientation === 1) {
      this.corners[i].orientation = 0;
    }
  }
};

Skewb.prototype.solved = function() {
  for (var i = 0; i < 6; ++i) {
    if (this.centers[i] !== i) {
      return false;
    }
  }
  for (var i = 0; i < 8; ++i) {
    if (this.corners[i].piece !== i || this.corners[i].orientation !== 0) {
      return false;
    }
  }
  return true;
};

Skewb.prototype.turnB = function(clock) {
  // Permute corners.
  if (clock) {
    var ref = this.corners[1];
    this.corners[1] = this.corners[4];
    this.corners[4] = this.corners[2];
    this.corners[2] = ref;
  } else {
    var ref = this.corners[2]
    this.corners[2] = this.corners[4];
    this.corners[4] = this.corners[1];
    this.corners[1] = ref;
  }
  
  // Permute centers.
  if (clock) {
    var ref = this.centers[3];
    this.centers[3] = this.centers[1];
    this.centers[1] = this.centers[5];
    this.centers[5] = ref;
  } else {
    var ref = this.centers[5]
    this.centers[5] = this.centers[1];
    this.centers[1] = this.centers[3];
    this.centers[3] = ref;
  }
  
  // Orient corners.
  var corners = [0, 1, 2, 4];
  for (var idx = 0; idx < 4; ++idx) {
    var i = corners[idx];
    if (clock) {
      this.corners[i].orientation = (this.corners[i].orientation + 1) % 3;
    } else {
      this.corners[i].orientation = (this.corners[i].orientation + 2) % 3;
    }
  }
};

Skewb.prototype.turnL = function(clock) {
  // Permute corners.
  if (clock) {
    var ref = this.corners[0];
    this.corners[0] = this.corners[5];
    this.corners[5] = this.corners[6];
    this.corners[6] = ref;
  } else {
    var ref = this.corners[6]
    this.corners[6] = this.corners[5];
    this.corners[5] = this.corners[0];
    this.corners[0] = ref;
  }
  
  // Permute centers.
  if (clock) {
    var ref = this.centers[5];
    this.centers[5] = this.centers[1];
    this.centers[1] = this.centers[2];
    this.centers[2] = ref;
  } else {
    var ref = this.centers[2]
    this.centers[2] = this.centers[1];
    this.centers[1] = this.centers[5];
    this.centers[5] = ref;
  }
  
  // Orient corners.
  var corners = [0, 4, 6, 5];
  for (var idx = 0; idx < 4; ++idx) {
    var i = corners[idx];
    if (clock) {
      this.corners[i].orientation = (this.corners[i].orientation + 2) % 3;
    } else {
      this.corners[i].orientation = (this.corners[i].orientation + 1) % 3;
    }
  }
};

Skewb.prototype.turnR = function(clock) {
  // Permute corners.
  if (clock) {
    var ref = this.corners[5];
    this.corners[5] = this.corners[0];
    this.corners[0] = this.corners[3];
    this.corners[3] = ref;
  } else {
    var ref = this.corners[3]
    this.corners[3] = this.corners[0];
    this.corners[0] = this.corners[5];
    this.corners[5] = ref;
  }
  
  // Permute centers.
  if (clock) {
    var ref = this.centers[1];
    this.centers[1] = this.centers[3];
    this.centers[3] = this.centers[4];
    this.centers[4] = ref;
  } else {
    var ref = this.centers[4]
    this.centers[4] = this.centers[3];
    this.centers[3] = this.centers[1];
    this.centers[1] = ref;
  }
  
  // Orient corners.
  var corners = [0, 1, 3, 5];
  for (var idx = 0; idx < 4; ++idx) {
    var i = corners[idx];
    if (clock) {
      this.corners[i].orientation = (this.corners[i].orientation + 2) % 3;
    } else {
      this.corners[i].orientation = (this.corners[i].orientation + 1) % 3;
    }
  }
};

Skewb.prototype.turnU = function(clock) {
  // Permute corners.
  if (clock) {
    var ref = this.corners[3];
    this.corners[3] = this.corners[0];
    this.corners[0] = this.corners[6];
    this.corners[6] = ref;
  } else {
    var ref = this.corners[6]
    this.corners[6] = this.corners[0];
    this.corners[0] = this.corners[3];
    this.corners[3] = ref;
  }
  
  // Permute centers.
  if (clock) {
    var ref = this.centers[3];
    this.centers[3] = this.centers[5];
    this.centers[5] = this.centers[0];
    this.centers[0] = ref;
  } else {
    var ref = this.centers[0]
    this.centers[0] = this.centers[5];
    this.centers[5] = this.centers[3];
    this.centers[3] = ref;
  }
  
  // Orient corners.
  var corners = [0, 2, 3, 6];
  for (var idx = 0; idx < 4; ++idx) {
    var i = corners[idx];
    if (clock) {
      this.corners[i].orientation = (this.corners[i].orientation + 2) % 3;
    } else {
      this.corners[i].orientation = (this.corners[i].orientation + 1) % 3;
    }
  }
};

exports.Corner = Corner;
exports.Skewb = Skewb;
