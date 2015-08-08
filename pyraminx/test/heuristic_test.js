var pyraminx = require('../../build/pyraminx.js');
var assert = require('assert');

function scrambleOfLength(len) {
  var scramble = [];
  while (len--) {
    scramble.push(new pyraminx.Move(Math.floor(Math.random()*4), Math.random()>=0.5));
  }
  return scramble;
}

function testEdgesHeuristic() {
  var heuristic = new pyraminx.EdgesHeuristic(7);
  // Make sure scrambles of a bunch of lengths work.
  for (var len = 0; len < 12; ++len) {
    for (var i = 0; i < 50; ++i) {
      var scramble = scrambleOfLength(len);
      var edges = new pyraminx.Edges();
      for (var j = 0; j < scramble.length; ++j) {
        edges.move(scramble[j]);
      }
      assert(heuristic.lowerBound(edges) <= scramble.length,
        "Heuristic overshot for: " + pyraminx.movesToString(scramble));
    }
  }
}

testEdgesHeuristic();
console.log('PASS');
