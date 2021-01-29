// Global
let scoresTable = [
  10100,
  9000,
  1000
];

// Main screen
function displayMainScreen() {
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
    "MZOIDUEMSRXPQ",
    "FHTCWRFQAJKIN",
    "THUALWYBTLSGE"
  ];

  const templateWords = [
    "HOUSE",
    "CAT",
    "MOUSE",
    "CAR",
    "TABLE"
  ];

  let letters = [];

  // Init variables
  let energy = 90;
  let score = 0;
  let lives = 3;
  let nextLevel = false;
  let gameOver = false;

  let assembledWord = "      ";
  let startIndex = Math.floor(Math.random()*templateWords.length);
  let currentTemplateWord = templateWords[startIndex];

  let letterXSize = 39;
  let letterYSize = 57;

  let dropEnabled = false;
  let intervalId = null;

  
  // Init Canvas
  let canvasElem = document.querySelector("canvas");
  let ctx = canvasElem.getContext("2d");
  // Load pictures
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
    let yDirection = 1 + (Math.floor(Math.random()*4));
    let letterObject = new LetterObject(x,y,width,height,yDirection,flyingLetters[startIndex][i]);
    letters.push(letterObject);
  }


 // Add event listeners

 // Handler for mouse move up or down
  function handleMouseUpDown(e) {
    if ((e.clientY > (4*pen.height)) && (e.clientY < canvasElem.height-(5*pen.height))) {
      pen.yPos = e.clientY;
    }
  }
  // Add handler for mouse move up or down
  document.addEventListener("mousemove",handleMouseUpDown);
  
  // Handler for click on left mouse button
  function handleLeftMouseButton() {
    dropEnabled = true;
    drop.yPos = pen.yPos;
  }
 // Add handler for click on left mouse button
  document.addEventListener("mousedown",handleLeftMouseButton);

  // Display background picture
  function displayBgPicture() {
    ctx.drawImage(bgImage, 0, 0);
  }
  // Display pen
  function displayPen() {
    ctx.drawImage(pen.imageUrl,pen.xPos,pen.yPos);
  }
  // Display ink shot
  function shootInk() {
    if (dropEnabled) {
      ctx.drawImage(drop.imageUrl,drop.xPos,drop.yPos);
      drop.xPos +=12;
      // Check right border
      if (drop.xPos > canvasElem.width) {
        dropEnabled = false;
        drop.xPos = 10+pen.width;
      }
    }
  }
  // Check if missing letter was hit
  function checkMissingLetter(i) {
    // Insert hit letter in assembled word
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
        // Clear hit letter in current template word
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
    // Reduce energy if wrong letter was hit
    if (!(isLetter)) {
      if (energy > 30) {
        energy -= 30;
      }
      else {
        lives -= 1;
        if (lives == 0) {
          gameOver = true;
        }
        else {
          energy = 90;
        }
      }
    }
    // Check if all missed letters are hit
    for (let k = 0; k < currentTemplateWord.length; k ++) {
      if (currentTemplateWord[k] !== " ") {
        return;
      }
    }
    nextLevel = true;
  }
  // Check collision shot vs. letter(s)
  function checkLetterHit(i) {
    // ( drop.xr >= letter.xl ) && ( drop.xl <= letter.xr )
    const xCollisionCheck1 = ((drop.xPos + drop.width) >= letters[i].xPos) && (drop.xPos <= (letters[i].xPos + letters[i].width));
    // ( drop.yt >= letter.yt ) && ( drop.yt <= letter.yb )
    const yCollisionCheck1 = (drop.yPos >= (letters[i].yPos - letters[i].height)) && (drop.yPos <= letters[i].yPos);
    // ( drop.yb <= letter.yb ) && ( drop.yt >= letter.yt )
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
  // Display letters and do collision check if shot is enabled
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
      // Top / bottom border check
      if ((letters[i].yPos < letterYSize) || (letters[i].yPos > 580)) {
        letters[i].yDirection *= - 1;
      }
      letters[i].yPos += letters[i].yDirection;
    }
  }
  // Display energy left at the left top of the screen
  function displayEnergy() {
    ctx.font = "25px Verdana";
    ctx.fillStyle = "orange";
    ctx.fillText("Energy",10,30);
    ctx.fillStyle = "steelblue";
    ctx.fillRect(110,10,energy,20);
  }
  // Display current player score in the centre of the top screen
  function displayScore() {
    let scoreStr = score.toString();
    scoreStr = scoreStr.padStart(6,0,0);
    ctx.font = "25px Verdana";
    ctx.fillStyle = "orange";
    ctx.fillText(`Score ${scoreStr}`,300,30);
  }
  // Display number of lives left at the right top of the screen
  function displayLives() {
    ctx.font = "25px Verdana";
    ctx.fillStyle = "orange";
    ctx.fillText("Lives",600,30);
    let livesStartXPos = 675;
    // Display life symbals only if lives are left
    if (lives !== 0) {
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(inkpotImage,livesStartXPos,5);
        livesStartXPos += 40;
      }
    }
  }
   // Display template word at the left bottom of the screen
  function displayTemplateWord() {
    ctx.font = "40px Verdana";
    ctx.fillStyle = "red";
    ctx.fillText(templateWords[startIndex],10,canvasElem.height-15);
  }
  // Display assembled word at the right bottom of the screen
  function displayAssembledWord() {
    ctx.font = "40px Verdana";
    ctx.fillStyle = "blue";
    ctx.fillText(assembledWord,600,canvasElem.height-15);
  }

  // Game loop
  function animateAll() {
    // Always display background picture
    displayBgPicture();
    // Next template word if all letters were hit
    if (nextLevel) {
      assembledWord = "      ";
      startIndex = Math.floor(Math.random()*templateWords.length);
      currentTemplateWord = templateWords[startIndex];
      letters = [];
      for (let i = 0; i < flyingLetters[startIndex].length; i++) {
        let x = canvasElem.width - (Math.floor(Math.random()*500)) - (2*letterXSize);
        let y = letterYSize + (Math.floor(Math.random()*500));
        let width = letterXSize;
        let height = letterYSize;
        let yDirection = 1 + (Math.floor(Math.random()*4));
        let letterObject = new LetterObject(x,y,width,height,yDirection,flyingLetters[startIndex][i]);
        letters.push(letterObject);
      }
      nextLevel = false;
    }
    // Gels only if game not over
    if (!gameOver) {
      displayPen();   
      shootInk();
      moveLetters();
      displayEnergy();
      displayScore();
      displayLives();
      displayTemplateWord();
      displayAssembledWord();
    }
    // Prepare game over
    else {
      // Enable mouse cursor
      canvasElem.classList.remove("cursorOff");
      canvasElem.classList.add("cursorOn");
      // Stop interval
      clearInterval(intervalId);
      document.removeEventListener("mousemove",handleMouseUpDown);
      document.removeEventListener("mousedown",handleLeftMouseButton);
      gameOver = false;
      displayEndScreen(score);
    }
  }

  // Handler for interval timer
  function handleIntervalTimer() {
    requestAnimationFrame(animateAll);
  }
  // Start game by interval
  intervalId = setInterval(handleIntervalTimer,10);  
}


