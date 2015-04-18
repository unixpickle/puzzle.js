var perms = includeAPI('perms');
var symmetry = includeAPI('symmetry');
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