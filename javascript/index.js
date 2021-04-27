// ---------- Global ----------
// Initialize class
class ElementsObject {
  constructor(introContainer, startButton, gameContainer, canvas, endContainer, scoreList, scoreEntry, restartButton) {
    this.introContainer = introContainer;
    this.startButton = startButton;
    this.gameContainer = gameContainer;
    this.canvas = canvas;
    this.endContainer = endContainer;
    this.scoreList = scoreList;
    this.scoreEntry = scoreEntry;
    this.restartButton = restartButton;
  }
};

// Initialize array
const scoresTable = [
  10100,
  9000,
  1000
];

// Initialize object
const elements = new ElementsObject(
  document.querySelector("#introContainer"),
  document.querySelector("#startButton"),
  document.querySelector("#gameContainer"),
  document.querySelector("canvas"),
  document.querySelector("#endContainer"),
  document.querySelector("#scoreList"),
  null,
  document.querySelector("#restartButton")
);

// Initialize constants
const { introContainer, startButton, gameContainer, canvas, endContainer, scoreList, restartButton } = elements;


// ---------- Display game screen ----------
const displayGameScreen = () => {

  // Initialize classes
  class SpaceshipObject {
    constructor(xPosition, yPosition, width, height, imageUrl) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.width = width;
      this.height = height;
      this.imageUrl = imageUrl;
    }
  };

  class ShotObject {
    constructor(xPosition, yPosition , width, height, imageUrl) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.width = width;
      this.height = height;
      this.imageUrl = imageUrl;
    }
  };

  class LetterObject {
    constructor(xPosition, yPosition, width, height, yDirection, character) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.width = width;
      this.height = height;
      this.yDirection = yDirection
      this.character = character;
    }
  };

  class LetterSubRectangleObject {
    constructor(xOffset, yOffset, character ) {
      this.xOffset = xOffset;
      this.yOffset = yOffset;
      this.character = character;
    }
  };

  // Initialize arrays
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

  const alphabetCharacters = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
  ];

  const letterObjects = [];
  const letters = [];

  // Initialize constants
  const letterVerticalSpeed = 4;
  const letterWidth = 50;
  const letterHeight = 40;
  const letterHorizontalGap = 17;
  const letterVerticalGap = 7;
  const shotHorizontalSpeed = 15;
  const alphabetCharactersNum = 26;
  const renderingContext = canvas.getContext("2d");

  // Initialize variables
  let energy = 90;
  let score = 0;
  let lives = 3;
  let nextLevel = false;
  let gameOver = false;
  let shotEnabled = false;
  let intervalId = null;
  let assembledWord = "      ";
  let startIndex = Math.floor(Math.random() * templateWords.length);
  let oldStartIndex = startIndex;
  let currentTemplateWord = templateWords[startIndex];

  // Load background image
  const loadBgImage = () => {
    // Handler for load background image
    const handleBgImageLoad = () => {
      bgImage.removeEventListener(
        "load",
        handleBgImageLoad
      );
    }
    // Add handler for load background image
    const bgImage = document.createElement("img");
    bgImage.src = "./images/Andromeda.png";
    bgImage.addEventListener(
      "load",
      handleBgImageLoad
    );
    return bgImage;
  }

  // Load spaceship image
  const loadSpaceshipImage = () => {
    // Handler for load spaceship image
    const handleSpaceshipImageLoad = () => {
      spaceshipImage.removeEventListener(
        "load",
        handleSpaceshipImageLoad
      );
    }
    // Add handler for load spaceship image
    const spaceshipImage = document.createElement("img");
    spaceshipImage.src = "./images/Ships.png";
    spaceshipImage.addEventListener(
      "load",
      handleSpaceshipImageLoad
    );
    return spaceshipImage;
  }

  // Load shot image
  const loadShotImage = () => {
    // Handler for load shot image
    const handleShotImageLoad = () => {
      shotImage.removeEventListener(
        "load",
        handleShotImageLoad
      );
    }
    // Add handler for load shot image
    const shotImage = document.createElement("img");
    shotImage.src = "./images/Shot.png";
    shotImage.addEventListener(
      "load",
      handleShotImageLoad
    );
    return shotImage;
  }

  // Load life image
  const loadlifeImage = () => {
    // Handler for load life image
    const handleLifeImageLoad = () => {
      lifeImage.removeEventListener(
        "load",
        handleLifeImageLoad
      );
    }
    // Add handler for load life image
    const lifeImage = document.createElement("img");
    lifeImage.src = "./images/Ship-sm.png";
    lifeImage.addEventListener(
      "load",
      handleLifeImageLoad
    );
    return lifeImage;
  }

  // Load letters image
  const loadLettersImage = () => {
    // Handler for load letters image
    const handleLettersImageLoad = () => {
      lettersImage.removeEventListener(
        "load",
        handleLettersImageLoad
      );
    }
    // Add handler for load letters image
    const lettersImage = document.createElement("img");
    lettersImage.src = "./images/Characters-Set.png";
    lettersImage.addEventListener(
      "load",
      handleLettersImageLoad
    );
    return lettersImage;
  }

  // Load game music
  const loadGameMusic = () => {
    // Handler for load game music
    const handleGameMusicLoad = () => {
      gameMusic.removeEventListener(
        "load",
        handleGameMusicLoad
      );
    }
    // Add handler for load game music
    const gameMusic = new Audio("./sounds/RetroRulez.mp3");
    gameMusic.addEventListener(
      "load",
      handleGameMusicLoad
    );
    return gameMusic;
  }

  // Load positive hit sound
  const loadPositiveHitSound = () => {
    // Handler for load positive hit sound
    const handlepositiveHitSoundLoad = () => {
      positiveHitSound.removeEventListener(
        "load",
        handlepositiveHitSoundLoad
      );
    }
    // Add handler for load positive hit sound
    const positiveHitSound = new Audio("./sounds/PosHit.mp3");
    positiveHitSound.addEventListener(
      "load",
      handlepositiveHitSoundLoad
    );
    return positiveHitSound;
  }

  // Load negative hit sound
  const loadNegativeHitSound = () => {
    // Handler for load negative hit sound
    const handlenegativeHitSoundLoad = () => {
      negativeHitSound.removeEventListener(
        "load",
        handlenegativeHitSoundLoad
      );
    }
    // Add handler for load negative hit sound
    const negativeHitSound = new Audio("./sounds/NegHit.mp3");
    negativeHitSound.addEventListener(
      "load",
      handlenegativeHitSoundLoad
    );
    return negativeHitSound;
  }

  // Load game over sound
  const loadGameOverSound = () => {
    // Handler for load game over sound
    const handleGameOverSoundLoad = () => {
      gameOverSound.removeEventListener(
        "load",
        handleGameOverSoundLoad
      );
    }
    // Add handler for load game over sound
    const gameOverSound = new Audio("./sounds/GameOver.mp3");
    gameOverSound.addEventListener(
      "load",
      handleGameOverSoundLoad
    );
    return gameOverSound;
  }
  
  // Load images and sound
  const bgImage = loadBgImage();
  const spaceshipImage = loadSpaceshipImage();
  const shotImage = loadShotImage();
  const lifeImage = loadlifeImage();
  const lettersImage = loadLettersImage();
  const gameMusic = loadGameMusic();
  const positiveHitSound = loadPositiveHitSound();
  const negativeHitSound = loadNegativeHitSound(); 
  const gameOverSound = loadGameOverSound();

  // Add mouse up or down handler
  const addMouseUpDownHandler = () => {
    // Handler for mouse move up or down
    const handleMouseUpDown = (e) => {
      if ((e.clientY > (4 * spaceship.height)) && (e.clientY < canvas.height - (8 * spaceship.height))) {
        spaceship.yPosition = e.clientY;
      }
    }
    // Add handler for mouse move up or down
    document.addEventListener(
      "mousemove", 
      handleMouseUpDown
    );
    return handleMouseUpDown;
  }

  // Add click on left mouse button handler
  const addLeftMouseButtonHandler = () => {
    // Handler for click on left mouse button
    const handleLeftMouseButton = () => {
      shotEnabled = true;
      shot.yPosition = spaceship.yPosition + letterHorizontalGap;
    }
    // Add handler for click on left mouse button
    document.addEventListener(
      "mousedown", 
      handleLeftMouseButton
    );
    return handleLeftMouseButton;
  }
 
   // Add mouse handlers
  const handleMouseUpDown = addMouseUpDownHandler();
  const handleLeftMouseButton = addLeftMouseButtonHandler();

  // Initialize objects

  // Initialize xy offset of each letter in letters image
  const initializeLetterObjects = () => {
    let xOffset = 5;
    let yOffset = 8;
    for (let i = 0; i < alphabetCharactersNum; i++) {
      const letterSubRectangle = new LetterSubRectangleObject(
        xOffset, 
        yOffset, 
        alphabetCharacters[i]
      );
      letterObjects.push(letterSubRectangle);
      xOffset += letterWidth + letterHorizontalGap;
      if (xOffset > 608) {
        xOffset = 5;
        yOffset += letterHeight + letterVerticalGap;
      }
    }
  }
  initializeLetterObjects();

  const spaceship = new SpaceshipObject(
    10, 
    canvas.height / 2, 
    163, 
    16, 
    spaceshipImage
  );

  const shot = new ShotObject(
    116, 
    canvas.height / 2, 
    23, 
    16, 
    shotImage
  );

  const initializeFlyingLetters = () => {
    for (let i = 0; i < flyingLetters[startIndex].length; i++) {
      let xPosition = canvas.width - (Math.floor(Math.random() * 500)) - letterWidth;
      let yPosition = letterHeight + (Math.floor(Math.random() * 500));
      let yDirection = 1 + (Math.floor(Math.random() * letterVerticalSpeed));
      const letter = new LetterObject(
        xPosition, 
        yPosition, 
        letterWidth, 
        letterHeight, 
        yDirection, 
        flyingLetters[startIndex][i]
      );
      letters.push(letter);
    }
  }
  initializeFlyingLetters();

  // Initialize game music
  gameMusic.loop="loop";
  gameMusic.play();

  // Display background picture
  const displayBgPicture = () => {
    renderingContext.drawImage(
      bgImage, 
      0, 
      0
    );
  }

  // Display spaceship
  const displaySpaceship = () => {
    renderingContext.drawImage(
      spaceship.imageUrl, 
      0, 
      0, 
      110, 
      55, 
      spaceship.xPosition, 
      spaceship.yPosition, 
      110, 
      55
    );
  }

  // Display shot
  const shootBullet = () => {
    // only if shot enabled
    if (shotEnabled) {
      renderingContext.drawImage(
        shot.imageUrl, 
        shot.xPosition, 
        shot.yPosition
      );
      shot.xPosition += shotHorizontalSpeed;
      // Check shot against right border
      if (shot.xPosition > canvas.width) {
        shotEnabled = false;
        shot.xPosition = 116;
      }
    }
  }

  // Check if missing letter was hit
  const checkMissingLetter = (i) => {

    // Insert hit letter in assembled word
    const insertHitLetter = (i) => {
      let buffer = "";
      let isLetterHit = false;
      for (let j = 0; j < currentTemplateWord.length; j++) {
        if (letters[i].character === currentTemplateWord[j]) {
          positiveHitSound.play();
          score += 100;
          isLetterHit = true;
          for (let k = 0; k < assembledWord.length; k++) {
            let character = assembledWord[k];
            (j === k) ? buffer += letters[i].character : buffer += character;
          }
          assembledWord = buffer;
          // Clear hit letter in current template word
          buffer = currentTemplateWord.replace(letters[i].character, " ");
          currentTemplateWord = buffer;
          break;
        }
      }
      return isLetterHit;
    }

    // Reduce energy if wrong letter was hit
    const reduceEnergy = () => {
      negativeHitSound.play();
      if (energy > 30) {
        energy -= 30;
      }
      else {
        lives -= 1;
        (lives === 0) ? gameOver = true : energy = 90;        
      }
    }
    
    (insertHitLetter(i)) ? null : reduceEnergy();

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
    const xCollisionCheck1 = ((shot.xPosition + shot.width) >= letters[i].xPosition) && (shot.xPosition <= (letters[i].xPosition + letters[i].width));
    // ( shot.yt >= letter.yt ) && ( shot.yt <= letter.yb )
    const yCollisionCheck1 = (shot.yPosition >= letters[i].yPosition) && (shot.yPosition <= (letters[i].yPosition + letters[i].height));
    // ( shot.yb <= letter.yb ) && ( shot.yt >= letter.yt )
    const yCollisionCheck2 = ((shot.yPosition + shot.height) <= (letters[i].yPosition + letters[i].height)) && (shot.yPosition >= letters[i].yPosition);
    if (xCollisionCheck1 && (yCollisionCheck1 || yCollisionCheck2)) {
      checkMissingLetter(i);
      letters.splice(i, 1);
      shotEnabled = false;
      shot.xPosition = 116;
      return true;
    }
    return false;
  }

  // Display letters and do collision check if shot is enabled
  const moveLetters = () => {
    for (let i = 0; i < letters.length; i++) {
      let currentCharacter = letters[i].character;
      let currentLetter = null;
      for (j = 0; j < alphabetCharactersNum; j++) {
        if (currentCharacter === letterObjects[j].character ) {
          currentLetter = letterObjects[j];
          break;
        }
      }
      renderingContext.drawImage(
        lettersImage, 
        currentLetter.xOffset,
        currentLetter.yOffset,
        letterWidth,
        letterHeight,
        letters[i].xPosition, 
        letters[i].yPosition,
        letterWidth,
        letterHeight
      );
      if (shotEnabled && checkLetterHit(i)) {
        continue;
      }
      // Top / bottom border check
      if ((letters[i].yPosition < 0) || (letters[i].yPosition > (600 - letterHeight))) {
        letters[i].yDirection *= - 1;
      }
      letters[i].yPosition += letters[i].yDirection;
    }
  }

  // Display energy left at the left top of the screen
  const displayEnergy = () => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      "Energy", 
      10, 
      30
    );
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillRect(
      110, 
      15, 
      energy, 
      16
    );
  }

  // Display current player score in the centre of the top screen
  const displayScore = () => {
    let scoreStr = score.toString().padStart(6,0,0);
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      `Score ${scoreStr}`,
      320,
      30
    );
  }

  // Display number of lives left at the right top of the screen
  const displayLives = () => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      "Lives", 
      630, 
      30
    );
    // Display life symbols only if lives are left
    if (lives !== 0) {
      let livesStartXPosition = 705;
      for (let i = 0; i < lives; i++) {
        renderingContext.drawImage(
          lifeImage, 
          livesStartXPosition, 
          17
        );
        livesStartXPosition += 30;
      }
    }
  }

  // Display template word at the left bottom of the screen
  const displayTemplateWord = () => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillText(
      templateWords[startIndex], 
      10, 
      canvas.height - 15
    );
  }

  // Display assembled word at the right bottom of the screen
  const displayAssembledWord = () => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      assembledWord, 
      620, 
      canvas.height - 15
    );
  }

  // Get next random template word if all missing letters were hit
  const checkTemplateWord = () => {
    assembledWord = "      ";
    while (startIndex === oldStartIndex) {
      startIndex = Math.floor(Math.random() * templateWords.length);
    }
    oldStartIndex = startIndex;      
    currentTemplateWord = templateWords[startIndex];
    letters.splice(0, letters.length);
    for (let i = 0; i < flyingLetters[startIndex].length; i++) {
      let xPosition = canvas.width - (Math.floor(Math.random() * 500)) - letterWidth;
      let yPosition = letterHeight + (Math.floor(Math.random() * 500));
      let yDirection = 1 + (Math.floor(Math.random() * letterVerticalSpeed));
      const letter = new LetterObject(
        xPosition, 
        yPosition, 
        letterWidth, 
        letterHeight, 
        yDirection, 
        flyingLetters[startIndex][i]
      );
      letters.push(letter);
    }
    nextLevel = false;
  }

  // Stop game if no lives left
  const stopGame = () => {
    gameOver = false;
    gameContainer.classList.remove("cursorOff");
    gameContainer.classList.add("cursorOn");
    // Stop interval
    clearInterval(intervalId);
    // Remove event listeners
    document.removeEventListener(
      "mousemove", 
      handleMouseUpDown
    );
    document.removeEventListener(
      "mousedown", 
      handleLeftMouseButton
    );
    // Stop game music and play game over sound
    gameMusic.currentTime = 0; 
    gameMusic.pause(); 
    gameMusic.currentTime = 0;
    gameOverSound.play();
    // Start end screen
    displayGameoverScreen(score);
  }
  
  // Game loop
  const animateAll = () => {
    // Always display background picture
    displayBgPicture();
    // Check template word if level is finished
    if (nextLevel) {
      checkTemplateWord();
    }
    // Graphic elements only displayed if game not over
    if (gameOver) {
      stopGame();
    }
    else {
      displaySpaceship();
      shootBullet();
      moveLetters();
      displayEnergy();
      displayScore();
      displayLives();
      displayTemplateWord();
      displayAssembledWord();
    }
  }

  // Handler for interval timer
  const handleIntervalTimer = () => requestAnimationFrame(animateAll);
  // Start game by interval
  intervalId = setInterval(
    handleIntervalTimer, 
    10
  );
}