// Display intro screen
function displayIntroScreen() {
  // Handler for click on start button
  function handleStartButton() {
    // DOM-Manipulation
    let introContainerElem = document.getElementById("introContainer");
    introContainerElem.classList.add("displayOff");
    let gameContainerElem = document.getElementById("gameContainer"); 
    gameContainerElem.classList.remove("displayOff");
    // Remove handler for click on start button
    let startButtonElem = document.getElementById("startButton");
    startButtonElem.removeEventListener("click",handleStartButton);
    // Start main screen
    displayMainScreen();
  }
  // Add handler for click on start button
  let startButtonElem = document.getElementById("startButton");
  startButtonElem.addEventListener("click",handleStartButton);
}


// End screen
function displayEndScreen(score) {
  // DOM-manipulation
  let gameContainerElem = document.getElementById("gameContainer");
  gameContainerElem.classList.add("displayOff");
  let endContainerElem = document.getElementById("endContainer"); 
  endContainerElem.classList.remove("displayOff");
  let canvasElem = document.querySelector("canvas");
  canvasElem.classList.remove("cursorOn");
  canvasElem.classList.add("cursorOff");

  // Insert score in highscore table and sort entries
  if ((scoresTable.length) < 10 && (score !==0)) {
    scoresTable.push(score);
    scoresTable.sort(
      function(a,b) {
        return b-a;
      }
    );
  }
  // Display highscore table
  let ulElem = document.getElementById("scoreList");
  ulElem.innerHTML = "" // clear the list
  for (let i = 0; i < scoresTable.length; i++) {
    let scoreStr = scoresTable[i].toString();
    scoreStr = scoreStr.padStart(6,0,0);
    let liElem = document.createElement("li");
    liElem.innerText = scoreStr;
    ulElem.appendChild(liElem);
  }
  // Handler for click on restart button
  function handleRestartButton() {
    // DOM manipulation
    let ulElem = document.getElementById("scoreList");
    ulElem.innerHTML = "";
    let endContainerElem = document.getElementById("endContainer");
    endContainerElem.classList.add("displayOff");
    let gameContainerElem = document.getElementById("gameContainer"); 
    gameContainerElem.classList.remove("displayOff");
    // Remove handler for click on restart button
    let restartButtonElem = document.getElementById("restartButton");
    restartButtonElem.removeEventListener("click",handleRestartButton);
    // Start main screen
    displayMainScreen();
  }
  // Add handler for click on restart button
  let restartButtonElem = document.getElementById("restartButton");
  restartButtonElem.addEventListener("click",handleRestartButton);
}


// Start intro screen
displayIntroScreen();