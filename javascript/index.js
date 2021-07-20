// ---------- Global ----------
// Initialize class
class ElementsObject {
  constructor(splashContainer, startButton, gameContainer, canvas, gameOverContainer, scoreList, scoreEntry, restartButton) {
    this.splashContainer = splashContainer;
    this.startButton = startButton;
    this.gameContainer = gameContainer;
    this.canvas = canvas;
    this.gameOverContainer = gameOverContainer;
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
  document.querySelector("#splashContainer"),
  document.querySelector("#startButton"),
  document.querySelector("#gameContainer"),
  document.querySelector("canvas"),
  document.querySelector("#gameOverContainer"),
  document.querySelector("#scoreList"),
  null,
  document.querySelector("#restartButton")
);

// Initialize constants
const {splashContainer, startButton, gameContainer, canvas, gameOverContainer, scoreList, restartButton} = elements;


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

  class LetterConstantsObject {
    constructor(width, height, horizontalGap, verticalGap, maxVerticalSpeed) {
      this.width = width;
      this.height = height;
      this.horizontalGap = horizontalGap;
      this.verticalGap = verticalGap;
      this.maxVerticalSpeed = maxVerticalSpeed;
    }
  }

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
  const renderingContext = canvas.getContext("2d");
  const definedAssembledWord = " ".repeat(6);
  const maxLives = 3
  const maxEnergy = 90;
  const energyCountdownStep = 30;
  const shotHorizontalSpeed = 15;
  
