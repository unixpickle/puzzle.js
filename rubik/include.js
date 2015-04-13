// Import the pocketcube's move API.
var pocketcube = includeAPI('pocketcube');
var Corner = pocketcube.Corner;
var Corners = pocketcube.Cube;
var Move = pocketcube.Move;
var allMoves = pocketcube.allMoves;
var movesToString = pocketcube.movesToString;
var parseMove = pocketcube.parseMove;
var parseMoves = pocketcube.parseMoves;
exports.Move = Move;
exports.allMoves = allMoves;
exports.movesToString = movesToString;
exports.parseMove = parseMove;
exports.parseMoves = parseMoves;

// Import the permutation API.
var perms = includeAPI('perms');

// Import the symmetry API.
var symmetry = includeAPI('symmetry');