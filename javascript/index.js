// ---------- Global ----------
let scoresTable = [
  10100,
  9000,
  1000
];

// ---------- Main screen ----------
function displayMainScreen() {
  // Init classes
  class SpaceshipObject {
    constructor(x, y, w, h, im) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.imageUrl = im;
    }
  };

  class ShotObject {
    constructor(x, y, w, h, im) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.imageUrl = im;
    }
  };

  class LetterObject {
    constructor(x, y, w, h, di, ch) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.yDirection = di
      this.char = ch;
    }
  };

  class LetterObjectInfo {
    constructor(x, y, ch) {
      this.xOff = x;
      this.yOff = y;
      this.char = ch;
    }
  };


  // Init arrays
    const templateWords = [
    "HOUSE",
    "CAT",
    "CIRCLE",
    "MOUSE",
    "CAR",
    "TABLE",
    "BUTTER",
    "KNIFE",
    "ROSE",
    "BOOKS"
  ];

  const flyingLetters = [
    "HFEODUSRELA",
    "DTGCSEAFTBQ",
    "ELRTCUNILCF",
    "MZODUEMRXPS",
    "FHCWRFQAJKI",
    "THUALWBTLSE",
    "BUSTATMELNR",
    "GKSEMFPENSI",
    "SLXEJROWDAU",
    "BQWGOZKSYOF"
  ];

  const alphabetChars = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
  ];

  let letterObjects = [];
  let letters = [];

  // Init constants
  const letterHorizGap = 17;
  const letterVertGap = 7;
  const shotHorizSpeed = 15;
  const alphabetCharactersNum = 26;
  
  // Init variables
  let energy = 90;
  let score = 0;
  let lives = 3;
  let nextLevel = false;
  let gameOver = false;

  let assembledWord = "      ";
  let startIndex = Math.floor(Math.random() * templateWords.length);
  let currentTemplateWord = templateWords[startIndex];

  let letterWidth = 50;
  let letterHeight = 40;

  let shotEnabled = false;
  let intervalId = null;


  // Init Canvas
  const canvasElem = document.querySelector("canvas");
  const ctx = canvasElem.getContext("2d");


  // Load picture files
  const bgImage = document.createElement("img");
  bgImage.src = "./images/Andromeda.png";
  bgImage.addEventListener(
    "load",
    () => {
    }
  );

  const spaceshipImage = document.createElement("img");
  spaceshipImage.src = "./images/Ships-4.png";
  spaceshipImage.addEventListener(
    "load",
    () => {
    }
  );

  const shotImage = document.createElement("img");
  shotImage.src = "./images/Shot-2.png";
  shotImage.addEventListener(
    "load",
    () => {
    }
  );

  const lifeImage = document.createElement("img");
  lifeImage.src = "./images/Ship-sm.png";
  lifeImage.addEventListener(
    "load",
    () => {
    }
  );

  const lettersImage = document.createElement("img");
  lettersImage.src = "./images/Charset_Alchemy-5.png";
  lettersImage.addEventListener(
    "load",
    () => {
    }
  );


  // Load sound files
  const posHitSound = new Audio("./samples/PosHit.mp3");
  posHitSound.addEventListener(
    "load",
    () => {
    }
  );
  
  const negHitSound = new Audio("./samples/NegHit.mp3");
  negHitSound.addEventListener(
    "load",
    () => {
    }
  );

  const gameOverSound = new Audio("./samples/GameOver.mp3");
  gameOverSound.addEventListener(
    "load",
    () => {
    }
  );

  const gameMusic = new Audio("./samples/RetroRulez.mp3");
  gameMusic.addEventListener(
    "load",
    () => {
    }
  );


  // Init game music
  gameMusic.loop="loop";
  gameMusic.play();


  // Init objects
  let xOff = 5;
  let yOff = 8;
  for (let i = 0; i < alphabetCharactersNum; i++) {
    letterObjectInfo = new LetterObjectInfo(
      xOff, 
      yOff, 
      alphabetChars[i]
    );
    letterObjects.push(letterObjectInfo);
    xOff += letterWidth + letterHorizGap;
    if (xOff > 608) {
      xOff = 5;
      yOff += letterHeight + letterVertGap;
    }
  }

  let spaceship = new SpaceshipObject(
    10, 
    canvasElem.height / 2, 
    163, 
    16, 
    spaceshipImage
  );

  let shot = new ShotObject(
    116, 
    canvasElem.height / 2, 
    23, 
    16, 
    shotImage
  );

  for (let i = 0; i < flyingLetters[startIndex].length; i++) {
    let x = canvasElem.width - (Math.floor(Math.random() * 500)) - (1*letterWidth);
    let y = letterHeight + (Math.floor(Math.random() * 500));
    let yDirection = 1 + (Math.floor(Math.random() * 3));
    let letterObject = new LetterObject(
      x, 
      y, 
      letterWidth, 
      letterHeight, 
      yDirection, 
      flyingLetters[startIndex][i]
    );
    letters.push(letterObject);
  }


  // Add event listeners

  // Handler for mouse move up or down
  const handleMouseUpDown = (e) => {
    if ((e.clientY > (4 * spaceship.height)) && (e.clientY < canvasElem.height - (8 * spaceship.height))) {
      spaceship.yPos = e.clientY;
    }
  }
  // Add handler for mouse move up or down
  document.addEventListener("mousemove", handleMouseUpDown);

  // Handler for click on left mouse button
  const handleLeftMouseButton = () => {
    shotEnabled = true;
    shot.yPos = spaceship.yPos + letterHorizGap;
  }
  // Add handler for click on left mouse button
  document.addEventListener("mousedown", handleLeftMouseButton);


  // Display background picture
  const displayBgPicture = () => {
    ctx.drawImage(
      bgImage, 
      0, 
      0
    );
  }

  // Display spaceship
  const displaySpaceship = () => {
    ctx.drawImage(
      spaceship.imageUrl, 
      0, 
      0, 
      110, 
      55, 
      spaceship.xPos, 
      spaceship.yPos, 
      110, 
      55
    );
  }

  // Display shot
  const shootBullet = () => {
    // only if shot enabled
    if (shotEnabled) {
      ctx.drawImage(
        shot.imageUrl, 
        shot.xPos, 
        shot.yPos
      );
      shot.xPos += shotHorizSpeed;
      // Check shot against right border
      if (shot.xPos > canvasElem.width) {
        shotEnabled = false;
        shot.xPos = 116;
      }
    }
  }

  // Check if missing letter was hit
  const checkMissingLetter = (i) => {
    // Insert hit letter in assembled word
    let buffer = "";
    let isLetter = false;
    for (let j = 0; j < currentTemplateWord.length; j++) {
      if (letters[i].char === currentTemplateWord[j]) {
        posHitSound.play();
        score += 100;
        isLetter = true;
        for (let k = 0; k < assembledWord.length; k++) {
          let char = assembledWord[k];
          (j !== k) 
            ? buffer += char 
            : buffer += letters[i].char;
        }
        assembledWord = buffer;
        // Clear hit letter in current template word
        buffer = currentTemplateWord.replace(letters[i].char, " ");
        currentTemplateWord = buffer;
        break;
      }
    }
    // Reduce energy if wrong letter was hit
    if (!(isLetter)) {
      negHitSound.play();
      if (energy > 30) {
        energy -= 30;
      }
      else {
        lives -= 1;
        (lives === 0) 
          ? gameOver = true 
          : energy = 90;        
      }
    }
    // Check if all missed letters are hit
    for (let k = 0; k < currentTemplateWord.length; k++) {
      if (currentTemplateWord[k] !== " ") {
        return;
      }
    }
    nextLevel = true;
  }
  // Check collision shot vs. letter(s)
  const checkLetterHit = (i) => {
    // ( shot.xr >= letter.xl ) && ( shot.xl <= letter.xr )
    const xCollisionCheck1 = ((shot.xPos + shot.width) >= letters[i].xPos) && (shot.xPos <= (letters[i].xPos + letters[i].width));
    // ( shot.yt >= letter.yt ) && ( shot.yt <= letter.yb )
    const yCollisionCheck1 = (shot.yPos >= letters[i].yPos) && (shot.yPos <= (letters[i].yPos + letters[i].height));
    // ( shot.yb <= letter.yb ) && ( shot.yt >= letter.yt )
    const yCollisionCheck2 = ((shot.yPos + shot.height) <= (letters[i].ypos + letters[i].height)) && (shot.yPos >= letters[i].yPos);
    if (xCollisionCheck1 && (yCollisionCheck1 || yCollisionCheck2)) {
      checkMissingLetter(i);
      letters.splice(i, 1);
      shotEnabled = false;
      shot.xPos = 116;
      return true;
    }
    return false;
  }

  // Display letters and do collision check if shot is enabled
  const moveLetters = () => {
    for (let i = 0; i < letters.length; i++) {
      let currentChar = letters[i].char;
      let currentLetterObject = null;
      for (j = 0; j < alphabetCharactersNum; j++) {
        if (currentChar === letterObjects[j].char) {
          currentLetterObject = letterObjects[j];
          break;
        }
      }
      ctx.drawImage(
        lettersImage, 
        currentLetterObject.xOff,
        currentLetterObject.yOff,
        letterWidth,
        letterHeight,
        letters[i].xPos, 
        letters[i].yPos,
        letterWidth,
        letterHeight
      );
      if (shotEnabled && checkLetterHit(i)) {
        continue;
      }
      // Top / bottom border check
      if ((letters[i].yPos < 0) || (letters[i].yPos > (600 - letterHeight))) {
        letters[i].yDirection *= - 1;
      }
      letters[i].yPos += letters[i].yDirection;
    }
  }

  // Display energy left at the left top of the screen
  const displayEnergy = () => {
    ctx.font = "22px Coda Caption";
    ctx.fillStyle = "orange";
    ctx.fillText(
      "Energy", 
      10, 
      30
    );
    ctx.fillStyle = "steelblue";
    ctx.fillRect(
      110, 
      15, 
      energy, 
      16
    );
  }

  // Display current player score in the centre of the top screen
  const displayScore = () => {
    let scoreStr = score.toString();
    scoreStr = scoreStr.padStart(6,0,0);
    ctx.font = "22px Coda Caption";
    ctx.fillStyle = "orange";
    ctx.fillText(
      `Score ${scoreStr}`,
      320,
      30
    );
  }

  // Display number of lives left at the right top of the screen
  const displayLives = () => {
    ctx.font = "22px Coda Caption";
    ctx.fillStyle = "orange";
    ctx.fillText(
      "Lives", 
      630, 
      30
    );
    // Display life symbols only if lives are left
    if (lives !== 0) {
      let livesStartXPos = 705;
      for (let i = 0; i < lives; i++) {
        ctx.drawImage(
          lifeImage, 
          livesStartXPos, 
          17
        );
        livesStartXPos += 30;
      }
    }
  }

  // Display template word at the left bottom of the screen
  const displayTemplateWord = () => {
    ctx.font = "40px Coda Caption";
    ctx.fillStyle = "steelblue";
    ctx.fillText(
      templateWords[startIndex], 
      10, 
      canvasElem.height - 15
    );
  }

  // Display assembled word at the right bottom of the screen
  const displayAssembledWord = () => {
    ctx.font = "40px Coda Caption";
    ctx.fillStyle = "orange";
    ctx.fillText(
      assembledWord, 
      620, 
      canvasElem.height - 15
    );
  }

  // Game loop
  const animateAll = () => {
    // Always display background picture
    displayBgPicture();
    // Next template word if all letters were hit
    if (nextLevel) {
      assembledWord = "      ";
      startIndex = Math.floor(Math.random() * templateWords.length);
      currentTemplateWord = templateWords[startIndex];
      letters = [];
      for (let i = 0; i < flyingLetters[startIndex].length; i++) {
        let x = canvasElem.width - (Math.floor(Math.random() * 500)) - (2 * letterWidth);
        let y = letterHeight + (Math.floor(Math.random() * 500));
        let yDirection = 1 + (Math.floor(Math.random() * 4));
        let letterObject = new LetterObject(
          x, 
          y, 
          letterWidth, 
          letterHeight, 
          yDirection, 
          flyingLetters[startIndex][i]
        );
        letters.push(letterObject);
      }
      nextLevel = false;
    }
    // Graphic elements only displayed if game not over
    if (!gameOver) {
      displaySpaceship();
      shootBullet();
      moveLetters();
      displayEnergy();
      displayScore();
      displayLives();
      displayTemplateWord();
      displayAssembledWord();
    }
    // Prepare game over
    else {
      gameOver = false;
      // DOM-Manipulation
      const gameContainerElem = document.getElementById("gameContainer");
      gameContainerElem.classList.remove("cursorOff");
      gameContainerElem.classList.add("cursorOn");
      // Stop interval
      clearInterval(intervalId);
      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseUpDown);
      document.removeEventListener("mousedown", handleLeftMouseButton);
      // Stop game music and play game over sound
      gameMusic.currentTime = 0; 
      gameMusic.pause(); 
      gameMusic.currentTime = 0;
      gameOverSound.play();
      // Start end screen
      displayEndScreen(score);
    }
  }

  // Handler for interval timer
  const handleIntervalTimer = () => {
    requestAnimationFrame(animateAll);
  }
  // Start game by interval
  intervalId = setInterval(
    handleIntervalTimer, 
    10
  );
}


