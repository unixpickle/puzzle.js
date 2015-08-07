var pyraminx = require('../../build/pyraminx.js');
var assert = require('assert');

function testMove() {
  var edges = new pyraminx.Edges();
  var moves = pyraminx.parseMoves("L' R U' R' U' R U B U B'");
  for (var i = 0, len = moves.length; i < len; ++i) {
    edges.move(moves[i]);
  }
  var pieces = [pyraminx.EDGE_RF, pyraminx.EDGE_LR, pyraminx.EDGE_RD, pyraminx.EDGE_LD,
    pyraminx.EDGE_LF, pyraminx.EDGE_DF];
  var orientations = [false, false, true, false, false, true];
  for (var i = 0; i < 6; ++i) {
    assert.equal(edges.edges[i].piece, pieces[i]);
    assert.equal(edges.edges[i].orientation, orientations[i]);
  }
}

testMove();
console.log('PASS');
