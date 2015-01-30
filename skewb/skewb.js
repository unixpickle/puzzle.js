(function() {

  function Corner(piece, orientation) {
    this.piece = piece;
    this.orientation = orientation;
  }

  function Skewb() {
    this.centers = [0, 1, 2, 3, 4, 5];
    this.corners = [];
    for (var i = 0; i < 8; ++i) {
      this.corners.push(new Corner(i, 0));
    }
  }

})();
