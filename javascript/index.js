// ---------- Global ----------
const gameConstants = {
  maxLives: 3,
  maxEnergy: 90,
  energyCountStep: 30,
  scoreCountStep: 100,
  shotHorizontalSpeed: 15,
  elements: {
    splashContainer: document.querySelector("#splashContainer"),
    startButton: document.querySelector("#startButton"),
    gameContainer: document.querySelector("#gameContainer"),
    canvas: document.querySelector("canvas"),
    gameOverContainer: document.querySelector("#gameOverContainer"),
    scoreList: document.querySelector("#scoreList"),
    restartButton: document.querySelector("#restartButton") 
  },
  templateWords: [
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
  ],
  flyingLetters: [
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
  ],
  alphabetCharacters: [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z"
  ],
  letterConstants: {
    width: 50,
    height: 40,
    horizontalGap: 17,
    verticalGap: 7,
    maxVerticalSpeed: 4
  },
  scoresTable: [
    10100,
    9000,
    1000
  ]
}

const gameVariables = {
  energy: 0,
  score: 0,
  lives: 0,
  isNextLevel: false, 
  isGameOver: false,
  isShotEnabled: false,
  intervalId: null,
  letterObjects: [],
  letters: [],
};

gameVariables.energy = gameConstants.maxEnergy;
gameVariables.lives = gameConstants.maxLives;


