 $(document).ready(()=>{
  	var start = false;
  	var s;
 	newGame();
 });
 
 function newGame(){
 	s = 0;
 	start = false;
  	setInterval(function(){
 		if(!start){
  			return;
  		}
		s++;
		$(".time").text(s);
 	},1000);
 
 	var boardWidth, boardHeight, minesNum;
 	var buttomClickedNum = 0;
 	var remaining;
 	var highScoreArray = new Array();	
 	var validBoard = 0;	
 	drawHighScoreTable();
 	$("#newGame").on("click", function(){
 		boardWidth = $("#width").val();
 		boardHeight = $("#height").val();
 		minesNum = $("#minesNum").val();
 		remaining = parseInt(minesNum);
 		$("#remainingMines").text(remaining);
 		var buttonArray;
		if (drawBoard(boardWidth, boardHeight, minesNum, validBoard) == 1) {
 			plantMines(boardWidth, boardHeight, minesNum);
 			markAllSurroundingMinesNum(boardWidth, boardHeight);
 			startGame(boardWidth, boardHeight, highScoreArray);	
 		}
 		else {
 			restart();
 		}
 	})
 	$("#restart").on("click", function(){
 		restart();
 	})
 }
 
//table implementation for board drawing
function drawBoard(width, height, minesNum, validBoard){
	if (width < 8 || width > 40 || height < 8 || height > 30) {
		alert("invalid dimension");
		return;
	}
	 if (minesNum < 0 || minesNum >= (width*height)) {
 		alert("invalid mines number");
 		return;
 	}
 	validBoard = 1;
	$("#container").append("<table id = 'gameTable' cellspacing='0'></table>");
	buttonArray = new Array(height);
	for (var i = 0; i < height; i++){
		buttonArray[i] = new Array(width);
		$("#gameTable").append("<tr class = 'tabrow' id = 'currow'></tr>");
		for (var j = 0; j < width; j++){
			var buttonToAdd = $("<button type = 'button' class = 'cell' style = 'height:40px;width:40px' data-isMined = '0' data-minesAround = '0' data-hasClicked = '0' data-row = '0' data-col = '0' data-flagged = '0'></button>");
			buttonToAdd.attr("data-row", i);
			buttonToAdd.attr("data-col", j);
			buttonArray[i][j] = buttonToAdd;
			$("#currow").append("<td class = 'tabdata' id = 'curdata'></td>");
			$("#curdata").append(buttonToAdd);
			$("#curdata").removeAttr("id");
		}
		$("#currow").removeAttr("id");
	}
	return validBoard;
}

function generateRandomNumber(max) {
	return (Math.floor(Math.random() * 1000) + 1)%max;
}

function plantMines(width, height, minesNum) {

 	var minePlanted = 0;
 	                      
 	while (minePlanted < minesNum){
 	
 		var a = generateRandomNumber(height);
 		var b = generateRandomNumber(width);

 		var isMine = buttonArray[a][b].attr("data-isMined");
 		if (isMine == 0) {
 			buttonArray[a][b].attr("data-isMined", "1");
 			//buttonArray[a][b].css("background-color", "orange");
 			minePlanted++;
 		}
 	}
}

//count the number of Mines surrounding buttonArray[x][y]
function countSurroundingMinesNum(x,y,width,height){
	var count = 0;
	//go up
	if (x != 0) {
		if (buttonArray[x-1][y].attr("data-isMined") == 1) { count++; }
	}
	//go down
	if (x != (height-1)) {
		if (buttonArray[x+1][y].attr("data-isMined") == 1) { count++; }
	}
	//go left
	if (y != 0) {
		if (buttonArray[x][y-1].attr("data-isMined") == 1) { count++; }
	}
	//go right
	if (y != (width-1)) {
		if (buttonArray[x][y+1].attr("data-isMined") == 1) { count++; }
	}
	//go upper left
	if (x != 0 && y != 0) {
		if (buttonArray[x-1][y-1].attr("data-isMined") == 1) { count++; }		
	}
	//go upper right
	if (x != 0 && y != (width-1)) {
		if (buttonArray[x-1][y+1].attr("data-isMined") == 1) { count++; }		
	}
	//go lower left
	if (x != (height-1) && y != 0) {
		if (buttonArray[x+1][y-1].attr("data-isMined") == 1) { count++; }		
	}
	//go lower right
	if (x != (height-1) && y != (width-1)) {
		if (buttonArray[x+1][y+1].attr("data-isMined") == 1) { count++; }		
	}
	buttonArray[x][y].attr("data-minesAround", count);
}

