var scramblers = null;

function allPuzzles() {
  if (scramblers === null) {
    createScramblers();
  }
  
  var res = [];
  for (var i = 0, len = scramblers.length; i < len; ++i) {
    res[i] = scramblers[i].name;
  }
  return res;
}

function createScramblers() {
  scramblers = [
    {
      name: "2x2x2",
      scramblers: [
        {
          f: pocketState,
          moves: false,
          name: "State"
        },
        {
          f: pocketOptState,
          moves: false,
          name: "Optimal"
        },
        {
          f: pocketMoves,
          moves: true,
          name: "Moves"
        }
      ]
    },
    {
      name: "3x3x3",
      scramblers: [
        {
          f: rubikState,
          moves: false,
          name: "State"
        },
        {
          f: rubikMoves,
          moves: true,
          name: "Moves"
        },
        {
          f: rubikCOLL,
          moves: false,
          name: "COLL"
        },
        {
          f: rubikLastLayer,
          moves: false,
          name: "Last Layer"
        }
      ]
    },
    {
      name: "Skewb",
      scramblers: [
        {
          f: skewbState,
          moves: false,
          name: "State"
        },
        {
          f: skewbMoves,
          moves: true,
          name: "Moves"
        }
      ]
    }
  ];
}

function generateScramble(puzzle, scrambler, moves) {
  if (scramblers === null) {
    createScramblers();
  }
  
  // Find the info for the scrambler.
  var info = null;
  for (var i = 0, len = scramblers.length; i < len; ++i) {
    if (scramblers[i].name === puzzle) {
      var subs = scramblers[i].scramblers;
      for (var j = 0, len1 = subs.length; j < len1; ++j) {
        if (subs[j].name === scrambler) {
          info = subs[j];
          break;
        }
      }
    }
  }
  
  if (info === null) {
    throw new Error('unknown scrambler: ' + puzzle + '/' + scrambler);
  }
  if (info.moves) {
    return info.f(moves);
  } else {
    return info.f();
  }
}

function scramblersForPuzzle(puzzle) {
  for (var i = 0, len = scramblers.length; i < len; ++i) {
    if (scramblers[i].name === puzzle) {
      var res = [];
      var subs = scramblers[i].scramblers;
      for (var j = 0, len1 = subs.length; j < len1; ++j) {
        res[j] = {moves: subs[j].moves, name: subs[j].name};
      }
      return res;
    }
  }
  throw new Error('unknown puzzle: ' + puzzle);
}

exports.allPuzzles = allPuzzles;
exports.generateScramble = generateScramble;
exports.scramblersForPuzzle = scramblersForPuzzle;
