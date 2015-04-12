var rubik = require('../../build/rubik.js');
var assert = require('assert');

function testCancelMoves() {
  var str = "R2 U D' F2 F' F' D L2 L' L R2 D2 U2 B2 B D2 L' L'";
  var moves = rubik.parseMoves(str);
  var cancelled = rubik.movesToString(rubik.cancelMoves(moves));
  assert(cancelled === "R2 U L2 R2 D2 U2 B' D2 L2", "Cancelling " +
    str + " resulted in " + cancelled);
}

testCancelMoves();
console.log('PASS');
