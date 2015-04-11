function randomState() {
  var result = new Cube();
  
  // NOTE: we do not use pocketcube.randomState() because that state will always
  // leave the BDL corner solved. For 3x3 we don't want this restriction.
  
  // Generate a random permutation.
  var pieces = perms.randomPerm(8);
  for (var i = 0; i < 8; ++i) {
    result.corners.corners[i].piece = pieces[i];
  }
  
  // Generate random orientations for the first 7 corners.
  for (var i = 0; i < 7; ++i) {
    result.corners.corners[i].orientation = Math.floor(Math.random() * 3);
  }
  
  // Compute the last corner's orientation. This uses the sune combo (which
  // twists two adjacent corners) to "solve" every corner except the last one.
  // The twist of the last corner (which started out solved) tells us which
  // orientation it should have had.
    
  // All corners in this ordering are adjacent, allowing the sune combo to work.
  var ordering = [0, 1, 5, 4, 6, 2, 3, 7];
  var orientations = [];
  for (var i = 0; i < 8; ++i) {
    orientations[i] = result.corners.corners[ordering[i]].orientation;
  }
  for (var i = 0; i < 7; ++i) {
    var thisOrientation = orientations[i];
    var nextOrientation = orientations[i+1];
    // Twist thisOrientation to be solved, affecting the next corner in the
    // sequence.
    if (thisOrientation === 2) {
      // y -> x, x -> z, z -> y
      orientations[i+1] = (nextOrientation + 2) % 3;
    } else if (thisOrientation === 0) {
      // z -> x, x -> y, y -> z
      orientations[i+1] = (nextOrientation + 1) % 3;
    }
  }
  
  // The twist of the last corner is the inverse of what it should be in the
  // scramble.
  if (orientations[7] === 0) {
    result.corners.corners[7].orientation = 2;
  } else if (orientations[7] === 2) {
    result.corners.corners[7].orientation = 0;
  }
  
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

exports.randomState = randomState;