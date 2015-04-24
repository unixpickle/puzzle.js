(function() {

  // If this is not a Web Worker, do nothing.
  if ('undefined' === typeof self) {
    return;
  }

  self.onmessage = function(e) {
    var m = e.data;
    var puzzle = m.puzzle;
    var scrambler = m.scrambler;
    var moves = m.moves;
    var scramble = self.puzzlejs.scrambler.generateScramble(puzzle, scrambler,
      moves);
    self.postMessage({id: m.id, scramble: scramble});
  };

})();
