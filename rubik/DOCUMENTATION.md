# Documentation

This document will briefly highlight the functions and classes in the **rubik** library.

Currently, the library includes two APIs:

 * [The Cubie API](#docs-cubie-api)
 * [The Move API](#docs-move-api)

<a name="docs-cubie-api" />
# Cubie API

This API is for manipulating a cube or portions thereof in terms of physical pieces. This library exposes five classes and no methods.

This library exposes the following classes:

 * [CubieCorner](#docs-cubie-corner)
 * [CubieCorners](#docs-cubie-corners)
 * [CubieCube](#docs-cubie-cube)
 * [CubieEdge](#docs-cubie-edge)
 * [CubieEdges](#docs-cubie-edges)

<a name="docs-cubie-corner" />
## CubieCorner

The `CubieCorner` class represents a physical corner on a cube.

The constructor takes two arguments and can be called as follows from Node.js

    var rubik = require('./build/rubik.js');
    new rubik.CubieCorner(piece, orientation);

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieCorner(piece, orientation);

The class has the following properties:

 * `piece` - the corner's piece index.
 * `orientation` - 0, 1, or 2 to indicate the twist.

The class has the following methods:

 * `copy()` - generates a copy of the corner.

To understand the meaning of a corner's fields, you must first understand the coordinate system. There are there axes, x, y, and z. The x axis is 0 at the L face and 1 at the R face. The y axis is 0 at the D face and 1 at the U face. The z axis is 0 at the B face and 1 at the F face.

A corner piece's index is determined by it's original position on the cube. The index is a binary number of the form ZYX, where Z is the most significant digit. Thus, the BLD corner is 0, the BRU corner is 3, the FRU corner is 7, etc.

The orientation of a corner tells how it is twisted. It is an axis number 0, 1, or 2 for x, y, or z respectively. It indicates the direction normal to the red or orange sticker (i.e. the sticker that is usually normal to the x axis).

<a name="docs-cubie-corners" />
## CubieCorners

The `CubieCorners` class represents the physical corners on a cube.

The constructor creates a solved set of corners. It can be called as follows in Node.js:

    var rubik = require('./build/rubik.js');
    new rubik.CubieCorners();

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieCorners();

The class has the following properties:

 * `corners` - an array containing 8 instances of the `CubieCorner` class.

The class has the following methods:

 * `copy()` - generates a deep-copy of an instance
 * `halfTurn(face)` - performs a half turn on a face indexed 1 through 6.
 * `move(move)` - performs a `Move`.
 * `quarterTurn(face, turns)` - performs either 1 or -1 quarter turns on a face.

<a name="docs-cubie-cube" />
## CubieCube

The `CubieCube` class represents a physical cube consisting of edges and corners.

The constructor creates a solved cube. It can be called as follows in Node.js:

    var rubik = require('./build/rubik.js');
    new rubik.CubieCube();

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieCube();

The class has the following properties:

 * `corners` - an instance of the `CubieCorners` class.
 * `edges` - an instance of the `CubieEdges` class.

The class has the following methods:

 * `copy()` - generates a deep-copy of an instance
 * `halfTurn(face)` - performs a half turn on a face indexed 1 through 6.
 * `move(move)` - performs a `Move`.
 * `quarterTurn(face, turns)` - performs either 1 or -1 quarter turns on a face.

<a name="docs-cubie-edge" />
## CubieEdge

The `CubieEdge` class represents a physical edge on a cube.

The constructor takes two arguments and can be called as follows from Node.js

    var rubik = require('./build/rubik.js');
    new rubik.CubieEdge(piece, flip);

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieEdge(piece, flip);

The class has the following properties:

 * `piece` - the edge's piece index. Edges are indexed from 0 through 11 in the following order: UF, RF, DF, LF, UL, UR, BU, BR, BD, BL, DL, DR.
 * `flip` - a boolean which is true if the edge needs an F or B turn to be solved.

The class has the following methods:

 * `copy()` - generates a copy of the edge.

<a name="docs-cubie-edges" />
## CubieEdges

The `CubieEdges` class represents the physical edges on a cube.

The constructor creates a solved set of edges. It can be called as follows in Node.js:

    var rubik = require('./build/rubik.js');
    new rubik.CubieEdges();

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieEdges();

The class has the following properties:

 * `edges` - an array containing 12 instances of the `CubieEdge` class.

The class has the following methods:

 * `copy()` - generates a deep-copy of an instance
 * `halfTurn(face)` - performs a half turn on a face indexed 1 through 6.
 * `move(move)` - performs a `Move`.
 * `quarterTurn(face, turns)` - performs either 1 or -1 quarter turns on a face.

<a name="docs-move-api" />
# Move API

This API is for manipulating, parsing, and generating face turns. This library exposes one class and five functions.

It exposes the [Move](#docs-move) class.

It exposes the following functions:

 * [allMoves](#docs-all-moves)
 * [movesToString](#docs-moves-to-string)
 * [parseMove](#docs-parse-move)
 * [parseMoves](#docs-parse-moves)
 * [scrambleMoves](#docs-scramble-moves)

<a name="docs-move" />
## Move

The `Move` class represents a face turn on the cube.

The constructor takes two arguments and can be called as follows from Node.js

    var rubik = require('./build/rubik.js');
    new rubik.Move(face, turns);

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.Move(face, turns);

The class has the following properties:

 * `face` - the face, ranging from 1 to 6 to indicate U, D, F, B, R, and L respectively.
 * `turns` - 1 for a clockwise turn, -1 for a counterclockwise turn, and 2 for a half-turn.

The class has the following methods:

 * `axis` - returns the axis normal to the given face. This is 0 for R and L, 1 for U and D, and 2 for F and B.
 * `inverse` - returns the inverse of the move.
 * `toString` - returns the human-readable move in WCA notation.

<a name="docs-all-moves" />
## allMoves()

The `allMoves` function returns an array of moves corresponding to the following WCA moves: R, R', L, L', U, U', D, D', R2, L2, U2, D2, F2, B2, F, F', B, B'.

It can be called from Node.js as follows:

    var rubik = require('./build/rubik.js');
    rubik.allMoves();

And as follows in browser-side JavaScript:

    window.puzzlejs.rubik.allMoves();

The returned array will be a different copy every time. You may modify the returned array as you wish.

<a name="docs-moves-to-string" />
## movesToString()

The `movesToString` function takes an array of moves and turns it into an algorithm in WCA notation.

It can be called from Node.js as follows:

    var rubik = require('./build/rubik.js');
    rubik.movesToString(moves);

And as follows in browser-side JavaScript:

    window.puzzlejs.rubik.movesToString(moves);

<a name="docs-parse-move" />
## parseMove()

The `parseMove` function takes a string representing a single move in WCA notation and returns an instance of `Move`.

It can be called from Node.js as follows:

    var rubik = require('./build/rubik.js');
    rubik.parseMove(str);

And as follows in browser-side JavaScript:

    window.puzzlejs.rubik.parseMove(str);

An exception is thrown if the move is invalid.

<a name="docs-parse-moves" />
## parseMoves()

The `parseMoves` function takes a string representing a space-delimited list of moves in WCA notation and returns an array of instances of `Move`.

It can be called from Node.js as follows:

    var rubik = require('./build/rubik.js');
    rubik.parseMoves(str);

And as follows in browser-side JavaScript:

    window.puzzlejs.rubik.parseMoves(str);

An exception is thrown if one or more moves is invalid.

<a name="docs-scramble-moves" />
## scrambleMoves()

The `scrambleMoves` function takes a count argument and returns an array of instances of `Move`. The resulting array can be used as a scramble.

It can be called from Node.js as follows:

    var rubik = require('./build/rubik.js');
    rubik.scrambleMoves(count);

And as follows in browser-side JavaScript:

    window.puzzlejs.rubik.scrambleMoves(count);

The resulting moves will not do anything obviously redundant, like doing a move and then its inverse. It will also avoid silly things like "R L R' L'".
