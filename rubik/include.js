// Import the pocketcube's move API.
var PocketCube = includeAPI('pocketcube');
var Corner = PocketCube.Corner;
var Corners = PocketCube.Cube;
var Move = PocketCube.Move;
var allMoves = PocketCube.allMoves;
var movesToString = PocketCube.movesToString;
var parseMove = PocketCube.parseMove;
var parseMoves = PocketCube.parseMoves;
exports.Move = Move;
exports.allMoves = allMoves;
exports.movesToString = movesToString;
exports.parseMove = parseMove;
exports.parseMoves = parseMoves;

// Import the permutation API.
var perms = includeAPI('perms');