// ---------- Global ----------

const constants = {
  maxLives: 3,
  maxEnergy: 90,
  energyCountStep: 30,
  scoreCountStep: 100,
  shotHorizontalSpeed: 15,
  bgImage: null,
  spaceshipImage: null,
  shotImage: null,
  lifeImage: null,
  lettersImage: null,
  gameMusic: null,
  positiveHitSound: null,
  negativeHitSound: null,
  gameOverSound: null,
  renderingContext: null,
  shot: null,
  spaceship: null,
  // HTML elements
  elements: {
    splashContainer: document.querySelector("#splashContainer"),
    startButton: document.querySelector("#startButton"),
    gameContainer: document.querySelector("#gameContainer"),
    canvas: document.querySelector("canvas"),
    gameOverContainer: document.querySelector("#gameOverContainer"),
    scoreList: document.querySelector("#scoreList"),
    restartButton: document.querySelector("#restartButton"),
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
    "BOOKS",
  ],
  // Letter combinations for each word
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
    "BQWGOZKSYOF",
  ],
  alphabetCharacters: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
  letterConstants: {
    width: 50,
    height: 40,
    horizontalGap: 17,
    verticalGap: 7,
    maxVerticalSpeed: 4,
  },
  scoresTable: [10100, 9000, 1000],
};

const variables = {
  energy: constants.maxEnergy,
  score: 0,
  lives: constants.maxLives,
  isNextLevel: false,
  isGameOver: false,
  isShotEnabled: false,
  intervalId: null,
  requestId: null,
  letterObjects: [],
  letters: [],
  handleMouseUpDownCallback: null,
  handleLeftMouseButtonCallback: null,
  handleRestartButtonCallback: null,
  handleStartButtonCallback: null,
};

// ---------- Display gameover screen ----------
const displayGameoverScreen = (constants, variables) => {
  const { gameOverContainer, restartButton } = constants.elements;

  // Load game over sound
  const loadGameOverSound = () => {
    // Handler for load game over sound
    const handleGameOverSoundLoad = () => {
      gameOverSound.removeEventListener("load", handleGameOverSoundLoad);
    };
    // Add handler for load game over sound
    const gameOverSound = new Audio("./sounds/GameOver.mp3");
    gameOverSound.addEventListener("load", handleGameOverSoundLoad);
    return gameOverSound;
  };

  // Play game over sound
  const playGameoverSound = ({ gameOverSound }) => {
    gameOverSound.play();
  };

  // Create highscore table
  const createHighScoreTable = (constants, variables) => {
    const { scoresTable, elements } = constants;
    const { scoreList } = elements;
    const { score } = variables;
    // Insert score in highscore table and sort entries
    if (scoresTable.length < 10 && score !== 0) {
      scoresTable.push(score);
      scoresTable.sort((a, b) => b - a);
    }
    // Create highscore table list elements
    scoreList.innerHTML = ""; // clear the list
    scoresTable.forEach((singleScore) => {
      let scoreEntry = document.createElement("li");
      scoreEntry.innerText = singleScore.toString().padStart(6, 0, 0);
      scoreList.appendChild(scoreEntry);
    });
  };

  const addRestartButtonHandler = (constants, variables) => {
    // Handler for click on restart button
    const handleRestartButton = (constants, variables) => {
      // Restart game
      const initializeGameRestart = (constants, variables) => {
        const { gameOverContainer, scoreList, restartButton } =
          constants.elements;
        // Reset all game variables to default
        const resetAllVariables = ({ maxEnergy, maxLives }, variables) => {
          variables.energy = maxEnergy;
          variables.score = 0;
          variables.lives = maxLives;
          variables.isNextLevel = false;
          variables.isGameOver = false;
          variables.isShotEnabled = false;
          variables.letterObjects = [];
          variables.letters = [];
        };

        scoreList.innerHTML = ""; // clear the list
        // Remove handler for click on restart button
        restartButton.removeEventListener(
          "click",
          variables.handleRestartButtonCallback
        );

        resetAllVariables(constants, variables);
        gameOverContainer.classList.add("displayOff");
        displayGameScreen(constants, variables);
      };
      initializeGameRestart(constants, variables);
    };
    // Add handler for click on restart button
    variables.handleRestartButtonCallback = () => {
      handleRestartButton(constants, variables);
    };
    restartButton.addEventListener(
      "click",
      variables.handleRestartButtonCallback
    );
    return handleRestartButton;
  };

  constants.gameOverSound = loadGameOverSound();
  playGameoverSound(constants);
  createHighScoreTable(constants, variables);
  addRestartButtonHandler(constants, variables);
  gameOverContainer.classList.remove("displayOff");
};

