# Documentation

This document will briefly highly the functions and classes in the **rubik** library.

# Cubie API

This API is for manipulating a cube or portions thereof in terms of physical pieces. This library exposes five classes and no methods.

This library exposes the following classes:

 * [CubieCorner](#docs-cubie-corner)
 * [CubieCorners](#docs-cubie-corners)
 * [CubieCube](#docs-cubie-cube)
 * [CubieEdge](#docs-cubie-edge)
 * [CubieEdges](#docs-cubie-edges)

<a name="docs-cubie-corner">
## CubieCorner

The `CubieCorner` class represents a physical corner on a cube.

The constructor takes two arguments and can be called as follows from Node.js

    var cubie = require('./cubie.js');
    new cubie.CubieCorner(piece, orientation);

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieCorner(piece, orientation);

The class has the following properties:

 * `piece` - the corner's piece index.
 * `orientation` - 0, 1, or 2 to indicate the twist.

The class has the following methods:

 * `copy()` - generates a copy of the corner.

To understand the meaning of a Corner's fields, you must first understand the coordinate system. There are there axes, x, y, and z. The x axis is 0 at the L face and 1 at the R face. The y axis is 0 at the D face and 1 at the U face. The z axis is 0 at the B face and 1 at the F face.

A corner piece's index is determined by it's original position on the cube. The index is a binary number of the form ZYX, where Z is the most significant digit. Thus, the BLD corner is 0, the BRU corner is 3, the FRU corner is 7, etc.

The orientation of a corner tells how it is twisted. It is an axis number 0, 1, or 2 for x, y, or z respectively. It indicates the direction normal to the red or orange sticker (i.e. the sticker that is usually normal to the x axis).

<a name="docs-cubie-corners">
## CubieCorners

The `CubieCorners` class represents the physical corners on a cube.

The constructor creates a solved set of corners. It can be called as follows in Node.js:

    var cubie = require('./cubie.js');
    new cubie.CubieCorners();

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieCorners();

The class has the following properties:

 * `corners` - an array containing 8 instances of the `CubieCorner` class.

The class has the following methods:

 * `copy()` - generates a deep-copy of an instance
 * `halfTurn(face)` - performs a half turn on a face indexed 1 through 6.
 * `move(move)` - performs a `Move`.
 * `quarterTurn(face, turns)` - performs either 1 or -1 quarter turns on a face.

<a name="docs-cubie-cube">
## CubieCube

The `CubieCube` class represents a physical cube consisting of edges and corners.

The constructor creates a solved cube. It can be called as follows in Node.js:

    var cubie = require('./cubie.js');
    new cubie.CubieCube();

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

<a name="docs-cubie-edge">
## CubieEdge

The `CubieEdge` class represents a physical edge on a cube.

The constructor takes two arguments and can be called as follows from Node.js

    var cubie = require('./cubie.js');
    new cubie.CubieEdge(piece, flip);

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieEdge(piece, flip);

The class has the following properties:

 * `piece` - the edge's piece index. Edges are indexed from 0 through 11 in the following order: UF, RF, DF, LF, UL, UR, BU, BR, BD, BL, DL, DR.
 * `flip` - true if the edge needs an F or B turn to be solved.

The class has the following methods:

 * `copy()` - generates a copy of the edge.

<a name="docs-cubie-edges">
## CubieEdges

The `CubieEdges` class represents the physical edges on a cube.

The constructor creates a solved set of edges. It can be called as follows in Node.js:

    var cubie = require('./cubie.js');
    new cubie.CubieEdges();

And as follows in browser-side JavaScript:

    new window.puzzlejs.rubik.CubieEdges();

The class has the following properties:

 * `edges` - an array containing 12 instances of the `CubieEdges` class.

The class has the following methods:

 * `copy()` - generates a deep-copy of an instance
 * `halfTurn(face)` - performs a half turn on a face indexed 1 through 6.
 * `move(move)` - performs a `Move`.
 * `quarterTurn(face, turns)` - performs either 1 or -1 quarter turns on a face.
