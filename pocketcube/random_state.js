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

  // Corner 0 needs to stay solved so that no B, L, or D moves are needed.
  var pieces = randomPerm(7);
  for (var i = 0; i < 7; ++i) {
    result.corners[i + 1].piece = pieces[i] + 1;
  }
  for (var i = 1; i < 7; ++i) {
    result.corners[i].orientation = Math.floor(Math.random() * 3);
  }
  result.fixLastCorner();

  return result;
}

exports.randomLastLayer = randomLastLayer;
exports.randomState = randomState;