// ---------- Display splash screen ----------
const displaySplashScreen = () => {
  
  // Handler for click on start button
  const handleStartButton = () => {
    introContainer.classList.add("displayOff");
    gameContainer.classList.remove("displayOff");
    // Remove handler for click on start button
    startButton.removeEventListener(
      "click", 
      handleStartButton
    );
    // Start game
    displayGameScreen();
  }
  // Add handler for click on start button
  startButton.addEventListener(
    "click", 
    handleStartButton
  );

}

// ---------- Display gameover screen ----------
const displayGameoverScreen = (score) => {

  // Create highscore table
  const createHighScoreTable = (score) => {
    // Insert score in highscore table and sort entries
    if ((scoresTable.length < 10) && (score !== 0)) {
      scoresTable.push(score);
      scoresTable.sort((a, b) => b - a);
    }
    // Create highscore table list elements
    scoreList.innerHTML = ""; // clear the list
    for (let i = 0; i < scoresTable.length; i++) {
      elements.scoreEntry = document.createElement("li");
      elements.scoreEntry.innerText = scoresTable[i].toString().padStart(6, 0, 0);
      scoreList.appendChild(elements.scoreEntry);
    }
  }
  gameContainer.classList.add("displayOff");
  gameContainer.classList.remove("cursorOn");
  gameContainer.classList.add("cursorOff");
  endContainer.classList.remove("displayOff");
  createHighScoreTable(score);
  // Handler for click on restart button
  const handleRestartButton = () => {
    scoreList.innerHTML = "";
    endContainer.classList.add("displayOff");
    gameContainer.classList.remove("displayOff");
    // Remove handler for click on restart button
    restartButton.removeEventListener(
      "click", 
      handleRestartButton
    );
    // Restart game
    displayGameScreen();
  }
  // Add handler for click on restart button
  restartButton.addEventListener(
    "click", 
    handleRestartButton
  );

}


// Start game
displaySplashScreen();