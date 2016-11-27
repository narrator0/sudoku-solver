/**
 * chunk 是一個九宮格，這個 array 為他們編號，左上角為一，中上為二以此類推
 * @type {Array}
 */
const SUDOKUCUNK = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

let sudokuArray = [];

for(let i = 0; i < 81; i++)
  sudokuArray.push(0);

let finished  = false,
    backwards = false,
    viewArray = [];

sudokuArray = parseSudoku(sudokuArray);

printResult();

$('#start-btn').click(function(){
  sudokuArray = [];
  $('#sudoku div').each(function(){
    sudokuArray.push(
      parseInt($(this).html())
    );
  });
  sudokuArray = parseSudoku(sudokuArray);
  finished = false;
  search(0);
});

$('#reset-btn').click(function(){
  $('#sudoku div').each(function(){
    $(this).html('0');
  });
});


function parseSudoku(array) {
  let markedSudoku = [];

  for(let i = 0; i < array.length; i++) {
    markedSudoku.push({
      data: sudokuArray[i],
      fixed: sudokuArray[i] == 0? false : true
    });
  }

  return markedSudoku;
}

function search(position) {
  // console.log(position);

  if(finished)
    return;

  if(position == sudokuArray.length) {
    printResult();
    finished = true;
    return; //search end do something
  }

  if(sudokuArray[position]['fixed']) {
    if(backwards)
      return;

    if(validateSudoku(position)) {
      backwards = false;
      search(position + 1);
    }
    else
      return;
  }else{
    for(let i = 1; i <= 9; i++) {
      sudokuArray[position]['data'] = i;

      if(validateSudoku(position)) {
        backwards = false;
        search(position + 1);
      }
    }
  }

  backwards = true;
}

function validateSudoku(position) {
  let row   = Math.floor(position / 9),
      col   = position % 9,
      chunk = SUDOKUCUNK[Math.floor(row / 3)][Math.floor(col / 3)];

  for(let i = 0; i < position; i++) {
    let iRow   = Math.floor(i / 9),
        iCol   = i % 9,
        iChunk = SUDOKUCUNK[Math.floor(iRow / 3)][Math.floor(iCol / 3)];

    if(iRow == row || iCol == col || iChunk == chunk)
      if(sudokuArray[position]['data'] == sudokuArray[i]['data'])
        return false;
  }

  return true;
}

function setViewArray() {
  viewArray = [];

  for(let i = 0; i < sudokuArray.length; i++) {
    viewArray.push(sudokuArray[i]['data']);
  }
}

function printResult() {
  let htmlText = "";

  for(let i = 0; i < sudokuArray.length; i++) {
    htmlText += `<div position="${i}">${sudokuArray[i]['data']}</div>`;

    if(i % 9 == 8)
      htmlText += '</br>';
  }

  $('#sudoku').html(htmlText);
}

let clicked = null;

$('#sudoku div').click(function(){
  setActiveDiv(this);
});

$(document).keypress(function(e){
  let pressedNumber = e.keyCode - 48;

  if(pressedNumber >= 0 && pressedNumber <= 9 && (typeof(clicked) == 'number')) {
    $(`#sudoku div[position=${clicked}]`).html(pressedNumber);
  }
});

$(document).keydown(function(e){
  if(e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 13) {
    switch(e.keyCode) {
      case 37:
        if(clicked != 0)
          clicked--;
        else
          clicked = 80;
        break;
      case 38:
        if(Math.floor(clicked / 9) != 0)
          clicked -= 9;
        else
          clicked += 72;
        break;
      case 39:
        if(clicked != 80)
          clicked++;
        else
          clicked = 0;
        break;
      case 40:
        if(Math.floor(clicked / 9) != 8)
          clicked += 9;
        else
          clicked -= 72;
        break;
      case 13:
        if(clicked != 80)
          clicked++;
        else
          clicked = 0;
        break;
    }
    setActiveDiv($(`#sudoku div[position=${clicked}]`));
  }
});

function setActiveDiv(self) {
  // clear all
  $('#sudoku div').removeClass('active');

  clicked = parseInt($(self).attr('position'));
  $(self).toggleClass('active');

}






