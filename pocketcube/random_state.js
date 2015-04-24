var randomPerm = includeAPI('perms').randomPerm;

function randomLastLayer() {
  // Three random orientations and a solved corner.
  var orientations = [];
  for (var i = 0; i < 3; ++i) {
    orientations[i] = Math.floor(Math.random() * 3);
  }
  orientations[3] = 1;

  // Find the orientation of the last corner.
  var o = orientations.slice();
  for (var i = 0; i < 4; ++i) {
    var thisOrientation = o[i];
    var nextOrientation = o[i+1];
    if (thisOrientation === 2) {
      o[i+1] = (nextOrientation + 2) % 3;
    } else if (thisOrientation === 0) {
      o[i+1] = (nextOrientation + 1) % 3;
    }
  }
  if (o[3] === 0) {
    orientations[3] = 2;
  } else if (o[3] === 2) {
    orientations[3] = 0;
  }

  var cube = new Cube();
  var perm = randomPerm(4);
  var pieces = [2, 3, 7, 6];
  for (var i = 0; i < 4; ++i) {
    cube.corners[pieces[i]].piece = pieces[perm[i]];
    cube.corners[pieces[i]].orientation = orientations[i];
  }

  return cube;
}

function randomState() {
  var result = new Cube();

  // Generate a random permutation and random twists.
  // Corner 0 needs to stay solved so that no B, L, or D moves are needed.
  var pieces = randomPerm(7);
  for (var i = 0; i < 7; ++i) {
    result.corners[i + 1].piece = pieces[i] + 1;
  }
  for (var i = 1; i < 7; ++i) {
    result.corners[i].orientation = Math.floor(Math.random() * 3);
  }

  // Compute the last corner's orientation.
  // The way this works is based on the fact that a sune combo which twists two
  // adjacent corners is all that is necessary to generate any corner
  // orientation case.
  var ordering = [0, 1, 5, 4, 6, 2, 3, 7];
  var orientations = [];
  for (var i = 0; i < 8; ++i) {
    orientations[i] = result.corners[ordering[i]].orientation;
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
    result.corners[7].orientation = 2;
  } else if (orientations[7] === 2) {
    result.corners[7].orientation = 0;
  }

  return result;
}

exports.randomLastLayer = randomLastLayer;
exports.randomState = randomState;