// ---------- Display game screen ----------
const displayGameScreen = (gameConstants, gameVariables) => {
  const {elements, templateWords} = gameConstants;
  const renderingContext = elements.canvas.getContext("2d");
  const definedAssembledWord = " ".repeat(6);

  let startIndex = Math.floor(Math.random() * templateWords.length);
  let currentTemplateWord = templateWords[startIndex];
  let [oldStartIndex, assembledWord]  = [startIndex, definedAssembledWord];

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
    constructor(xPosition, yPosition, width, height, imageUrl) {
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
    constructor(xOffset, yOffset, character) {
      this.xOffset = xOffset;
      this.yOffset = yOffset;
      this.character = character;
    }
  };

  // Load background image
  const loadBgImage = () => {
    // Handler for load background image
    const handleBgImageLoad = () => bgImage.removeEventListener(
      "load",
      handleBgImageLoad
    )
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
    const handleSpaceshipImageLoad = () => spaceshipImage.removeEventListener(
      "load",
      handleSpaceshipImageLoad
    )
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
    const handleShotImageLoad = () => shotImage.removeEventListener(
      "load",
      handleShotImageLoad
    )
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
  const loadLifeImage = () => {
    // Handler for load life image
    const handleLifeImageLoad = () => lifeImage.removeEventListener(
      "load",
      handleLifeImageLoad
    )
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
    const handleLettersImageLoad = () => lettersImage.removeEventListener(
      "load",
      handleLettersImageLoad
    )
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
    const handleGameMusicLoad = () => gameMusic.removeEventListener(
      "load",
      handleGameMusicLoad
    )
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
    const handlepositiveHitSoundLoad = () => positiveHitSound.removeEventListener(
      "load",
      handlepositiveHitSoundLoad
    )
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
    const handleNegativeHitSoundLoad = () => negativeHitSound.removeEventListener(
      "load",
      handleNegativeHitSoundLoad
    )
    // Add handler for load negative hit sound
    const negativeHitSound = new Audio("./sounds/NegHit.mp3");
    negativeHitSound.addEventListener(
      "load",
      handleNegativeHitSoundLoad
    );
    return negativeHitSound;
  }

  // Load game over sound
  const loadGameOverSound = () => {
    // Handler for load game over sound
    const handleGameOverSoundLoad = () => gameOverSound.removeEventListener(
      "load",
      handleGameOverSoundLoad
    )
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
  const lifeImage = loadLifeImage();
  const lettersImage = loadLettersImage();
  const gameMusic = loadGameMusic();
  const positiveHitSound = loadPositiveHitSound();
  const negativeHitSound = loadNegativeHitSound();
  const gameOverSound = loadGameOverSound();

  // Initialize xy offset of each letter in letters image
  const initializeLetterObjects = ({alphabetCharacters, letterConstants}, {letterObjects}) => {
    const {width, height, horizontalGap, verticalGap} = letterConstants;
    let [xOffset, yOffset] = [5, 8];
    alphabetCharacters.forEach(
      character => {
        const letterSubRectangle = new LetterSubRectangleObject(
          xOffset,
          yOffset,
          character
        );
        letterObjects.push(letterSubRectangle);
        if ((xOffset += width + horizontalGap) > 608) {
          xOffset = 5;
          yOffset += height + verticalGap;
        }
      }
    );
  }
  initializeLetterObjects(gameConstants, gameVariables);

  // Create spaceship object
  const initializeSpaceshipObject = ({elements}, spaceshipImage) => {
    const spaceship = new SpaceshipObject(
      10,
      elements.canvas.height / 2,
      163,
      16,
      spaceshipImage
    );
    return spaceship;
  }
  const spaceship = initializeSpaceshipObject(gameConstants, spaceshipImage);

  // Create shot object
  const initializeShotObject = ({elements}, shotImage) => {
    const shot = new ShotObject(
      116,
      elements.canvas.height / 2,
      23,
      16,
      shotImage
    );
    return shot;
  }
  const shot = initializeShotObject(gameConstants, shotImage);

  // Initialize start xy position on display of each letter
  const initializeFlyingLetters = ({elements, flyingLetters, letterConstants}, {letters}) => {
    const {width, height, maxVerticalSpeed} = letterConstants;
    for (let i = 0; i < flyingLetters[startIndex].length; i++) {
      const xPosition = elements.canvas.width - (Math.floor(Math.random() * 500)) - width;
      const yPosition = height + (Math.floor(Math.random() * 500));
      const yDirection = 1 + (Math.floor(Math.random() * maxVerticalSpeed));
      const letter = new LetterObject(
        xPosition,
        yPosition,
        width,
        height,
        yDirection,
        flyingLetters[startIndex][i]
      );
      letters.push(letter);
    }
  }
  initializeFlyingLetters(gameConstants, gameVariables);

  // Initialize game music
  gameMusic.loop = "loop";
  gameMusic.play();

  // Add mouse up or down handler
  const addMouseUpDownHandler = (gameConstants, spaceship) => {
    // Handler for mouse move up or down
    const handleMouseUpDown = (event, gameConstants, spaceship) => {
      // Get vertical spacehip position
      const calculateSpaceshipPosition = ({clientY}, {elements}, {height}) => {
        ((clientY > (4 * height)) && (clientY < elements.canvas.height - (8 * height))) && (spaceship.yPosition = clientY);
      }
      calculateSpaceshipPosition(event, gameConstants, spaceship);
    }
    // Add handler for mouse move up or down
    document.addEventListener(
      "mousemove",
      event => handleMouseUpDown(event, gameConstants, spaceship)
    );
    return handleMouseUpDown;
  }
  const handleMouseUpDown = addMouseUpDownHandler(gameConstants, spaceship);

  // Add click on left mouse button handler
  const addLeftMouseButtonHandler = (gameConstants, gameVariables, shot) => {
    // Handler for click on left mouse button
    const handleLeftMouseButton = (gameConstants, gameVariables, shot) => {
      // Get vertical shot position
      const calcualteShotPosition = ({letterConstants}, gameVariables, shot) => {
        gameVariables.isShotEnabled = true;
        shot.yPosition = spaceship.yPosition + letterConstants.horizontalGap;
      }
      calcualteShotPosition(gameConstants, gameVariables, shot);
    }
    // Add handler for click on left mouse button
    document.addEventListener(
      "mousedown",
      () => handleLeftMouseButton(gameConstants, gameVariables, shot)
    );
    return handleLeftMouseButton;
  }
  const handleLeftMouseButton = addLeftMouseButtonHandler(gameConstants, gameVariables, shot);

  // Display background picture
  const displayBgPicture = (renderingContext, bgImage) => renderingContext.drawImage(
    bgImage,
    0,
    0
  )

  // Display spaceship
  const displaySpaceship = (renderingContext, {xPosition, yPosition, imageUrl}) => renderingContext.drawImage(
    imageUrl,
    0,
    0,
    110,
    55,
    xPosition,
    yPosition,
    110,
    55
  )

  // Display shot
  const shootBullet = ({shotHorizontalSpeed, elements}, gameVariables, renderingContext, shot) => {
    // only if shot enabled
    if (gameVariables.isShotEnabled) {
      const {xPosition, yPosition, imageUrl} = shot;
      renderingContext.drawImage(
        imageUrl,
        xPosition,
        yPosition
      );
      shot.xPosition += shotHorizontalSpeed;
      // Check shot against right border
      (shot.xPosition > elements.canvas.width) && ([gameVariables.isShotEnabled, shot.xPosition] = [false, 116]);
    }
  }

  // Check if missing letter was hit
  const checkMissingLetter = (i, gameConstants, gameVariables) => {
    // Insert hit letter in assembled word
    const insertHitLetter = (i, gameConstants, gameVariables) => {
      const {letters} = gameVariables;
      let buffer = "";
      for (let j = 0; j < currentTemplateWord.length; j++) {
        if (letters[i].character === currentTemplateWord[j]) {
          positiveHitSound.play();
          gameVariables.score += gameConstants.scoreCountStep;
          for (let k = 0; k < assembledWord.length; k++) {
            j === k ? buffer += letters[i].character : buffer += assembledWord[k];
          }
          assembledWord = buffer;
          currentTemplateWord = currentTemplateWord.replace(letters[i].character, " "); // Clear hit letter in current template word
          return true;
        }
      }
      return false;
    }
    // Reduce energy if wrong letter was hit
    const reduceEnergy = ({maxEnergy, energyCountStep}, gameVariables) => {
      negativeHitSound.play();
      gameVariables.energy > energyCountStep ? gameVariables.energy -= energyCountStep : (gameVariables.lives -= 1) === 0 ? gameVariables.isGameOver = true : gameVariables.energy = maxEnergy;
    }
    !insertHitLetter(i, gameConstants, gameVariables) && reduceEnergy(gameConstants, gameVariables);

    // Check if all missed letters are hit
    for (let k = 0; k < currentTemplateWord.length; k++) {
      if (currentTemplateWord[k] !== " ") return;
    }
    gameVariables.isNextLevel = true;
  }

  // Check collision shot vs. letter(s)
  const checkLetterHit = (i, gameConstants, gameVariables, shot, checkMissingLetter) => {
    const {letters} = gameVariables;
    const {xPosition, yPosition, width, height} = shot;
    // ( shot.xr >= letter.xl ) && ( shot.xl <= letter.xr )
    const xCollisionCheck1 = ((xPosition + width) >= letters[i].xPosition) && (xPosition <= (letters[i].xPosition + letters[i].width));
    // ( shot.yt >= letter.yt ) && ( shot.yt <= letter.yb )
    const yCollisionCheck1 = (yPosition >= letters[i].yPosition) && (yPosition <= (letters[i].yPosition + letters[i].height));
    // ( shot.yb <= letter.yb ) && ( shot.yt >= letter.yt )
    const yCollisionCheck2 = ((yPosition + height) <= (letters[i].yPosition + letters[i].height)) && (yPosition >= letters[i].yPosition);
    if (xCollisionCheck1 && (yCollisionCheck1 || yCollisionCheck2)) {
      checkMissingLetter(i, gameConstants, gameVariables);
      letters.splice(i, 1);
      gameVariables.isShotEnabled = false;
      shot.xPosition = 116;
      return true;
    }
    return false;
  }

  // Display letters and do collision check if shot is enabled
  const moveLetters = (gameConstants, gameVariables, renderingContext, shot, checkLetterHit, checkMissingLetter) => {
    const {alphabetCharacters, letterConstants} = gameConstants;
    const {isShotEnabled, letterObjects, letters} = gameVariables;
    for (let i = 0; i < letters.length; i++) {
      const currentCharacter = letters[i].character;
      let currentLetter = null;
      for (j = 0; j < alphabetCharacters.length; j++) {
        if (currentCharacter === letterObjects[j].character) {
          currentLetter = letterObjects[j];
          break;
        }
      }
      const {width, height} = letterConstants;
      renderingContext.drawImage(
        lettersImage,
        currentLetter.xOffset,
        currentLetter.yOffset,
        width,
        height,
        letters[i].xPosition,
        letters[i].yPosition,
        width,
        height
      );
      if (isShotEnabled && checkLetterHit(i, gameConstants, gameVariables, shot, checkMissingLetter)) continue;
      ((letters[i].yPosition < 0) || (letters[i].yPosition > (600 - letterConstants.height))) && (letters[i].yDirection *= - 1); // Top / bottom border check with vertical direction change
      letters[i].yPosition += letters[i].yDirection;
    }
  }

  // Display energy left at the left top of the screen
  const displayEnergy = ({energy}, renderingContext) => {
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
  const displayScore = ({score}, renderingContext) => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      `Score ${score.toString().padStart(6, 0, 0)}`,
      320,
      30
    );
  }

  // Display number of lives left at the right top of the screen
  const displayLives = ({lives}, renderingContext, lifeImage) => {
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
  const displayTemplateWord = ({elements, templateWords}, renderingContext) => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillText(
      templateWords[startIndex],
      10,
      elements.canvas.height - 15
    );
  }

  // Display assembled word at the right bottom of the screen
  const displayAssembledWord = ({elements}, renderingContext) => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      assembledWord,
      620,
      elements.canvas.height - 15
    );
  }

  // Get next random template word if all missing letters were hit
  const checkTemplateWord = (gameConstants, gameVariables, initializeFlyingLetters) => {
    const {templateWords} = gameConstants;
    const {letters} = gameVariables;
    while (startIndex === oldStartIndex) startIndex = Math.floor(Math.random() * templateWords.length);
    [oldStartIndex, assembledWord, gameVariables.isNextLevel] = [startIndex, definedAssembledWord, false];
    currentTemplateWord = templateWords[startIndex];
    letters.splice(0, letters.length);
    initializeFlyingLetters(gameConstants, gameVariables);
  }

  // Display gameover screen
  const displayGameoverScreen = (gameConstants, gameVariables, displayGameScreen) => {
    const {gameContainer, gameOverContainer, restartButton} = gameConstants.elements;
    gameContainer.classList.add("displayOff");
    gameContainer.classList.remove("cursorOn");
    gameContainer.classList.add("cursorOff");
    gameOverContainer.classList.remove("displayOff");
    // Create highscore table
    const createHighScoreTable = (gameConstants, gameVariables) => {
      const {scoresTable} = gameConstants;
      const {score} = gameVariables;
      // Insert score in highscore table and sort entries
      if ((scoresTable.length < 10) && (score !== 0)) {
        scoresTable.push(score);
        scoresTable.sort((a, b) => b - a);
      }
      // Create highscore table list elements
      gameConstants.elements.scoreList.innerHTML = ""; // clear the list
      scoresTable.forEach(
        singleScore => {
          let scoreEntry = document.createElement("li");
          scoreEntry.innerText = singleScore.toString().padStart(6, 0, 0);
          gameConstants.elements.scoreList.appendChild(scoreEntry);
        }
      );
    }
    createHighScoreTable(gameConstants, gameVariables);
    // Reset all game variables to default 
    const resetAllVariables = (gameConstants, gameVariables) => {
      gameVariables.energy = gameConstants.maxEnergy;
      gameVariables.score = 0;
      gameVariables.lives = gameConstants.maxLives;
      gameVariables.isNextLevel = false; 
      gameVariables.isGameOver = false;
      gameVariables.isShotEnabled = false;
      gameVariables.intervalId = null;
      gameVariables.letterObjects = [];
      gameVariables.letters = [];
    }
    // Handler for click on restart button
    const handleRestartButton = (gameConstants, gameVariables, resetAllVariables, displayGameScreen) => {
      // Restart game
      const initializeGameRestart = (gameConstants, gameVariables, resetAllVariables, displayGameScreen) => {
        const {gameContainer, gameOverContainer, restartButton} = gameConstants.elements;
        gameConstants.elements.scoreList.innerHTML = ""; // clear the list
        gameOverContainer.classList.add("displayOff");
        gameContainer.classList.remove("displayOff");
        // Remove handler for click on restart button
        restartButton.removeEventListener(
          "click",
          handleRestartButton
        );
        resetAllVariables(gameConstants, gameVariables);
        displayGameScreen(gameConstants, gameVariables);
      }
      initializeGameRestart(gameConstants, gameVariables, resetAllVariables, displayGameScreen);
    }
    // Add handler for click on restart button
    restartButton.addEventListener(
      "click",
      () => handleRestartButton(gameConstants, gameVariables, resetAllVariables, displayGameScreen)
    );
  }

  // Stop game if no lives left
  const stopGame = (gameConstants, gameVariables, displayGameoverScreen, displayGameScreen) => {
    gameVariables.isGameOver = false;
    const {gameContainer} = gameConstants.elements;
    gameContainer.classList.remove("cursorOff");
    gameContainer.classList.add("cursorOn");
    // Stop interval
    clearInterval(gameVariables.intervalId);
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
    displayGameoverScreen(gameConstants, gameVariables, displayGameScreen);
  }

  // Render all game elements 60 frames per second
  const renderAll = (gameConstants, gameVariables, renderingContext, spaceship, shot, lifeImage, initializeFlyingLetters, checkTemplateWord, checkLetterHit, checkMissingLetter) => {
    // Display elements
    const renderGameElements = (gameConstants, gameVariables, renderingContext, spaceship, shot, lifeImage, initializeFlyingLetters, checkTemplateWord, checkLetterHit, checkMissingLetter) => { 
      const {isNextLevel, isGameOver} = gameVariables;
      displayBgPicture(renderingContext, bgImage); // Always display background picture
      isNextLevel && checkTemplateWord(gameConstants, gameVariables, initializeFlyingLetters); // Check template word if level is finished
      if (isGameOver) {
        stopGame(gameConstants, gameVariables, displayGameoverScreen, displayGameScreen);
      }
      // Graphic elements only displayed if game not over
      else {
        displaySpaceship(renderingContext, spaceship);
        shootBullet(gameConstants, gameVariables, renderingContext, shot);
        moveLetters(gameConstants, gameVariables, renderingContext, shot, checkLetterHit, checkMissingLetter);
        displayEnergy(gameVariables, renderingContext);
        displayScore(gameVariables, renderingContext);
        displayLives(gameVariables, renderingContext, lifeImage);
        displayTemplateWord(gameConstants, renderingContext);
        displayAssembledWord(gameConstants, renderingContext);
      }
    }
    renderGameElements(gameConstants, gameVariables, renderingContext, spaceship, shot, lifeImage, initializeFlyingLetters, checkTemplateWord, checkLetterHit, checkMissingLetter);
  }
  // Handler for interval timer
  const handleIntervalTimer = (gameConstants, gameVariables, renderingContext, spaceship, shot, lifeImage, initializeFlyingLetters, checkTemplateWord, checkLetterHit, checkMissingLetter) => requestAnimationFrame(() => renderAll(gameConstants, gameVariables, renderingContext, spaceship, shot, lifeImage, initializeFlyingLetters, checkTemplateWord, checkLetterHit, checkMissingLetter))
  // Start game by interval
  gameVariables.intervalId = setInterval(
    () => handleIntervalTimer(gameConstants, gameVariables, renderingContext, spaceship, shot, lifeImage, initializeFlyingLetters, checkTemplateWord, checkLetterHit, checkMissingLetter),
    10 // 60 frames per second
  );
}


// ---------- Display splash screen ----------
const displaySplashScreen = (gameConstants, gameVariables, displayGameScreen) => {
  // Handler for click on start button
  const handleStartButton = (gameConstants, gameVariables, displayGameScreen) => {
    // Initialize game start
    const initializeGameScreen = (gameConstants, gameVariables, displayGameScreen) => {
      const {splashContainer, gameContainer, startButton} = gameConstants.elements;
      splashContainer.classList.add("displayOff");
      gameContainer.classList.remove("displayOff");
      // Remove handler for click on start button
      startButton.removeEventListener(
        "click",
        handleStartButton
      );
      displayGameScreen(gameConstants, gameVariables);
    }
    initializeGameScreen(gameConstants, gameVariables, displayGameScreen);
  }
  // Add handler for click on start button
  gameConstants.elements.startButton.addEventListener(
    "click",
    () => handleStartButton(gameConstants, gameVariables, displayGameScreen)
  );
}

// Start game
displaySplashScreen(gameConstants, gameVariables, displayGameScreen);