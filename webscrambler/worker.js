self.onmessage = function(m) {
  var puzzle = m.puzzle;
  var scrambler = m.scrambler;
  var moves = m.moves;
  var scramble = self.puzzlejs.scrambler.generateScramble(puzzle, scrambler,
    moves);
  self.postMessage({id: m.id, scramble: scramble});
};