function markAllSurroundingMinesNum(width, height) {
	for (var i = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			countSurroundingMinesNum(i,j,width, height);
		}	
	}
}

function startGame(width, height, highScoreArray){
	$(".cell").on("click", function(e){
		start = true;
		var x = $(this).attr("data-row");
		var y = $(this).attr("data-col");
		
		var hasClicked = $(this).attr("data-hasClicked");
		var flagged = $(this).attr("data-flagged");
		
		//if it has been flagged, user can unmark it (it has been clicked)
		if (flagged == 1) {
			if (e.shiftKey){
				$(this).attr("data-hasClicked", 0);
				$(this).attr("data-flagged", 0);
				$(this).find("i").remove();
				$(this).css("background-color","#A9A9A9");
    			let remaining = $("#remainingMines").text();
    			remaining++;
    			$("#remainingMines").text(remaining);
			}
		}
		//if it has not been flagged, and it has been clicked, check the number of the nearby mines and nearby flags, if equal, do recursively function
		else if (hasClicked == 1) {
			//if equals: recursion
			if ($(this).attr("data-minesAround") == checkSurroundingFlags(x,y,width,height)) {
				//recursive function here
				buttonArray[x][y].css("background-color","#808080");
		
				//go up
				if (x != 0) {
					if (buttonArray[x-1][y].attr("data-hasClicked") == 0){
						checkClicked(x-1, y, width, height, highScoreArray);
					}
				}
				//go down
				if (x != (height-1)) {
					if (buttonArray[parseInt(x)+1][y].attr("data-hasClicked") == 0){
						checkClicked(parseInt(x)+1, y, width, height, highScoreArray);
					}
				}
				//go left
				if (y != 0) {
					if (buttonArray[x][y-1].attr("data-hasClicked") == 0){
						checkClicked(x, y-1, width, height, highScoreArray);
					}
				}
				//go right
				if (y != (width-1)) {
					if (buttonArray[x][parseInt(y)+1].attr("data-hasClicked") == 0){
						checkClicked(x, parseInt(y)+1, width, height, highScoreArray);
					}
				}
				//go upper left
				if (x != 0 && y != 0) {
					if (buttonArray[x-1][y-1].attr("data-hasClicked") == 0){
						checkClicked(x-1, y-1, width, height, highScoreArray);
					}
				}
				//go upper right
				if (x != 0 && y != (width-1)) {
					if (buttonArray[x-1][parseInt(y)+1].attr("data-hasClicked") == 0){
						checkClicked(x-1, parseInt(y)+1, width, height, highScoreArray);
					}
				}
				//go lower left
				if (x != (height-1) && y != 0) {
					if (buttonArray[parseInt(x)+1][y-1].attr("data-hasClicked") == 0){
						checkClicked(parseInt(x)+1, y-1, width, height, highScoreArray);
					}
				}
				//go lower right
				if (x != (height-1) && y != (width-1)) {
					if (buttonArray[parseInt(x)+1][parseInt(y)+1].attr("data-hasClicked") == 0){
						checkClicked(parseInt(x)+1, parseInt(y)+1, width, height, highScoreArray);
					}
				}
			}//end of if equals: recursion
		}//end of if: if it has not been flagged, and it has been clicked, check the number of the nearby mines and nearby flags, if equal, do recursively function
		
		//if it has never been clicked, then this is a newly clicked button (two situations: normal click or mark flag)
		else {
			//set hasClicked to 1
			$(this).attr("data-hasClicked", 1);
			//check win 
			//checkWin(width, height);
			
			//if it is to mark flag
			if (e.shiftKey){
				//alert("shift left hit");
				$(this).attr("data-flagged", 1);
    			$(this).append("<i class='fas fa-flag'></i>");
    			$(this).css("background-color","#808080");
    			let remaining = $("#remainingMines").text();
    			remaining--;
    			$("#remainingMines").text(remaining);
    			checkWin(width, height, highScoreArray);	
			}
			//if it is just a normal click
			else {		
				checkClicked(x,y,width,height, highScoreArray);
			}
		}//end for else: if has not been clicked, then this is a newly clicked button


	})
}