  // Initialize variables
  let [energy, score, lives, assembledWord, intervalId] = [maxEnergy, 0, maxLives, definedAssembledWord, null];
  let [isNextLevel, isGameOver, isShotEnabled] = [false, false, false];
  let startIndex = Math.floor(Math.random() * templateWords.length);
  let oldStartIndex = startIndex;
  let currentTemplateWord = templateWords[startIndex];

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
  const loadlifeImage = () => {
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
    const handlenegativeHitSoundLoad = () => negativeHitSound.removeEventListener(
      "load",
      handlenegativeHitSoundLoad
    )
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
  const lifeImage = loadlifeImage();
  const lettersImage = loadLettersImage();
  const gameMusic = loadGameMusic();
  const positiveHitSound = loadPositiveHitSound();
  const negativeHitSound = loadNegativeHitSound();
  const gameOverSound = loadGameOverSound();

  // Add mouse up or down handler
  const addMouseUpDownHandler = () => {
    // Handler for mouse move up or down
    const handleMouseUpDown = event => {
      const {height} = spaceship;
      const {clientY} = event;
      if ((clientY > (4 * height)) && (clientY < canvas.height - (8 * height))) spaceship.yPosition = clientY;
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
      isShotEnabled = true;
      shot.yPosition = spaceship.yPosition + letterConstants.horizontalGap;
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

  // Initialize letter constant values
  const letterConstants = new LetterConstantsObject(
    50,
    40,
    17,
    7,
    4
  );

  // Initialize xy offset of each letter in letters image
  const initializeLetterObjects = () => {
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
        xOffset += width + horizontalGap;
        if (xOffset > 608) {
          xOffset = 5;
          yOffset += height + verticalGap;
        }
      }
    );
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
    const {width, height, maxVerticalSpeed} = letterConstants;
    for (let i = 0; i < flyingLetters[startIndex].length; i++) {
      const xPosition = canvas.width - (Math.floor(Math.random() * 500)) - width;
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
  initializeFlyingLetters();

  // Initialize game music
  gameMusic.loop = "loop";
  gameMusic.play();

  // Display background picture
  const displayBgPicture = () => renderingContext.drawImage(
    bgImage,
    0,
    0
  )

  // Display spaceship
  const displaySpaceship = () => renderingContext.drawImage(
    spaceship.imageUrl,
    0,
    0,
    110,
    55,
    spaceship.xPosition,
    spaceship.yPosition,
    110,
    55
  )

  // Display shot
  const shootBullet = () => {
    // only if shot enabled
    if (isShotEnabled) {
      renderingContext.drawImage(
        shot.imageUrl,
        shot.xPosition,
        shot.yPosition
      );
      shot.xPosition += shotHorizontalSpeed;
      // Check shot against right border
      if (shot.xPosition > canvas.width) {
        isShotEnabled = false;
        shot.xPosition = 116;
      }
    }
  }

  // Check if missing letter was hit
  const checkMissingLetter = i => {

    // Insert hit letter in assembled word
    const insertHitLetter = i => {
      let [buffer, isLetterHit] = ["", false];
      for (let j = 0; j < currentTemplateWord.length; j++) {
        if (letters[i].character === currentTemplateWord[j]) {
          positiveHitSound.play();
          score += 100;
          isLetterHit = true;
          for (let k = 0; k < assembledWord.length; k++) {
            j === k ? buffer += letters[i].character : buffer += assembledWord[k];
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
      if (energy > energyCountdownStep) {
        energy -= energyCountdownStep;
      }
      else {
        lives -= 1;
        lives === 0 ? isGameOver = true : energy = maxEnergy;
      }
    }
    !insertHitLetter(i) && reduceEnergy();

    // Check if all missed letters are hit
    for (let k = 0; k < currentTemplateWord.length; k++) {
      if (currentTemplateWord[k] !== " ") return;
    }
    isNextLevel = true;
  }

  // Check collision shot vs. letter(s)
  const checkLetterHit = i => {
    const {xPosition, yPosition, width, height} = shot;
    // ( shot.xr >= letter.xl ) && ( shot.xl <= letter.xr )
    const xCollisionCheck1 = ((xPosition + width) >= letters[i].xPosition) && (xPosition <= (letters[i].xPosition + letters[i].width));
    // ( shot.yt >= letter.yt ) && ( shot.yt <= letter.yb )
    const yCollisionCheck1 = (yPosition >= letters[i].yPosition) && (yPosition <= (letters[i].yPosition + letters[i].height));
    // ( shot.yb <= letter.yb ) && ( shot.yt >= letter.yt )
    const yCollisionCheck2 = ((yPosition + height) <= (letters[i].yPosition + letters[i].height)) && (yPosition >= letters[i].yPosition);
    if (xCollisionCheck1 && (yCollisionCheck1 || yCollisionCheck2)) {
      checkMissingLetter(i);
      letters.splice(i, 1);
      isShotEnabled = false;
      shot.xPosition = 116;
      return true;
    }
    return false;
  }

  // Display letters and do collision check if shot is enabled
  const moveLetters = () => {
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
      if (isShotEnabled && checkLetterHit(i)) continue;

      // Top / bottom border check
      if ((letters[i].yPosition < 0) || (letters[i].yPosition > (600 - letterConstants.height))) letters[i].yDirection *= - 1; // Change vertical direction
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
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      `Score ${score.toString().padStart(6, 0, 0)}`,
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
    assembledWord = definedAssembledWord;
    while (startIndex === oldStartIndex) startIndex = Math.floor(Math.random() * templateWords.length);
    oldStartIndex = startIndex;
    currentTemplateWord = templateWords[startIndex];
    letters.splice(0, letters.length);
    initializeFlyingLetters();
    isNextLevel = false;
  }

  // Stop game if no lives left
  const stopGame = () => {
    isGameOver = false;
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
    if (isNextLevel) checkTemplateWord();
    // Graphic elements only displayed if game not over
    if (isGameOver) {
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
  const handleIntervalTimer = () => requestAnimationFrame(animateAll)
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
    splashContainer.classList.add("displayOff");
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
const displayGameoverScreen = score => {

  // Create highscore table
  const createHighScoreTable = score => {
    // Insert score in highscore table and sort entries
    if ((scoresTable.length < 10) && (score !== 0)) {
      scoresTable.push(score);
      scoresTable.sort((a, b) => b - a);
    }
    // Create highscore table list elements
    scoreList.innerHTML = ""; // clear the list
    scoresTable.forEach(
      score => {
        elements.scoreEntry = document.createElement("li");
        elements.scoreEntry.innerText = score.toString().padStart(6, 0, 0);
        scoreList.appendChild(elements.scoreEntry);
      }
    );
  }
  gameContainer.classList.add("displayOff");
  gameContainer.classList.remove("cursorOn");
  gameContainer.classList.add("cursorOff");
  gameOverContainer.classList.remove("displayOff");
  createHighScoreTable(score);
  // Handler for click on restart button
  const handleRestartButton = () => {
    scoreList.innerHTML = "";
    gameOverContainer.classList.add("displayOff");
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