// Display intro screen
const displayIntroScreen = () => {
  // Handler for click on start button
  const handleStartButton = () => {
    // DOM-Manipulation
    const introContainerElem = document.getElementById("introContainer");
    introContainerElem.classList.add("displayOff");
    const gameContainerElem = document.getElementById("gameContainer");
    gameContainerElem.classList.remove("displayOff");
    // Remove handler for click on start button
    const startButtonElem = document.getElementById("startButton");
    startButtonElem.removeEventListener("click", handleStartButton);
    // Start main screen
    displayMainScreen();
  }
  // Add handler for click on start button
  const startButtonElem = document.getElementById("startButton");
  startButtonElem.addEventListener("click", handleStartButton);
}


// Display end screen
const displayEndScreen = (score) => {
  // DOM-manipulation
  const gameContainerElem = document.getElementById("gameContainer");
  gameContainerElem.classList.add("displayOff");
  gameContainerElem.classList.remove("cursorOn");
  gameContainerElem.classList.add("cursorOff");
  const endContainerElem = document.getElementById("endContainer");
  endContainerElem.classList.remove("displayOff");
  // Insert score in highscore table and sort entries
  if ((scoresTable.length < 10) && (score !== 0)) {
    scoresTable.push(score);
    scoresTable.sort(
      (a, b) => {
        return b - a;
      }
    );
  }
  // Display highscore table
  const ulElem = document.getElementById("scoreList");
  ulElem.innerHTML = "" // clear the list
  for (let i = 0; i < scoresTable.length; i++) {
    let scoreStr = scoresTable[i].toString();
    scoreStr = scoreStr.padStart(6, 0, 0);
    const liElem = document.createElement("li");
    liElem.innerText = scoreStr;
    ulElem.appendChild(liElem);
  }
  // Handler for click on restart button
  const handleRestartButton = () => {
    // DOM manipulation
    const ulElem = document.getElementById("scoreList");
    ulElem.innerHTML = "";
    const endContainerElem = document.getElementById("endContainer");
    endContainerElem.classList.add("displayOff");
    const gameContainerElem = document.getElementById("gameContainer");
    gameContainerElem.classList.remove("displayOff");
    // Remove handler for click on restart button
    const restartButtonElem = document.getElementById("restartButton");
    restartButtonElem.removeEventListener("click", handleRestartButton);
    // Start main screen
    displayMainScreen();
  }
  // Add handler for click on restart button
  const restartButtonElem = document.getElementById("restartButton");
  restartButtonElem.addEventListener("click", handleRestartButton);
}


// Start intro screen
displayIntroScreen();