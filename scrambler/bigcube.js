function wcaMoves4x4(count) {
  return bigcubeWCAMoves(4, count);
}

function wcaMoves5x5(count) {
  return bigcubeWCAMoves(5, count);
}

function wcaMoves6x6(count) {
  return bigcubeWCAMoves(6, count);
}

function wcaMoves7x7(count) {
  return bigcubeWCAMoves(7, count);
}

function bigcubeWCAMoves(size, count) {
  return bigcube.wcaMovesToString(bigcube.wcaMoveScramble(size, count));
}
