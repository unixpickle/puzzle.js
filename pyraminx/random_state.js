// randomState generates a random Pyraminx.
function randomState() {
  var res = new Pyraminx();

  for (var i = 0; i < 4; ++i) {
    res.axialTwists[i] = Math.floor(Math.random() * 3);
  }

  var perm = PermsAPI.randomPermParity(6, true);
  for (var i = 0; i < 6; ++i) {
    res.edges.edges[i].piece = perm[i];
  }

  var lastOrientation = true;
  for (var i = 0; i < 5; ++i) {
    if (Math.random() >= 0.5) {
      res.edges.edges[i].orientation = false;
      lastOrientation = !lastOrientation;
    }
  }
  res.edges.edges[5].orientation = lastOrientation;

  return res;
}

exports.randomState = randomState;
