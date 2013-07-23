function generateBoard() {

  var board = $('<div class="board"></board>');
  for(var i = 0; i < 8; i++) {
    var row = $('<div class="row"></div>');
    for(var j = 0; j < 15; j++) {
      var space = $('<div class="cell"></div>');
      if((j % 2 + i % 2) == 2) {
        space.addClass('table');
      }
      row.append(space);
    }
    board.append(row)
  }
  $('body').append(board);

}
