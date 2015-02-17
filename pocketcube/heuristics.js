var PermsAPI = includeAPI('perms');

function FullHeuristic(depth) {
  this.depth = depth;
  this.table = {};
}

FullHeuristic.prototype.generate = function(moves) {
  var queue = [{depth: 0, cube: new Cube()}];
  while (queue.length > 0) {
    node = queue[0];
    queue.splice(0, 1);
    
    var key = '' + encodeCube(node.cube);
    if (this.table.hasOwnProperty(key)) {
      continue;
    }
    this.table[key] = node.depth;
    
    if (node.depth === this.depth) {
      continue;
    }
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newCube = node.cube.copy();
      newCube.move(moves[i]);
      queue.push({depth: node.depth+1, cube: newCube});
    }
  }
};

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
