var randomPermParity = includeAPI('perms').randomPermParity;

// Generate this using encodeCornerCases(findCornerCases()).
var allCornerCases = null;

function decodeCorners(str) {
  var res = [];
  for (var i = 0; i < 8; ++i) {
    res[i] = new Corner(str.charCodeAt(i*2)-0x30, str.charCodeAt(i*2+1)-0x30);
  }
  return res;
}

function encodeCornerCases(cases) {
  var res = [];
  for (var i = 0, len = cases.length; i < len; ++i) {
    res[i] = encodeCorners(cases[i]);
  }
  return res;
}

function encodeCorners(corners) {
  var res = "";
  for (var i = 0; i < 8; i++) {
    res += corners[i].piece + '' + corners[i].orientation;
  }
  return res;
}

function findCornerCases() {
  var found = {};
  var cases = [];
  var nodes = [new Skewb()];
  var moves = allMoves();
  while (nodes.length > 0) {
    // Get the next node.
    var node = nodes[0];
    nodes.splice(0, 1);

    // Mark it as visited or continue if it was already visited.
    var enc = encodeCorners(node.corners);
    if (found.hasOwnProperty(enc)) {
      continue;
    }
    found[enc] = 1;

    // Branch out.
    cases.push(node.corners);
    for (var i = 0, len = moves.length; i < len; ++i) {
      var newNode = node.copy();
      newNode.move(moves[i]);
      nodes.push(newNode);
    }
  }
  return cases;
}

function randomCenters() {
  return randomPermParity(6, true);
}

function randomCorners() {
  if (allCornerCases === null) {
    allCornerCases = encodeCornerCases(findCornerCases());
  }
  var cornerIdx = Math.floor(Math.random() * allCornerCases.length);
  return decodeCorners(allCornerCases[cornerIdx]);
}

function randomState() {
  var res = new Skewb();
  res.centers = randomCenters();
  res.corners = randomCorners();
  return res;
}

exports.randomCenters = randomCenters;
exports.randomCorners = randomCorners;
exports.randomState = randomState;
