var PermsAPI = includeAPI('perms');

// A FullHeuristic keeps track of the number of moves needed to solve a given
// state of the Pocket Cube. It only tracks states up to a certain depth, since
// there are too many states to index and store in memory at once.
function FullHeuristic(depth) {
  this.depth = depth;
  this.table = {};

  // Do a breadth-first search to generate the heuristic table.
  var moves = basisMoves();
  var queue = [{depth: 0, cube: new Cube(), hash: '' + encodeCube(new Cube())}];
  var visited = {};
  while (queue.length > 0) {
    node = queue[0];
    queue.splice(0, 1);

    if (this.table.hasOwnProperty(node.hash)) {
      continue;
    }
    this.table[node.hash] = node.depth;

    if (node.depth === this.depth) {
      continue;
    }

    // Branch off.
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newCube = node.cube.copy();
      newCube.move(moves[i]);
      var newHash = '' + encodeCube(newCube);
      if (!visited[newHash]) {
        queue.push({depth: node.depth+1, cube: newCube, hash: newHash});
        visited[newHash] = true;
      }
    }
  }
}

// lookup returns the lower bound for the number of moves to solve a given cube.
FullHeuristic.prototype.lookup = function(cube) {
  var result = this.table[encodeCube(cube)];
  if ('undefined' === typeof result) {
    return this.depth + 1;
  }
  return result;
};

function encodeCO(cube) {
  var res = 0;
  var mul = 1;
  for (var i = 0; i < 7; ++i) {
    res += mul * cube.corners[i].orientation;
    mul *= 3;
  }
  return res;
}

function encodeCP(cube) {
  var permutation = [];
  for (var i = 0; i < 8; ++i) {
    permutation[i] = cube.corners[i].piece;
  }
  return PermsAPI.encodeDestructablePerm(permutation);
}

function encodeCube(cube) {
  return encodeCP(cube)*2187 + encodeCO(cube);
}

exports.FullHeuristic = FullHeuristic;
