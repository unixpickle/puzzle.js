function randomCorners() {
  var result = new Cube();

  var pieces = perms.randomPermParity(8, true);
  for (var i = 0; i < 8; ++i) {
    result.corners.corners[i].piece = pieces[i];
  }

  for (var i = 0; i < 7; ++i) {
    result.corners.corners[i].orientation = Math.floor(Math.random() * 3);
  }
  result.corners.fixLastCorner();

  return result;
}

function randomEdges() {
  var result = new Cube();

  var pieces = perms.randomPermParity(12, true);
  for (var i = 0; i < 12; ++i) {
    result.edges.edges[i].piece = pieces[i];
  }

  var flipLast = false;
  for (var i = 0; i < 11; ++i) {
    var flag = Math.random() >= 0.5;
    result.edges.edges[i].flip = flag;
    if (flag) {
      flipLast = !flipLast;
    }
  }
  result.edges.edges[11].flip = flipLast;

  return result;
}

function randomLastLayer() {
  var result = randomZBLL();

  // Generate the edge orientations.
  var topEdges = [0, 4, 5, 6];
  var lastFlip = false;
  for (var i = 0; i < 3; ++i) {
    var flip = Math.random() >= 0.5;
    if (flip) {
      lastFlip = !lastFlip;
      result.edges.edges[topEdges[i]].flip = true;
    }
  }
  result.edges.edges[topEdges[3]].flip = lastFlip;

  return result;
}

function randomState() {
  var result = new Cube();

  // NOTE: we do not use pocketcube.randomState() because that state will always
  // leave the BDL corner solved. For 3x3 we don't want this restriction.

  // Generate a random permutation.
  var pieces = perms.randomPerm(8);
  for (var i = 0; i < 8; ++i) {
    result.corners.corners[i].piece = pieces[i];
  }

  // Generate random orientations.
  for (var i = 0; i < 7; ++i) {
    result.corners.corners[i].orientation = Math.floor(Math.random() * 3);
  }
  result.corners.fixLastCorner();

  // Generate a random edge permutation.
  var cornerParity = perms.parity(pieces);
  var edgePerm = perms.randomPermParity(12, cornerParity);
  for (var i = 0; i < 12; ++i) {
    result.edges.edges[i].piece = edgePerm[i];
  }

  // Generate random EO.
  var parity = false;
  for (var i = 0; i < 11; ++i) {
    var flag = Math.random() >= 0.5;
    result.edges.edges[i].flip = flag;
    if (flag) {
      parity = !parity;
    }
  }
  result.edges.edges[11].flip = parity;

  return result;
}

function randomZBLL() {
  var result = new Cube();
  result.corners = pocketcube.randomLastLayer();

  var cornerPerm = [];
  for (var i = 0; i < 8; ++i) {
    cornerPerm[i] = result.corners.corners[i].piece;
  }
  var cornerParity = perms.parity(cornerPerm);

  var edgePerm = perms.randomPermParity(4, cornerParity);
  var topEdges = [0, 4, 5, 6];
  for (var i = 0; i < 4; ++i) {
    result.edges.edges[topEdges[i]].piece = topEdges[edgePerm[i]];
  }

  return result;
}

function random2GLL() {
  var result = new Cube();
  result.corners = pocketcube.randomLastLayer();

  var numCornerTurns = Math.floor(Math.random() * 4);
  var topCorners = [6, 2, 3, 7];
  for (var i = 0; i < 4; ++i) {
    var piece = topCorners[(i+numCornerTurns)%4];
    var slot = topCorners[i];
    var corner = result.corners.corners[slot];
    corner.piece = piece;
    corner.orientation = Math.floor(Math.random() * 3);
  }
  var cornerParity = (numCornerTurns%2 === 0);

  var edgePerm = perms.randomPermParity(4, cornerParity);
  var topEdges = [0, 4, 5, 6];
  for (var i = 0; i < 4; ++i) {
    result.edges.edges[topEdges[i]].piece = topEdges[edgePerm[i]];
  }

  return result;
}

exports.randomCorners = randomCorners;
exports.randomEdges = randomEdges;
exports.randomLastLayer = randomLastLayer;
exports.randomState = randomState;
exports.randomZBLL = randomZBLL;
exports.random2GLL = random2GLL;