function checkWin(width, height, highScoreArray) {
	//if (parseInt($("#remainingMines").text()) == 0) {
		//let winFlag = 0; //default is lose
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				if (buttonArray[i][j].attr("data-hasClicked") == 0) {
					return;
				}
			}
		}
		//if (winFlag = 1) {
			alert("You win!!!");
			highScoreArray.push(parseInt($(".time").text()));
			//highScoreArray.sort();
			highScoreArray.sort(function(a, b){return a-b});
			$(".highScoreRow").remove();
			//if the number of items in this array is less than 5, run "length" time to add rows
			if (highScoreArray.length < 5) {
				for (var i = 0; i < highScoreArray.length; i++) {
					 $("#highScoreTable").append("<tr class = 'highScoreRow' id = 'currow'></tr>");
					 $("#currow").append("<td class = 'highScoreData' id = 'curdata'></td>");
					 $("#curdata").append(i+1);
					 $("#curdata").removeAttr("id");
					 $("#currow").append("<td class = 'highScoreData' id = 'curdata'></td>");
					 $("#curdata").append(highScoreArray[i]);
					 $("#curdata").removeAttr("id");
					 $("#currow").removeAttr("id");
				}
			}
			//if the number of items in this array is larger than 5, run 5 times to add rows
			else {
				for (var i = 0; i < 5; i++) {
					 $("#highScoreTable").append("<tr class = 'highScoreRow' id = 'currow'></tr>");
					 $("#currow").append("<td class = 'highScoreData' id = 'curdata'></td>");
					 $("#curdata").append(i+1);
					 $("#curdata").removeAttr("id");
					 $("#currow").append("<td class = 'highScoreData' id = 'curdata'></td>");
					 $("#curdata").append(highScoreArray[i]);
					 $("#curdata").removeAttr("id");
					 $("#currow").removeAttr("id");
				}
			}
			
			start = false;
			restart();
			//return;
		//}
	//}
} 

function lose(width, height){
	alert("You lose the game. Please press restart button to start a new game");
	start = false;
	for (var i  = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			if (buttonArray[i][j].attr("data-isMined") == 1) {
				buttonArray[i][j].append("<i class='fas fa-bomb'></i>");
			}
		}
	}
	//restart();
}

