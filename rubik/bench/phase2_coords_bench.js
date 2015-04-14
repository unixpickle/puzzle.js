var rubik = require('../../build/rubik.js');
var perms = require('../../build/perms.js');
var bench = require('../../bench.js');

function benchmarkPhase2CornerSym() {
  var perm8 = perms.allPerms(8);
  bench('Phase2CornerSym', function(n) {
    while (n--) {
      new rubik.Phase2CornerSym(perm8);
    }
  });
}

function benchmarkPhase2CornerSymMove() {
  // Apply all moves to a bunch of random symmetry coordinates.
  var states = [9634, 39604, 19667, 40733, 3187, 10589, 27264, 43833, 581,
    6282, 21757, 2189, 35665, 9221, 40164, 23510, 40687, 36973, 12676, 8060,
    25099, 10331, 21511, 3993, 44060, 22141, 28300, 3368, 35519, 27598, 17737,
    11378, 24311, 30289, 37587, 13416, 25342, 39266, 43774, 32655, 15217, 4445,
    2545, 34688, 29912, 2667, 1503, 15434, 38614, 11406];
  var sym = new rubik.Phase2CornerSym(perms.allPerms(8));
  bench('Phase2CornerSym.move', states.length*10, function(n) {
    for (var i = 0; i < n/(states.length*10); ++i) {
      for (var m = 0; m < 10; ++m) {
        for (var s = 0, len = states.length; s < len; ++s) {
          sym.move(states[s], m);
        }
      }
    }
  });
}

function benchmarkPhase2EdgeSym() {
  var perm8 = perms.allPerms(8);
  bench('Phase2EdgeSym', function(n) {
    while (n--) {
      new rubik.Phase2EdgeSym(perm8);
    }
  });
}

function benchmarkPhase2EdgeSymMove() {
  // Apply all moves to a bunch of random symmetry coordinates.
  var states = [9634, 39604, 19667, 40733, 3187, 10589, 27264, 43833, 581,
    6282, 21757, 2189, 35665, 9221, 40164, 23510, 40687, 36973, 12676, 8060,
    25099, 10331, 21511, 3993, 44060, 22141, 28300, 3368, 35519, 27598, 17737,
    11378, 24311, 30289, 37587, 13416, 25342, 39266, 43774, 32655, 15217, 4445,
    2545, 34688, 29912, 2667, 1503, 15434, 38614, 11406];
  var sym = new rubik.Phase2EdgeSym(perms.allPerms(8));
  bench('Phase2EdgeSym.move', states.length*10, function(n) {
    for (var i = 0; i < n/(states.length*10); ++i) {
      for (var m = 0; m < 10; ++m) {
        for (var s = 0, len = states.length; s < len; ++s) {
          sym.move(states[s], m);
        }
      }
    }
  });
}

function benchmarkPhase2SliceCoord() {
  var perm4 = perms.allPerms(4);
  bench('Phase2SliceCoord', function(n) {
    while (n--) {
      new rubik.Phase2SliceCoord(perm4);
    }
  });
}

function benchmarkPhase2SliceCoordMove() {
  // Apply all moves to a shuffled set of coordinates.
  var states = [20, 2, 1, 6, 4, 16, 10, 14, 0, 7, 5, 13, 17, 9, 22, 19, 12, 23,
    18, 8, 3, 11, 15, 21];
  var coord = new rubik.Phase2SliceCoord(perms.allPerms(4));
  bench('Phase2SliceCoord.move', 240, function(n) {
    for (var i = 0; i < n/240; ++i) {
      for (var m = 0; m < 10; ++m) {
        for (var s = 0; s < 24; ++s) {
          coord.move(states[s], m);
        }
      }
    }
  });
}

benchmarkPhase2CornerSym();
benchmarkPhase2CornerSymMove();
benchmarkPhase2EdgeSym();
benchmarkPhase2EdgeSymMove();
benchmarkPhase2SliceCoord();
benchmarkPhase2SliceCoordMove();