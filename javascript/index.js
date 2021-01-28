// Init arrays
let scoresTable = [
  12000,
  11100,
  10100,
  9000,
  50,
  10
];

let gameOver = false;


 // add event listener
 let startButtonElem = document.getElementById("startButton");
 startButtonElem.addEventListener(
   "click",
   function() {
     let introContainerElem = document.getElementById("introContainer");
     introContainerElem.classList.add("displayOff");
     let gameContainerElem = document.getElementById("gameContainer"); 
     gameContainerElem.classList.remove("displayOff");
     displayMainScreen();
   }
 );


// add event listener
let restartButtonElem = document.getElementById("restartButton");
restartButtonElem.addEventListener(
  "click",
  function() {
    gameOver = false;
    let ulElem = document.getElementById("scoreList");
    ulElem.innerHTML = "";
    console.log("Inside restart button");
    let endContainerElem = document.getElementById("endContainer");
    endContainerElem.classList.add("displayOff");
    let introContainerElem = document.getElementById("introContainer"); 
    introContainerElem.classList.remove("displayOff");
  }
);


function displayEndScreen(score) {
  let gameContainerElem = document.getElementById("gameContainer");
  gameContainerElem.classList.add("displayOff");
  let endContainerElem = document.getElementById("endContainer"); 
  endContainerElem.classList.remove("displayOff");

  

  if (scoresTable.length < 10) {
    scoresTable.push(score);
    scoresTable.sort((a,b) => b-a);


    /*for (let i = 0; i < scoresTable.length; i++) {
      if (score > scoresTable[i]) {
        scoresTable.splice(i,0,score);
        break;
      }
    }*/
  }

  let ulElem = document.getElementById("scoreList");
  ulElem.innerHTML = "" // clear the list
  console.log('ScORES', scoresTable.length)
  for (let i = 0; i < scoresTable.length; i++) {
    let scoreStr = scoresTable[i].toString();
    scoreStr = scoreStr.padStart(6,0,0);
    let liElem = document.createElement("li");
    liElem.innerText = scoreStr;
    ulElem.appendChild(liElem);
  }
 
}