function checkClicked(x, y, width, height, highScoreArray) {

	let minesNum = buttonArray[x][y].attr("data-minesAround");
	let mine = buttonArray[x][y].attr("data-isMined");
	let flagged = buttonArray[x][y].attr("data-flagged");

	buttonArray[x][y].attr("data-hasClicked", 1);
	checkWin(width, height, highScoreArray);
	//if it has been flagged, do nothing (avoid getting into recursion)
	if (flagged == 1) {
		buttonArray[x][y].css("background-color","#808080");
	}
	
	//if it is a mine, game is over
	else if (mine == 1) {
		buttonArray[x][y].css("background-color","red");
		lose(width, height);
		return;
	}
	
	//it is not a mine, if the surrounding mine number is zero, automatically click all the nearby buttoms (do recursively)
	else if (minesNum == 0) {
		buttonArray[x][y].css("background-color","#808080");
		
		//go up
		if (x != 0) {
			if (buttonArray[x-1][y].attr("data-hasClicked") == 0){
				checkClicked(x-1, y, width, height, highScoreArray);
			}
		}
		//go down
		if (x != (height-1)) {
			if (buttonArray[parseInt(x)+1][y].attr("data-hasClicked") == 0){
				checkClicked(parseInt(x)+1, y, width, height, highScoreArray);
			}
		}
		//go left
		if (y != 0) {
			if (buttonArray[x][y-1].attr("data-hasClicked") == 0){
				checkClicked(x, y-1, width, height, highScoreArray);
			}
		}
		//go right
		if (y != (width-1)) {
			if (buttonArray[x][parseInt(y)+1].attr("data-hasClicked") == 0){
				checkClicked(x, parseInt(y)+1, width, height, highScoreArray);
			}
		}
		//go upper left
		if (x != 0 && y != 0) {
			if (buttonArray[x-1][y-1].attr("data-hasClicked") == 0){
				checkClicked(x-1, y-1, width, height, highScoreArray);
			}
		}
		//go upper right
		if (x != 0 && y != (width-1)) {
			if (buttonArray[x-1][parseInt(y)+1].attr("data-hasClicked") == 0){
				checkClicked(x-1, parseInt(y)+1, width, height, highScoreArray);
			}
		}
		//go lower left
		if (x != (height-1) && y != 0) {
			if (buttonArray[parseInt(x)+1][y-1].attr("data-hasClicked") == 0){
				checkClicked(parseInt(x)+1, y-1, width, height, highScoreArray);
			}
		}
		//go lower right
		if (x != (height-1) && y != (width-1)) {
			if (buttonArray[parseInt(x)+1][parseInt(y)+1].attr("data-hasClicked") == 0){
				checkClicked(parseInt(x)+1, parseInt(y)+1, width, height, highScoreArray);
			}
		}
	}//end of else if: recursive call
	
	//if it is not a mine, and the surrounding mine number is not zero, and the mine flag number do not equal, display the number, no need to recursively check for surroundings
	else if(minesNum != 0) {
		buttonArray[x][y].text(minesNum);
		buttonArray[x][y].css("background-color","#808080");
		buttonArray[x][y].attr("data-hasClicked", 1);
	}
	
}

//count how many flags have been marked surrounding a button
function checkSurroundingFlags(x, y, width, height){
	var flagCount = 0;
	//go up
	if (x != 0) {
		if (buttonArray[x-1][y].attr("data-flagged") == 1) { flagCount++; }
	}
	//go down
	if (x != (height-1)) {
		if (buttonArray[parseInt(x)+1][y].attr("data-flagged") == 1) { flagCount++; }
	}
	//go left
	if (y != 0) {
		if (buttonArray[x][y-1].attr("data-flagged") == 1) { flagCount++; }
	}
	//go right
	if (y != (width-1)) {
		if (buttonArray[x][parseInt(y)+1].attr("data-flagged") == 1) { flagCount++; }
	}
	//go upper left
	if (x != 0 && y != 0) {
		if (buttonArray[x-1][y-1].attr("data-flagged") == 1) { flagCount++; }	
	}
	//go upper right
	if (x != 0 && y != (width-1)) {
		if (buttonArray[x-1][parseInt(y)+1].attr("data-flagged") == 1) { flagCount++; }		
	}
	//go lower left
	if (x != (height-1) && y != 0) {
		if (buttonArray[parseInt(x)+1][y-1].attr("data-flagged") == 1) { flagCount++; }	
	}
	//go lower right
	if (x != (height-1) && y != (width-1)) {
		if (buttonArray[parseInt(x)+1][parseInt(y)+1].attr("data-flagged") == 1) { flagCount++; }
	}
	return flagCount;
}


function restart () {
		$("#width").val("");
 		$("#height").val("");
 		$("#minesNum").val("");
 		$("#remainingMines").html("");
 		$("#gameTable").remove();
 		$("#gameTable").removeAttr("id");
 		$(".time").text("");
 		s = 0;
 		start = false;
}

function drawHighScoreTable() {
 		$("#highScoreContainer").append("<br><span id = 'HSHeading'>High Scores (Top 5)</span><br>");
 		$("#highScoreContainer").append("<table id = 'highScoreTable'></table>");
 		$("#highScoreTable").append("<tr class = 'highScoreHead' id = 'currow'></tr>");
 		$("#currow").append("<th class = 'highScoreHead'>Rank</th>");
 		$("#currow").append("<th class = 'highScoreHead'>Time</th>");
 		$("#currow").removeAttr("id");
}












