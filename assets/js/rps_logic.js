$(document).ready(function () {



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA3lRjveBWsSHT8im6beQi5It4Ut4dRd5A",
    authDomain: "mutliplayer-rps.firebaseapp.com",
    databaseURL: "https://mutliplayer-rps.firebaseio.com",
    projectId: "mutliplayer-rps",
    storageBucket: "",
    messagingSenderId: "331054517332"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var playerOneRef = database.ref("playerOne");
var playerTwoRef = database.ref("playerTwo");
var playerTurn = database.ref("turn");
var gameResult = database.ref("result");
var gameLock = database.ref("Locks");

var p1Name = "";
var p2Name = "";
var p1Lose = 0;
var p1Win = 0;
var p2Lose = 0;
var p2Win = 0;
var tie = 0;
var turn = 1;
var p1Lock = 0;
var p2Lock = 0;
var p1Choice = "";
var p2Choice = "";
var gameNumber = 0;
var gameCycle;
var sessionP1 = sessionStorage.getItem("p1name");
var sessionP2 = sessionStorage.getItem("p2name");

// console.log(p1Name, p2Name);
  gameResult.on('value',function(snapshot){
  var dbValues = snapshot.val();
    gameNumber = dbValues.game;
    gameCycle = dbValues.gameCycle;
    // if ((gameCycle == true){
    //   $('.gameOn').css('display', 'none');
    //   $('#playCard').css('display', 'none');
    //   $('#player-container').css('display', 'none');
    //   $('.p1-choice').css('display', 'none');
    //   $('.p2-choice').hide();
    //   $('#gameOn').css('display', 'block');
    // }
    // console.log(p1Name)
    // if (p1Name != "" && p2Name == ""){

    // } else if (p1Name == "" && p2Name != ""){

    // } else{
    //   console.log("do nothing")
    // }
  });

// resetFireBaseValues()
    playerOneRef.on('value',function(snapshot){
    var dbValues = snapshot.val();
    // console.log(dbValues)
      p1Name = dbValues.name;
      p1Win = dbValues.win;
      p1Lose = dbValues.lose;
    // console.log(p1Lose, p1Name, p1Win)
    if (p1Name != "" ) {
    $('#p1-headScore').text(p1Name+"'s Score")
    $('#p1-wscore').text(p1Win);
    $("#p1-lscore").text(p1Lose);
    }
    });

    playerTwoRef.on('value',function(snapshot){
    var dbValues = snapshot.val();
      p2Name = dbValues.name;
      p2Win = dbValues.win;
      p2Lose = dbValues.lose;
    // console.log(p1Lose, p1Name, p1Win)
    if (p2Name != "" ) {
    $('#p2-headScore').text(p2Name+"'s Score")
    $('#p2-wscore').text(p2Win);
    $("#p2-lscore").text(p2Lose);
    }
    });
    playerTurn.on('value',function(snapshot){
    var dbValues = snapshot.val();
      turn = dbValues.turn;
    });
    gameResult.on('value',function(snapshot){
    var dbValues = snapshot.val();
      gameNumber = dbValues.game;
    });

    // Enter Player Name
    $("#p1-nameSubmit").on('click', function(event){
      event.preventDefault();
      p1Name = $('#p1-name').val().trim();
      sessionStorage.setItem("p1name", p1Name);
      $("#p1-nameSubmit").css('display', 'none');
      $('#p1-name').css('display', 'none');
      playerOneRef.update({
        name: p1Name,
        win: 0,
        lose: 0,
        choice: ""
      });
      // $('#p1-result').show();
    });
    $("#p2-nameSubmit").on('click', function(event){
      event.preventDefault();
      p2Name = $('#p2-name').val().trim();
      sessionStorage.setItem("p2name", p2Name);
      $("#p2-nameSubmit").css('display', 'none');
      $('#p2-name').css('display', 'none');
      playerTwoRef.update({
        name: p2Name,
        win: 0,
        lose: 0,
        choice: ""
      });
      gameResult.update({gameCycle: true})
      // $('#p1-result').show();
    });
//// On Click Rock Paper Scissors
    $('.p1-choice').on('click', function(event){
      console.log(turn)
      if (turn === 1){
        p1Choice = $(this).data('choice');
        p1ID = $(this).id;
        // showHideButtons(p1ID);
        console.log(p1Choice);
        playerTurn.update({turn: 2});
        gameLock.update({player1: 1});
        playerOneRef.update({choice: p1Choice});
        // gameCycle = true;
        $('.p1-choice').css('opacity', '.2')
        $('.p2-choice').css('opacity', '1.0')

      }
    });
    $('.p2-choice').on('click', function(event){
      if (turn === 2){
        p2Choice = $(this).data('choice');
        p2ID = $(this).attr('id');
        console.log(p2ID+"--> p2id")
        // showHideButtons(p2ID);
        console.log(p2Choice);
        playerTurn.update({turn: 1});
        gameLock.update({player2: 1})
        playerTwoRef.update({choice: p2Choice});
        $('.p2-choice').css('opacity', '.2')
        $('.p1-choice').css('opacity', '1.0')
        if (p1Lock != 1 && p2Lock != 1){
          // console.log("Game Not Started")
          playerTurn.update({turn: 1});
        }
        // if (gameNumber > 5){
        //   console.log("restart the game");
        // }
        gameLogic(p1Choice, p2Choice)
        gameNumber++;
        console.log("Game Cycle Completed")
        // gameCycle = true;
        gameResult.update({game: gameNumber})
        showAll();
      }
    });


//////////////////////////////////////////////
    function gameLogic(p1move, p2move){
      if (p1move === p2move){
       console.log("this is a Tie")
       $("#tieResult").css('display', 'block');
       setTimeout(function() {
         $("#tieResult").fadeOut('slow');
     }, 1000);
      }
      if (p1move === 'rock' && p2move === 'scissor') {
        p1Win++;
        p2Lose++;
        playerOneRef.update({win: p1Win})
        playerTwoRef.update({lose: p2Lose })
        console.log("p1 wins")
        $("#p1-result").css('display', 'block');
        setTimeout(function() {
          $("#p1-result").fadeOut('slow');
      }, 1000);
      }
      if (p1move === 'rock' && p2move === 'paper') {
        p2Win++;
        p1Lose++;
        playerTwoRef.update({win: p2Win})
        playerOneRef.update({lose: p1Lose })
        $("#p2-result").css('display', 'block');
        setTimeout(function() {
          $("#p2-result").fadeOut('slow');
      }, 1000);
      }
      if (p1move === 'paper' && p2move === 'rock') {
        p1Win++;
        p2Lose++;
        playerOneRef.update({win: p1Win})
        playerTwoRef.update({lose: p2Lose })
        console.log("p1 wins");
        $("#p1-result").css('display', 'block');
        setTimeout(function() {
          $("#p1-result").fadeOut('slow');
      }, 1000);
      }
      if (p1move === 'paper' && p2move === 'scissor') {
        p2Win++;
        p1Lose++;
        playerTwoRef.update({win: p2Win})
        playerOneRef.update({lose: p1Lose })
        console.log("p2 wins")
        $("#p2-result").css('display', 'block');
        setTimeout(function() {
          $("#p2-result").fadeOut('slow');
      }, 1000);
      }
      if (p1move === 'scissor' && p2move === 'paper') {
        p1Win++;
        p2Lose++;
        playerOneRef.update({win: p1Win})
        playerTwoRef.update({lose: p2Lose })
        console.log("p1 wins");
        $("#p1-result").css('display', 'block');
        setTimeout(function() {
          $("#p1-result").fadeOut('slow');
      }, 1000);
      }
      if (p1move === 'scissor' && p2move === 'rock') {
        p2Win++;
        p1Lose++;
        playerTwoRef.update({win: p2Win})
        playerOneRef.update({lose: p1Lose })
        console.log("p2 wins");
        $("#p2-result").css('display', 'block');
        setTimeout(function() {
          $("#p2-result").fadeOut('slow');
      }, 1000);
      }
  };
//// Reset FireBase DataBase
  function resetFireBaseValues() {
    playerOneRef.set({
      name: "",
      win: 0,
      lose: 0
    });
    playerTwoRef.set({
      name: "",
      win: 0,
      lose: 0
    });
    gameResult.set({gameCycle: true})
    playerTurn.set({turn: 1});
    gameLock.set({player1: 0});
    gameLock.set({player2: 0});

  };
// /// show and hide buttons
//   function showHideButtons(id){
//     if (id === 'p1-rock'){
//       $('#p1-paper').hide();
//       $('#p1-scissor').hide();
//     }
//     if( id === 'p1-paper'){
//       $('#p1-rock').hide();
//       $('#p1-scissor').hide();
//     }
//     if( id === 'p1-scissor'){
//       $('#p1-rock').hide();
//       $('#p1-paper').hide();
//     }
//     if (id === 'p2-rock'){
//       $('#p2-paper').hide();
//       $('#p2-scissor').hide();
//     }
//     if( id === 'p2-paper'){
//       $('#p2-rock').hide();
//       $('#p2-scissor').hide();
//     }
//     if( id === 'p2-scissor'){
//       $('#p2-rock').hide();
//       $('#p2-paper').hide();
//     }
//   }
  function showAll(){
    $('#p1-rock').show();
    $('#p1-paper').show();
    $('#p1-scissor').show();
    $('#p2-rock').show();
    $('#p2-paper').show();
    $('#p2-scissor').show();
  }
  });