function displayMainScreen() {
   console.log('Main screen called')
  // Init classes
  class PenObject {
    constructor(x,y,w,h,im) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.imageUrl = im;
    }
  }

  class DropObject {
    constructor(x,y,w,h,im) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.imageUrl = im;
    }
  }

  class LetterObject {
    constructor(x,y,w,h,di,ch) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.yDirection = di
      this.char = ch;
    }
  }

  // Init arrays
  const flyingLetters = [
    "HFEODUSRELAKM",
    "DTGCSEAFTGJBQ",
    "MZOIDUEMSRXPQ"
  ];

  const templateWords = [
    "HOUSE",
    "CAT",
    "MOUSE"
  ];

  let letters = [];

  // Init variables
  let energy = 90;
  let score = 0;
  let lives = 1;

  let assembledWord = "      ";
  let startIndex = Math.floor(Math.random()*templateWords.length);
  let currentTemplateWord = templateWords[startIndex];

  let letterXSize = 39;
  let letterYSize = 57;

  let dropEnabled = false;
  let intervalId = 0;

  
  // Init Canvas
  let canvasElem = document.querySelector("canvas");
  let ctx = canvasElem.getContext("2d");

  let bgImage = document.createElement("img");
  bgImage.src = './images/letters-picture_1280x712.jpg';
  bgImage.addEventListener(
    "load",
    function() {
    }
  );

  let penImage = document.createElement("img");
  penImage.src = './images/pen_163x16.jpg';
  penImage.addEventListener(
    "load",
    function() {
    }
  );

  let dropImage = document.createElement("img");
  dropImage.src = './images/drop_23x16.jpg';
  dropImage.addEventListener(
    "load",
    function() {
    }
  );

  let inkpotImage = document.createElement("img");
  inkpotImage.src = './images/inkpot_30x30.png';
  inkpotImage.addEventListener(
    "load",
    function() {
    }
  );


  // Init objects
  let pen = new PenObject(10,canvasElem.height/2,163,16,penImage);
  let drop = new DropObject(10+pen.width,canvasElem.height/2,23,16,dropImage);
  for (let i = 0; i < flyingLetters[startIndex].length; i++) {
    let x = canvasElem.width - (Math.floor(Math.random()*500)) - (2*letterXSize);
    let y = letterYSize + (Math.floor(Math.random()*500));
    let width = letterXSize;
    let height = letterYSize;
    let yDirection = 1 + (Math.floor(Math.random()*2));
    let letterObject = new LetterObject(x,y,width,height,yDirection,flyingLetters[startIndex][i]);
    letters.push(letterObject);
  }


 // Add event listeners
 document.addEventListener(
    "mousemove",
    function(e) {
      if ((e.clientY > (4*pen.height)) && (e.clientY < canvasElem.height-(5*pen.height))) {
        pen.yPos = e.clientY;
      }
    }
  );
  
  document.addEventListener(
    "mousedown",
    function() {
      dropEnabled = true;
      drop.yPos = pen.yPos;
    }
  );

  document.addEventListener(
    "keydown",
    function(event) {
     if ((event.keyCode == 27 || event.key == "Escape")) {
        clearInterval(intervalId);
        canvasElem.classList.remove("cursorOff");
        canvasElem.classList.add("cursorOn");
      }
    }
  );


  // Functions
  function displayBgPicture() {
    ctx.drawImage(bgImage, 0, 0);
  }

  function displayPen() {
    ctx.drawImage(pen.imageUrl,pen.xPos,pen.yPos);
  }

  function shootInk() {
    if (dropEnabled) {
      ctx.drawImage(drop.imageUrl,drop.xPos,drop.yPos);
      drop.xPos +=6;
      if (drop.xPos > canvasElem.width) {
        dropEnabled = false;
        drop.xPos = 10+pen.width;
      }
    }
  }

  function checkMissingLetter(i) {
    let buffer = "";
    let isLetter = false;
    for (let j = 0; j < currentTemplateWord.length; j++) {
      if (letters[i].char == currentTemplateWord[j]) {
        score += 100;
        isLetter = true;
        for (let k = 0; k < assembledWord.length; k++) {
          let char = assembledWord[k];
          if (j !== k) {
            buffer += char;
          }
          else {
            buffer += letters[i].char;
          }
        }
        assembledWord = buffer;
        buffer = "";
        for (let k = 0; k < currentTemplateWord.length; k++) {
          let char = currentTemplateWord[k];
          if (j !== k) {
            buffer += char;
          }
          else {
            buffer += " ";
          }
        }
        currentTemplateWord = buffer;
      }
    }
    if (!(isLetter)) {
      if (energy > 30) {
        energy -= 30;
      }
      else {
        energy = 90;
        lives -= 1;
      }
    }
  }

  function checkLetterHit(i) {
    const xCollisionCheck1 = ((drop.xPos + drop.width) >= letters[i].xPos) && (drop.xPos <= (letters[i].xPos + letters[i].width));
    const yCollisionCheck1 = (drop.yPos >= (letters[i].yPos - letters[i].height)) && (drop.yPos <= letters[i].yPos);
    const yCollisionCheck2 = ((drop.yPos + drop.height) <= letters[i].ypos) && ((drop.yPos + drop.height) >= (letters[i].yPos - letters[i].height));    
    if (xCollisionCheck1 && (yCollisionCheck1 || yCollisionCheck2)) {
      checkMissingLetter(i);
      letters.splice(i,1);
      dropEnabled = false;
      drop.xPos = 10+pen.width;
      return true;
    }
    return false;
  }

  function moveLetters() {
    ctx.font = "50px Verdana";
    ctx.fillStyle = "yellow";
    for (let i = 0; i < letters.length; i++) {
      ctx.fillText(letters[i].char,letters[i].xPos,letters[i].yPos);
      if (dropEnabled) {
        if (checkLetterHit(i)) {
          continue;
        }
      }
      if ((letters[i].yPos < letterYSize) || (letters[i].yPos > 580)) {
        letters[i].yDirection *= - 1;
      }
      letters[i].yPos += letters[i].yDirection;
    }
  }

  function displayEnergy() {
    ctx.font = "25px Verdana";
    ctx.fillStyle = "orange";
    ctx.fillText("Energy",10,30);
    ctx.fillStyle = "steelblue";
    ctx.fillRect(110,10,energy,20);
  }

  function displayScore() {
    let scoreStr = score.toString();
    scoreStr = scoreStr.padStart(6,0,0);
    ctx.font = "25px Verdana";
    ctx.fillStyle = "orange";
    ctx.fillText(`Score ${scoreStr}`,300,30);
  }

  function displayLives() {
    ctx.font = "25px Verdana";
    ctx.fillStyle = "orange";
    ctx.fillText("Lives",600,30);
    let x = 675;
    if (lives !== 0) {
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(inkpotImage,x,5);
        x += 40;
      }
    }
   }

  function displayTemplateWord() {
    ctx.font = "40px Verdana";
    ctx.fillStyle = "red";
    ctx.fillText(templateWords[startIndex],10,canvasElem.height-15);
  }

  function displayAssembledWord() {
    ctx.font = "40px Verdana";
    ctx.fillStyle = "blue";
    ctx.fillText(assembledWord,600,canvasElem.height-15);
  }

  function displayGameOver() {
    ctx.font = "80px Verdana";
    ctx.fillStyle = "red";
    ctx.fillText("GAME OVER",170,300);
  }

  // Game loop
  function animateAll() {
    displayBgPicture();
    if (lives > 0) {
      displayPen();   
      shootInk();
      moveLetters();
      displayEnergy();
      displayScore();
      displayLives();
      displayTemplateWord();
      displayAssembledWord();
    }
    else {
      clearInterval(intervalId);
      gameOver = true
    }

    if (gameOver) {
      gameOver = false;
      displayGameOver();
      canvasElem.classList.remove("cursorOff");
      canvasElem.classList.add("cursorOn");
      console.log('animate getting called')
      setTimeout(
        function() {
          displayEndScreen(score);
        },
        3000
      );
    }
  }



  // Start game
  intervalId = setInterval(
    function() {
      requestAnimationFrame(animateAll);
    }, 
    10
  );  
}

