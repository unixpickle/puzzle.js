(function() {

  function Corner(piece, orientation) {
    this.piece = piece;
    this.orientation = orientation;
  }
  
  Corner.prototype.copy = function() {
    return new Corner(this.piece, this.orientation);
  };

  function Skewb() {
    this.centers = [0, 1, 2, 3, 4, 5];
    this.corners = [];
    for (var i = 0; i < 8; ++i) {
      this.corners.push(new Corner(i, 0));
    }
  }
  
  Skewb.prototype.copy = function() {
    var res = Object.create(Skewb.prototype);
    res.centers = this.centers.slice();
    res.corners = [];
    for (var i = 0; i < 8; ++i) {
      res.corners[i] = this.corners[i].copy();
    }
    return res;
  }

})();
