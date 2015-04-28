var randomPermParity = includeAPI('perms').randomPermParity;

// Generate this using encodeCornerCases(findCornerCases()).
var allCornerCases = null;

function SkewbQueue() {
  this._first = null;
  this._last = null;
}

SkewbQueue.prototype.empty = function() {
  return this._first === null;
};

SkewbQueue.prototype.push = function(s) {
  if (this._first === null) {
    var node = {skewb: s, next: null};
    this._first = node;
    this._last = node;
  } else {
    var node = {skewb: s, next: this._first};
    this._first = node;
  }
};

SkewbQueue.prototype.shift = function() {
  var res = this._first.skewb;
  this._first = this._first.next;
  if (this._first === null) {
    this._last = null;
  }
  return res;
};

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
  var moves = allMoves();
  var nodes = new SkewbQueue();
  nodes.push(new Skewb());
  while (!nodes.empty()) {
    var node = nodes.shift();

    // Mark it as visited or continue if it was already visited.
    var enc = encodeCorners(node.corners);
    if (found.hasOwnProperty(enc)) {
      continue;
    }
    found[enc] = 1;

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
