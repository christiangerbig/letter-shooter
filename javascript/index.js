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

const displayGameoverScreen = (constants, variables) => {
  const { gameOverContainer, restartButton } = constants.elements;

  const loadGameOverSound = () => {
    const handleGameOverSoundLoad = () => {
      gameOverSound.removeEventListener("load", handleGameOverSoundLoad);
    };
    const gameOverSound = new Audio("./sounds/GameOver.mp3");
    gameOverSound.addEventListener("load", handleGameOverSoundLoad);
    return gameOverSound;
  };

  const playGameoverSound = ({ gameOverSound }) => {
    gameOverSound.play();
  };

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
    const handleRestartButton = (constants, variables) => {
      // Restart game
      const initializeGameRestart = (constants, variables) => {
        const { gameOverContainer, scoreList, restartButton } =
          constants.elements;
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

  const loadBgImage = () => {
    const handleBgImageLoad = () => {
      bgImage.removeEventListener("load", handleBgImageLoad);
    };
    const bgImage = document.createElement("img");
    bgImage.src = "./images/Andromeda.png";
    bgImage.addEventListener("load", handleBgImageLoad);
    return bgImage;
  };

  const loadSpaceshipImage = () => {
    const handleSpaceshipImageLoad = () => {
      spaceshipImage.removeEventListener("load", handleSpaceshipImageLoad);
    };
    const spaceshipImage = document.createElement("img");
    spaceshipImage.src = "./images/Ships.png";
    spaceshipImage.addEventListener("load", handleSpaceshipImageLoad);
    return spaceshipImage;
  };

  const loadShotImage = () => {
    const handleShotImageLoad = () => {
      shotImage.removeEventListener("load", handleShotImageLoad);
    };
    const shotImage = document.createElement("img");
    shotImage.src = "./images/Shot.png";
    shotImage.addEventListener("load", handleShotImageLoad);
    return shotImage;
  };

  const loadLifeImage = () => {
    const handleLifeImageLoad = () => {
      lifeImage.removeEventListener("load", handleLifeImageLoad);
    };
    const lifeImage = document.createElement("img");
    lifeImage.src = "./images/Ship-sm.png";
    lifeImage.addEventListener("load", handleLifeImageLoad);
    return lifeImage;
  };

  const loadLettersImage = () => {
    const handleLettersImageLoad = () => {
      lettersImage.removeEventListener("load", handleLettersImageLoad);
    };
    const lettersImage = document.createElement("img");
    lettersImage.src = "./images/Characters-Set.png";
    lettersImage.addEventListener("load", handleLettersImageLoad);
    return lettersImage;
  };

  const loadGameMusic = () => {
    const handleGameMusicLoad = () => {
      gameMusic.removeEventListener("load", handleGameMusicLoad);
    };
    const gameMusic = new Audio("./sounds/RetroRulez.mp3");
    gameMusic.addEventListener("load", handleGameMusicLoad);
    return gameMusic;
  };

  const loadPositiveHitSound = () => {
    const handlepositiveHitSoundLoad = () => {
      positiveHitSound.removeEventListener("load", handlepositiveHitSoundLoad);
    };
    const positiveHitSound = new Audio("./sounds/PosHit.mp3");
    positiveHitSound.addEventListener("load", handlepositiveHitSoundLoad);
    return positiveHitSound;
  };

  const loadNegativeHitSound = () => {
    const handleNegativeHitSoundLoad = () => {
      negativeHitSound.removeEventListener("load", handleNegativeHitSoundLoad);
    };
    const negativeHitSound = new Audio("./sounds/NegHit.mp3");
    negativeHitSound.addEventListener("load", handleNegativeHitSoundLoad);
    return negativeHitSound;
  };

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

  const createSpaceshipObject = ({ spaceshipImage, elements }) => {
    const spaceship = new SpaceshipObject(
      10,
      elements.canvas.height / 2,
      163,
      16,
      spaceshipImage
    );
    return spaceship;
  };


  const createShotObject = ({ shotImage, elements }) => {
    const shot = new ShotObject(
      116,
      elements.canvas.height / 2,
      23,
      16,
      shotImage
    );
    return shot;
  };

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

  const initializeGameMusic = ({ gameMusic }) => {
    gameMusic.loop = "loop";
    gameMusic.play();
  };

  const addMouseUpDownHandler = (constants) => {
    const handleMouseUpDown = (event, constants) => {
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
    variables.handleMouseUpDownCallback = (event) => {
      handleMouseUpDown(event, constants);
    };
    document.addEventListener("mousemove", variables.handleMouseUpDownCallback);
  };

  const addLeftMouseButtonHandler = (constants, variables) => {
    const handleLeftMouseButton = (constants, variables) => {
      const calcualteVerticalShotPosition = (
        { shot, spaceship, letterConstants },
        variables
      ) => {
        variables.isShotEnabled = true;
        shot.yPosition = spaceship.yPosition + letterConstants.horizontalGap;
      };
      calcualteVerticalShotPosition(constants, variables);
    };
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
  constants.spaceship = createSpaceshipObject(constants);
  constants.shot = createShotObject(constants);
  initializeFlyingLetters(constants, variables);
  initializeGameMusic(constants);
  addMouseUpDownHandler(constants);
  addLeftMouseButtonHandler(constants, variables);
  gameContainer.classList.remove("displayOff");

  const displayBgPicture = ({ bgImage, renderingContext }) => {
    renderingContext.drawImage(bgImage, 0, 0);
  };

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

  const displayShot = (
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

  const checkMissingLetterHit = (constants, variables, i) => {
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

  const checkCollisionShotVsLetters = (constants, variables, i) => {
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
      variables.isNextLevel = checkMissingLetterHit(constants, variables, i);
      letters.splice(i, 1);
      variables.isShotEnabled = false;
      shot.xPosition = 116;
      return true;
    }
    return false;
  };

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
      if (isShotEnabled && checkCollisionShotVsLetters(constants, variables, i)) {
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

  const stopGame = (constants, variables) => {
    const { gameContainer } = constants.elements;

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
      displayShot(constants, variables);
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

const displaySplashScreen = (constants, variables) => {
  const { splashContainer } = constants.elements;

  const handleStartButton = (constants, variables) => {
    const initializeGameScreen = (constants, variables) => {
      const { splashContainer, startButton } = constants.elements;
      startButton.removeEventListener(
        "click",
        variables.handleStartButtonCallback
      );
      splashContainer.classList.add("displayOff");
      displayGameScreen(constants, variables);
    };
    initializeGameScreen(constants, variables);
  };
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
