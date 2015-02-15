// Generate this using makeCenterHeuristic().
var centerHeuristicData = null;

// Generate this using makeCOHeuristic().
var coHeuristicData = null;

function centerHeuristic(state) {
  if (centerHeuristicData === null) {
    centerHeuristicData = makeCenterHeuristic();
  }
  return centerHeuristicData[encodeCenters(state)];
}

function coHeuristic(state) {
  if (coHeuristicData === null) {
    coHeuristicData = makeCOHeuristic();
  }
  return coHeuristicData[encodeCO(state)];
}

function depthFirst(start, remaining, lastFace) {
  if (remaining === 0) {
    if (!start.solved()) {
      return null;
    } else {
      return [];
    }
  } else if (coHeuristic(start.corners) > remaining ||
      centerHeuristic(start.centers) > remaining) {
    return null;
  }
  
  for (var i = 0; i < 4; ++i) {
    if (i === lastFace) {
      continue;
    }
    for (var j = 0; j < 2; ++j) {
      var move = {face: i, clock: j===0};
      var state = start.copy();
      state.move(move);
      var solution = depthFirst(state, remaining-1, i);
      if (solution !== null) {
        return [move].concat(solution);
      }
    }
  }
  return null;
}

function encodeCO(corners) {
  var res = '';
  for (var i = 0; i < 8; ++i) {
    res += corners[i].orientation;
  }
  return res;
}

function encodeCenters(centers) {
  var res = '';
  for (var i = 0; i < 6; ++i) {
    res += centers[i];
  }
  return res;
}

function makeCOHeuristic() {
  var res = {};
  var nodes = [{state: new Skewb(), depth: 0}];
  var moves = allMoves();
  while (nodes.length > 0) {
    var node = nodes[0];
    nodes.splice(0, 1);
    
    // Check if the state has been visited before.
    var idx = encodeCO(node.state.corners);
    if (res.hasOwnProperty(idx)) {
      continue;
    }
    res[idx] = node.depth;
    
    // Branch out.
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newNode = node.state.copy();
      newNode.move(moves[i]);
      nodes.push({state: newNode, depth: node.depth+1});
    }
  }
  return res;
}

function makeCenterHeuristic() {
  var res = {};
  var nodes = [{state: new Skewb(), depth: 0}];
  var moves = allMoves();
  while (nodes.length > 0) {
    var node = nodes[0];
    nodes.splice(0, 1);
    
    // Check if the state has been visited before.
    var idx = encodeCenters(node.state.centers);
    if (res.hasOwnProperty(idx)) {
      continue;
    }
    res[idx] = node.depth;
    
    // Branch out.
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newNode = node.state.copy();
      newNode.move(moves[i]);
      nodes.push({state: newNode, depth: node.depth+1});
    }
  }
  return res;
}

function solve(state) {
  for (var i = 0; i < 11; ++i) {
    var solution = depthFirst(state, i, -1);
    if (solution !== null) {
      for (var i = 0, len = solution.length; i < len; ++i) {
        solution[i] = new Move(solution[i].face, solution[i].clock);
      }
      return solution;
    }
  }
  return null;
}

exports.solve = solve;
