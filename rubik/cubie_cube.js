(function() {

  /**
   * A Corner stores the piece index and orientation of a corner.
   *
   * To understand the meaning of a Corner's fields, you must first
   * understand the coordinate system. There are there axes, x, y, and z.
   * The x axis is 0 at the L face and 1 at the R face.
   * The y axis is 0 at the D face and 1 at the U face.
   * The z axis is 0 at the B face and 1 at the F face.
   *
   * A corner piece's index is determined by it's original position on the
   * cube. The index is a binary number of the form ZYX, where Z is the most
   * significant digit. Thus, the BLD corner is 0, the BRU corner is 3, the
   * FRU corner is 7, etc.
   *
   * The orientation of a corner tells how it is twisted. It is an axis number
   * 0, 1, or 2 for x, y, or z respectively. It indicates the direction normal
   * to the red or orange sticker (i.e. the sticker that is usually normal to
   * the x axis).
   */
  function Corner(piece, orientation) {
    this.piece = piece;
    this.orientation = orientation;
  }

  /**
   * Corners represent the corners of a cube.
   */
  function Corners() {
    this.corners = [];
    for (var i = 0; i < 8; ++i) {
      this.corners[i] = new Corner(i, 0);
    }
  }

  Corners.prototype.halfTurn = function(face) {
    switch (face) {
    case 1:
      var ref = this.corners[2];
      this.corners[2] = this.corners[7];
      this.corners[7] = ref;
      ref = this.corners[3];
      this.corners[3] = this.corners[6];
      this.corners[6] = ref;
      break;
    case 2:
      var ref = this.corners[0];
      this.corners[0] = this.corners[5];
      this.corners[5] = ref;
      ref = this.corners[1];
      this.corners[1] = this.corners[4];
      this.corners[4] = ref;
      break;
    case 3:
      var ref = this.corners[5];
      this.corners[5] = this.corners[6];
      this.corners[6] = ref;
      ref = this.corners[4];
      this.corners[4] = this.corners[7];
      this.corners[7] = ref;
      break;
    case 4:
      var ref = this.corners[0];
      this.corners[0] = this.corners[3];
      this.corners[3] = ref;
      ref = this.corners[1];
      this.corners[1] = this.corners[2];
      this.corners[2] = ref;
      break;
    case 5:
      var ref = this.corners[1];
      this.corners[1] = this.corners[7];
      this.corners[7] = ref;
      ref = this.corners[3];
      this.corners[3] = this.corners[5];
      this.corners[5] = ref;
      break;
    case 6:
      var ref = this.corners[0];
      this.corners[0] = this.corners[6];
      this.corners[6] = ref;
      ref = this.corners[2];
      this.corners[2] = this.corners[4];
      this.corners[4] = ref;
      break;
    default:
      break;
    }
  };

  Corners.prototype.quarterTurn = function(face, turns) {
    switch (face) {
    case 1:
      if (turns === 1) {
        var ref = this.corners[6];
        this.corners[6] = this.corners[7];
        this.corners[7] = this.corners[3];
        this.corners[3] = this.corners[2];
        this.corners[2] = ref;
      } else {
        var ref = this.corners[6];
        this.corners[6] = this.corners[2];
        this.corners[2] = this.corners[3];
        this.corners[3] = this.corners[7];
        this.corners[7] = ref;
      }
      var indices = [2, 3, 6, 7];
      for (var i = 0; i < 4; ++i) {
        var idx = indices[i];
        this.corners[idx].orientation = 2 - this.corners[idx].orientation;
      }
      break;
    case 2:
      break;
    case 3:
      break;
    case 4:
      break;
    case 5:
      break;
    case 6:
      break;
    }
  };

  function Cube() {
    this.edges = new Edges();
    this.corners = new Corners();
  }

  function Edges() {
    this.edges = [];
    for (var i = 0; i < 12; ++i) {
      this.edges[i] = new Edge(i, false);
    }
  }

  /**
   * An Edge represents a physical edge of a cube.
   *
   * Edges are indexed from 0 through 11 in the following order:
   * UF, RF, DF, LF, UL, UR, BU, BR, BD, BL, DL, DR.
   *
   * The flip field is true if the edge is "bad" in the ZZ color scheme (i.e.
   * if it requires an F or B move to fix).
   */
  function Edge(piece, flip) {
    this.piece = piece;
    this.flip = flip;
  }

  if 'undefined' !== typeof window {
    if (!window.puzzlejs) {
      window.puzzlejs = {};
    }
    window.puzzlejs.CubieCube = Cube;
  }
  if 'undefined' !== typeof module {
    if (!module.exports) {
      module.exports = {};
    }
    module.exports.CubieCube = Cube;
  }

})();