// ---------- Display game screen ----------
const displayGameScreen = (constants, variables) => {
  const { elements, templateWords } = constants;
  const { gameContainer, canvas } = elements;
  const definedAssembledWord = " ".repeat(6);

  let startIndex = Math.floor(Math.random() * templateWords.length);
  let currentTemplateWord = templateWords[startIndex];
  let [oldStartIndex, assembledWord] = [startIndex, definedAssembledWord];

  constants.renderingContext = canvas.getContext("2d");

  class SpaceshipObject {
    constructor(xPosition, yPosition, width, height, imageUrl) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.width = width;
      this.height = height;
      this.imageUrl = imageUrl;
    }
  }

  class ShotObject {
    constructor(xPosition, yPosition, width, height, imageUrl) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.width = width;
      this.height = height;
      this.imageUrl = imageUrl;
    }
  }

  class LetterObject {
    constructor(xPosition, yPosition, width, height, yDirection, character) {
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.width = width;
      this.height = height;
      this.yDirection = yDirection;
      this.character = character;
    }
  }

  class LetterSubRectangleObject {
    constructor(xOffset, yOffset, character) {
      this.xOffset = xOffset;
      this.yOffset = yOffset;
      this.character = character;
    }
  }

  // Load background image
  const loadBgImage = () => {
    // Handler for load background image
    const handleBgImageLoad = () => {
      bgImage.removeEventListener("load", handleBgImageLoad);
    };
    // Add handler for load background image
    const bgImage = document.createElement("img");
    bgImage.src = "./images/Andromeda.png";
    bgImage.addEventListener("load", handleBgImageLoad);
    return bgImage;
  };

  // Load spaceship image
  const loadSpaceshipImage = () => {
    // Handler for load spaceship image
    const handleSpaceshipImageLoad = () => {
      spaceshipImage.removeEventListener("load", handleSpaceshipImageLoad);
    };
    // Add handler for load spaceship image
    const spaceshipImage = document.createElement("img");
    spaceshipImage.src = "./images/Ships.png";
    spaceshipImage.addEventListener("load", handleSpaceshipImageLoad);
    return spaceshipImage;
  };

  // Load shot image
  const loadShotImage = () => {
    // Handler for load shot image
    const handleShotImageLoad = () => {
      shotImage.removeEventListener("load", handleShotImageLoad);
    };
    // Add handler for load shot image
    const shotImage = document.createElement("img");
    shotImage.src = "./images/Shot.png";
    shotImage.addEventListener("load", handleShotImageLoad);
    return shotImage;
  };

  // Load life image
  const loadLifeImage = () => {
    // Handler for load life image
    const handleLifeImageLoad = () => {
      lifeImage.removeEventListener("load", handleLifeImageLoad);
    };
    // Add handler for load life image
    const lifeImage = document.createElement("img");
    lifeImage.src = "./images/Ship-sm.png";
    lifeImage.addEventListener("load", handleLifeImageLoad);
    return lifeImage;
  };

  // Load letters image
  const loadLettersImage = () => {
    // Handler for load letters image
    const handleLettersImageLoad = () => {
      lettersImage.removeEventListener("load", handleLettersImageLoad);
    };
    // Add handler for load letters image
    const lettersImage = document.createElement("img");
    lettersImage.src = "./images/Characters-Set.png";
    lettersImage.addEventListener("load", handleLettersImageLoad);
    return lettersImage;
  };

  // Load game music
  const loadGameMusic = () => {
    // Handler for load game music
    const handleGameMusicLoad = () => {
      gameMusic.removeEventListener("load", handleGameMusicLoad);
    };
    // Add handler for load game music
    const gameMusic = new Audio("./sounds/RetroRulez.mp3");
    gameMusic.addEventListener("load", handleGameMusicLoad);
    return gameMusic;
  };

  // Load positive hit sound
  const loadPositiveHitSound = () => {
    // Handler for load positive hit sound
    const handlepositiveHitSoundLoad = () => {
      positiveHitSound.removeEventListener("load", handlepositiveHitSoundLoad);
    };
    // Add handler for load positive hit sound
    const positiveHitSound = new Audio("./sounds/PosHit.mp3");
    positiveHitSound.addEventListener("load", handlepositiveHitSoundLoad);
    return positiveHitSound;
  };

  // Load negative hit sound
  const loadNegativeHitSound = () => {
    // Handler for load negative hit sound
    const handleNegativeHitSoundLoad = () => {
      negativeHitSound.removeEventListener("load", handleNegativeHitSoundLoad);
    };
    // Add handler for load negative hit sound
    const negativeHitSound = new Audio("./sounds/NegHit.mp3");
    negativeHitSound.addEventListener("load", handleNegativeHitSoundLoad);
    return negativeHitSound;
  };

  // Initialize xy offset of each letter in letters image
  const initializeLetterObjects = (
    { alphabetCharacters, letterConstants },
    { letterObjects }
  ) => {
    const { width, height, horizontalGap, verticalGap } = letterConstants;
    let [xOffset, yOffset] = [5, 8];
    alphabetCharacters.forEach((character) => {
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
    });
  };

  // Create spaceship object
  const initializeSpaceshipObject = ({ spaceshipImage, elements }) => {
    const spaceship = new SpaceshipObject(
      10,
      elements.canvas.height / 2,
      163,
      16,
      spaceshipImage
    );
    return spaceship;
  };

  // Create shot object
  const initializeShotObject = ({ shotImage, elements }) => {
    const shot = new ShotObject(
      116,
      elements.canvas.height / 2,
      23,
      16,
      shotImage
    );
    return shot;
  };

  // Initialize start xy position on display of each letter
  const initializeFlyingLetters = (
    { elements, flyingLetters, letterConstants },
    { letters }
  ) => {
    const { width, height, maxVerticalSpeed } = letterConstants;
    for (let i = 0; i < flyingLetters[startIndex].length; i++) {
      const xPosition =
        elements.canvas.width - Math.floor(Math.random() * 500) - width;
      const yPosition = height + Math.floor(Math.random() * 500);
      const yDirection = 1 + Math.floor(Math.random() * maxVerticalSpeed);
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
  };

  // Initialize and play game music
  const initializeGameMusic = ({ gameMusic }) => {
    gameMusic.loop = "loop";
    gameMusic.play();
  };

  // Add mouse up or down handler
  const addMouseUpDownHandler = (constants) => {
    // Handler for mouse move up or down
    const handleMouseUpDown = (event, constants) => {
      // Get vertical spacehip position
      const calculateSpaceshipPosition = (
        { clientY },
        { spaceship, elements }
      ) => {
        const { height } = spaceship;
        clientY > 4 * height &&
          clientY < elements.canvas.height - 8 * height &&
          (spaceship.yPosition = clientY);
      };
      calculateSpaceshipPosition(event, constants);
    };
    // Add handler for mouse move up or down
    variables.handleMouseUpDownCallback = (event) => {
      handleMouseUpDown(event, constants);
    };
    document.addEventListener("mousemove", variables.handleMouseUpDownCallback);
  };

  // Add click on left mouse button handler
  const addLeftMouseButtonHandler = (constants, variables) => {
    // Handler for click on left mouse button
    const handleLeftMouseButton = (constants, variables) => {
      // Get vertical shot position
      const calcualteShotPosition = (
        { shot, spaceship, letterConstants },
        variables
      ) => {
        variables.isShotEnabled = true;
        shot.yPosition = spaceship.yPosition + letterConstants.horizontalGap;
      };
      calcualteShotPosition(constants, variables);
    };
    // Add handler for click on left mouse button
    variables.handleLeftMouseButtonCallback = () => {
      handleLeftMouseButton(constants, variables);
    };
    document.addEventListener(
      "mousedown",
      variables.handleLeftMouseButtonCallback
    );
  };

  constants.bgImage = loadBgImage();
  constants.spaceshipImage = loadSpaceshipImage();
  constants.shotImage = loadShotImage();
  constants.lifeImage = loadLifeImage();
  constants.lettersImage = loadLettersImage();
  constants.gameMusic = loadGameMusic();
  constants.positiveHitSound = loadPositiveHitSound();
  constants.negativeHitSound = loadNegativeHitSound();
  initializeLetterObjects(constants, variables);
  constants.spaceship = initializeSpaceshipObject(constants);
  constants.shot = initializeShotObject(constants);
  initializeFlyingLetters(constants, variables);
  initializeGameMusic(constants);
  addMouseUpDownHandler(constants);
  addLeftMouseButtonHandler(constants, variables);
  gameContainer.classList.remove("displayOff");

  // Display background picture
  const displayBgPicture = ({ bgImage, renderingContext }) => {
    renderingContext.drawImage(bgImage, 0, 0);
  };

  // Display spaceship
  const displaySpaceship = ({ spaceship, renderingContext }) => {
    const { xPosition, yPosition, imageUrl } = spaceship;
    renderingContext.drawImage(
      imageUrl,
      0,
      0,
      110,
      55,
      xPosition,
      yPosition,
      110,
      55
    );
  };

  // Display shot
  const shootBullet = (
    { shotHorizontalSpeed, elements, renderingContext, shot },
    variables
  ) => {
    // only if shot enabled
    if (variables.isShotEnabled) {
      const { xPosition, yPosition, imageUrl } = shot;
      renderingContext.drawImage(imageUrl, xPosition, yPosition);
      shot.xPosition += shotHorizontalSpeed;
      // Check shot against right border
      shot.xPosition > elements.canvas.width &&
        ([variables.isShotEnabled, shot.xPosition] = [false, 116]);
    }
  };

  // Check if missing letter was hit
  const checkMissingLetter = (constants, variables, i) => {
    // Insert hit letter in assembled word
    const insertHitLetter = (constants, variables, i) => {
      const { positiveHitSound } = constants;
      const { letters } = variables;
      let buffer = "";
      for (let j = 0; j < currentTemplateWord.length; j++) {
        if (letters[i].character === currentTemplateWord[j]) {
          positiveHitSound.play();
          variables.score += constants.scoreCountStep;
          for (let k = 0; k < assembledWord.length; k++) {
            j === k
              ? (buffer += letters[i].character)
              : (buffer += assembledWord[k]);
          }
          assembledWord = buffer;
          currentTemplateWord = currentTemplateWord.replace(
            letters[i].character,
            " "
          ); // Clear hit letter in current template word
          return true;
        }
      }
      return false;
    };

    // Reduce energy if wrong letter was hit
    const reduceEnergy = (
      { maxEnergy, energyCountStep, negativeHitSound },
      variables
    ) => {
      negativeHitSound.play();
      variables.energy > energyCountStep
        ? (variables.energy -= energyCountStep)
        : (variables.lives -= 1) === 0
        ? (variables.isGameOver = true)
        : (variables.energy = maxEnergy);
    };
    !insertHitLetter(constants, variables, i) &&
      reduceEnergy(constants, variables);

    // Check if all missed letters are hit
    for (let k = 0; k < currentTemplateWord.length; k++) {
      if (currentTemplateWord[k] !== " ") {
        return false;
      }
    }
    return true;
  };

  // Check collision shot vs. letter(s)
  const checkLetterHit = (constants, variables, i) => {
    const { shot } = constants;
    const { letters } = variables;
    const { xPosition, yPosition, width, height } = shot;
    // ( shot.xr >= letter.xl ) && ( shot.xl <= letter.xr )
    const xCollisionCheck1 =
      xPosition + width >= letters[i].xPosition &&
      xPosition <= letters[i].xPosition + letters[i].width;
    // ( shot.yt >= letter.yt ) && ( shot.yt <= letter.yb )
    const yCollisionCheck1 =
      yPosition >= letters[i].yPosition &&
      yPosition <= letters[i].yPosition + letters[i].height;
    // ( shot.yb <= letter.yb ) && ( shot.yt >= letter.yt )
    const yCollisionCheck2 =
      yPosition + height <= letters[i].yPosition + letters[i].height &&
      yPosition >= letters[i].yPosition;
    if (xCollisionCheck1 && (yCollisionCheck1 || yCollisionCheck2)) {
      variables.isNextLevel = checkMissingLetter(constants, variables, i);
      letters.splice(i, 1);
      variables.isShotEnabled = false;
      shot.xPosition = 116;
      return true;
    }
    return false;
  };

  // Display letters and do collision check if shot is enabled
  const moveLetters = (constants, variables) => {
    const {
      lettersImage,
      renderingContext,
      alphabetCharacters,
      letterConstants,
    } = constants;
    const { isShotEnabled, letterObjects, letters } = variables;
    for (let i = 0; i < letters.length; i++) {
      const currentCharacter = letters[i].character;
      let currentLetter = null;
      for (j = 0; j < alphabetCharacters.length; j++) {
        if (currentCharacter === letterObjects[j].character) {
          currentLetter = letterObjects[j];
          break;
        }
      }
      const { width, height } = letterConstants;
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
      if (isShotEnabled && checkLetterHit(constants, variables, i)) {
        continue;
      }
      (letters[i].yPosition < 0 ||
        letters[i].yPosition > 600 - letterConstants.height) &&
        (letters[i].yDirection *= -1); // Top / bottom border check with vertical direction change
      letters[i].yPosition += letters[i].yDirection;
    }
  };

  // Display energy left at the left top of the screen
  const displayEnergy = ({ renderingContext }, { energy }) => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText("Energy", 10, 30);
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillRect(110, 15, energy, 16);
  };

  // Display current player score in the centre of the top screen
  const displayScore = ({ renderingContext }, { score }) => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      `Score ${score.toString().padStart(6, 0, 0)}`,
      320,
      30
    );
  };

  // Display number of lives left at the right top of the screen
  const displayLives = ({ lifeImage, renderingContext }, { lives }) => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText("Lives", 630, 30);
    // Display life symbols only if lives are left
    if (lives !== 0) {
      let livesStartXPosition = 705;
      for (let i = 0; i < lives; i++) {
        renderingContext.drawImage(lifeImage, livesStartXPosition, 17);
        livesStartXPosition += 30;
      }
    }
  };

  // Display template word at the left bottom of the screen
  const displayTemplateWord = ({
    renderingContext,
    elements,
    templateWords,
  }) => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillText(
      templateWords[startIndex],
      10,
      elements.canvas.height - 15
    );
  };

  // Display assembled word at the right bottom of the screen
  const displayAssembledWord = ({ renderingContext, elements }) => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(assembledWord, 620, elements.canvas.height - 15);
  };

  // Get next random template word if all missing letters were hit
  const checkTemplateWord = (constants, variables) => {
    const { templateWords } = constants;
    const { letters } = variables;
    while (startIndex === oldStartIndex)
      startIndex = Math.floor(Math.random() * templateWords.length);
    [oldStartIndex, assembledWord, variables.isNextLevel] = [
      startIndex,
      definedAssembledWord,
      false,
    ];
    currentTemplateWord = templateWords[startIndex];
    letters.splice(0, letters.length);
    initializeFlyingLetters(constants, variables);
  };

  // Stop game if no lives left
  const stopGame = (constants, variables) => {
    const { gameContainer } = constants.elements;

    // Stop interval
    const stopInterval = ({ intervalId, requestId }) => {
      if (intervalId) {
        clearInterval(intervalId);
        variables.intervalId = null;
      }
      if (requestId) {
        cancelAnimationFrame(requestId);
        variables.requestId = null;
      }
    };

    // Remove event listeners
    const removeMouseEventListeners = () => {
      document.removeEventListener(
        "mousemove",
        variables.handleMouseUpDownCallback
      );
      document.removeEventListener(
        "mousedown",
        variables.handleLeftMouseButtonCallback
      );
    };

    // Stop game music
    const stopGameMusic = ({ gameMusic }) => {
      gameMusic.currentTime = 0;
      gameMusic.pause();
      gameMusic.currentTime = 0;
    };

    stopInterval(variables);
    removeMouseEventListeners();
    stopGameMusic(constants);
    gameContainer.classList.add("displayOff");
    displayGameoverScreen(constants, variables);
  };

  // Render all game elements 60 frames per second
  const renderAll = (constants, variables) => {
    const { isNextLevel, isGameOver } = variables;
    displayBgPicture(constants); // Always display background picture
    isNextLevel && checkTemplateWord(constants, variables); // Check template word if level is finished
    if (isGameOver) {
      stopGame(constants, variables);
    }
    // Graphic elements only displayed if game not over
    else {
      displaySpaceship(constants);
      shootBullet(constants, variables);
      moveLetters(constants, variables);
      displayEnergy(constants, variables);
      displayScore(constants, variables);
      displayLives(constants, variables);
      displayTemplateWord(constants);
      displayAssembledWord(constants);
    }
  };

  // Start game by interval
  const startInterval = (variables) => {
    variables.intervalId = setInterval(
      () =>
        (variables.requestId = requestAnimationFrame(() => {
          renderAll(constants, variables);
        })),
      10 // 60 frames per second
    );
  };

  startInterval(variables);
};

// ---------- Display splash screen ----------
const displaySplashScreen = (constants, variables) => {
  const { splashContainer } = constants.elements;

  // Handler for click on start button
  const handleStartButton = (constants, variables) => {
    // Initialize game start
    const initializeGameScreen = (constants, variables) => {
      const { splashContainer, startButton } = constants.elements;
      // Remove handler for click on start button
      startButton.removeEventListener(
        "click",
        variables.handleStartButtonCallback
      );
      splashContainer.classList.add("displayOff");
      displayGameScreen(constants, variables);
    };
    initializeGameScreen(constants, variables);
  };
  // Add handler for click on start button
  variables.handleStartButtonCallback = () => {
    handleStartButton(constants, variables);
  };
  constants.elements.startButton.addEventListener(
    "click",
    variables.handleStartButtonCallback
  );
  splashContainer.classList.remove("displayOff");
};

// Start game
displaySplashScreen(constants, variables);
