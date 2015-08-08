function pochmannScramble(length) {
  var lines = [];
  for (var i = 0; i < Math.ceil(length / 11); ++i) {
    var moves = [];
    var offset = Math.floor(Math.random() * 2);
    for (var j = offset; j < 10+offset; ++j) {
      var face = (j & 1) === 0 ? 'R' : 'D';
      var direction = Math.random() < 0.5 ? '--' : '++';
      moves.push(face + direction);
    }
    moves.push('U' + (Math.random() < 0.5 ? "'" : ''));
    lines.push('(' + moves.join(' ') + ')');
  }
  return lines.join(' ');
}

exports.pochmannScramble = pochmannScramble;
