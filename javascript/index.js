const constants = {
  maxLives: 3,
  maxEnergy: 90,
  energyCountStep: 30,
  scoreCountStep: 100,
  shotHorizontalSpeed: 15,
  backgroundImage: null,
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
    highscoreList: document.querySelector("#highscoreList"),
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
  highscoreBuffer: [10100, 9000, 1000],
};

const { maxEnergy, maxLives } = constants;

const variables = {
  energy: maxEnergy,
  score: 0,
  lives: maxLives,
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

const addLoadEventHandler = (element, eventHandler) => {
  element.addEventListener("load", eventHandler);
};

const displayGameoverScreen = ({ constants, variables }) => {
  const loadGameOverSound = () => {
    const handleLoadGameOverSound = () => {
      gameOverSound.removeEventListener("load", handleLoadGameOverSound);
    };

    const gameOverSound = new Audio("./sounds/GameOver.mp3");
    addLoadEventHandler(gameOverSound, handleLoadGameOverSound);
    return gameOverSound;
  };

  const playGameoverSound = ({ gameOverSound }) => {
    gameOverSound.play();
  };

  const createHighscoreTable = ({ constants, variables }) => {
    const updateHighscoreBuffer = (score, highscoreBuffer) => {
      if (highscoreBuffer.length < 10 && score !== 0) {
        highscoreBuffer.push(score);
        highscoreBuffer.sort((a, b) => b - a);
      }
    };

    const createHighscoreListElements = (highscoreBuffer, highscoreList) => {
      const clearHighscroreList = (highscoreList) => {
        highscoreList.innerHTML = "";
      };

      clearHighscroreList(highscoreList);
      highscoreBuffer.forEach((singleScore) => {
        let scoreEntry = document.createElement("li");
        scoreEntry.innerText = singleScore.toString().padStart(6, 0, 0);
        highscoreList.appendChild(scoreEntry);
      });
    };

    const { highscoreBuffer, elements } = constants;
    const { highscoreList } = elements;
    const { score } = variables;
    updateHighscoreBuffer(score, highscoreBuffer);
    createHighscoreListElements(highscoreBuffer, highscoreList);
  };

  const handleRestartButton = ({ constants, variables }) => {
    const initializeGameRestart = ({ constants, variables }) => {
      const removeRestartButtonHandler = (restartButton, variables) => {
        restartButton.removeEventListener(
          "click",
          variables.handleRestartButtonCallback
        );
      };

      const clearHighscroreList = (highscoreList) => {
        highscoreList.innerHTML = "";
      };

      const resetAllVariables = ({ constants, variables }) => {
        const { maxEnergy, maxLives } = constants;
        variables.energy = maxEnergy;
        variables.score = 0;
        variables.lives = maxLives;
        variables.isNextLevel = false;
        variables.isGameOver = false;
        variables.isShotEnabled = false;
        variables.letterObjects = [];
        variables.letters = [];
      };

      const { gameOverContainer, highscoreList, restartButton } =
        constants.elements;
      removeRestartButtonHandler(restartButton, variables);
      clearHighscroreList(highscoreList);
      resetAllVariables({ constants, variables });
      gameOverContainer.classList.add("displayOff");
      displayGameScreen({ constants, variables });
    };

    initializeGameRestart({ constants, variables });
  };

  const addRestartButtonHandler = (
    restartButton,
    handleRestartButton,
    { constants, variables }
  ) => {
    variables.handleRestartButtonCallback = () => {
      handleRestartButton({ constants, variables });
    };

    restartButton.addEventListener(
      "click",
      variables.handleRestartButtonCallback
    );
  };

  constants.gameOverSound = loadGameOverSound();
  playGameoverSound(constants);
  createHighscoreTable({ constants, variables });
  const { gameOverContainer, restartButton } = constants.elements;
  addRestartButtonHandler(restartButton, handleRestartButton, {
    constants,
    variables,
  });
  gameOverContainer.classList.remove("displayOff");
};

const displayGameScreen = ({ constants, variables }) => {
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

  const loadBackgroundImage = () => {
    const handleloadBackgroundImage = () => {
      backgroundImage.removeEventListener("load", handleloadBackgroundImage);
    };

    const backgroundImage = document.createElement("img");
    backgroundImage.src = "./images/Andromeda.png";
    addLoadEventHandler(backgroundImage, handleloadBackgroundImage);
    return backgroundImage;
  };

  const loadSpaceshipImage = () => {
    const handleLoadSpaceshipImage = () => {
      spaceshipImage.removeEventListener("load", handleLoadSpaceshipImage);
    };

    const spaceshipImage = document.createElement("img");
    spaceshipImage.src = "./images/Ships.png";
    addLoadEventHandler(spaceshipImage, handleLoadSpaceshipImage);
    return spaceshipImage;
  };

  const loadShotImage = () => {
    const handleLoadShotImage = () => {
      shotImage.removeEventListener("load", handleLoadShotImage);
    };

    const shotImage = document.createElement("img");
    shotImage.src = "./images/Shot.png";
    addLoadEventHandler(shotImage, handleLoadShotImage);
    return shotImage;
  };

  const loadLifeImage = () => {
    const handleLoadLifeImage = () => {
      lifeImage.removeEventListener("load", handleLoadLifeImage);
    };

    const lifeImage = document.createElement("img");
    lifeImage.src = "./images/Ship-sm.png";
    addLoadEventHandler(lifeImage, handleLoadLifeImage);
    return lifeImage;
  };

  const loadLettersImage = () => {
    const handleLoadLettersImage = () => {
      lettersImage.removeEventListener("load", handleLoadLettersImage);
    };

    const lettersImage = document.createElement("img");
    lettersImage.src = "./images/Characters-Set.png";
    addLoadEventHandler(lettersImage, handleLoadLettersImage);
    return lettersImage;
  };

  const loadGameMusic = () => {
    const handleLoadGameMusic = () => {
      gameMusic.removeEventListener("load", handleLoadGameMusic);
    };

    const gameMusic = new Audio("./sounds/RetroRulez.mp3");
    addLoadEventHandler(gameMusic, handleLoadGameMusic);
    return gameMusic;
  };

  const loadPositiveHitSound = () => {
    const handleLoadpositiveHitSound = () => {
      positiveHitSound.removeEventListener("load", handleLoadpositiveHitSound);
    };

    const positiveHitSound = new Audio("./sounds/PosHit.mp3");
    addLoadEventHandler(positiveHitSound, handleLoadpositiveHitSound);
    return positiveHitSound;
  };

  const loadNegativeHitSound = () => {
    const handleLoadNegativeHitSound = () => {
      negativeHitSound.removeEventListener("load", handleLoadNegativeHitSound);
    };

    const negativeHitSound = new Audio("./sounds/NegHit.mp3");
    addLoadEventHandler(negativeHitSound, handleLoadNegativeHitSound);
    return negativeHitSound;
  };

  const initializeLetterObjects = ({ constants, variables }) => {
    const { alphabetCharacters, letterConstants } = constants;
    const { letterObjects } = variables;
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

  const initializeFlyingLetters = ({ constants, variables }) => {
    const { flyingLetters, letterConstants, elements } = constants;
    const { letters } = variables;
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
        if (
          clientY > 4 * height &&
          clientY < elements.canvas.height - 8 * height
        ) {
          spaceship.yPosition = clientY;
        }
      };

      calculateSpaceshipPosition(event, constants);
    };

    variables.handleMouseUpDownCallback = (event) => {
      handleMouseUpDown(event, constants);
    };

    document.addEventListener("mousemove", variables.handleMouseUpDownCallback);
  };

  const addLeftMouseButtonHandler = ({ constants, variables }) => {
    const handleLeftMouseButton = ({ constants, variables }) => {
      const calcualteVerticalShotPosition = ({ constants, variables }) => {
        const { shot, spaceship, letterConstants } = constants;
        variables.isShotEnabled = true;
        shot.yPosition = spaceship.yPosition + letterConstants.horizontalGap;
      };

      calcualteVerticalShotPosition({ constants, variables });
    };

    variables.handleLeftMouseButtonCallback = () => {
      handleLeftMouseButton({ constants, variables });
    };

    document.addEventListener(
      "mousedown",
      variables.handleLeftMouseButtonCallback
    );
  };

  constants.backgroundImage = loadBackgroundImage();
  constants.spaceshipImage = loadSpaceshipImage();
  constants.shotImage = loadShotImage();
  constants.lifeImage = loadLifeImage();
  constants.lettersImage = loadLettersImage();
  constants.gameMusic = loadGameMusic();
  constants.positiveHitSound = loadPositiveHitSound();
  constants.negativeHitSound = loadNegativeHitSound();
  initializeLetterObjects({ constants, variables });
  constants.spaceship = createSpaceshipObject(constants);
  constants.shot = createShotObject(constants);
  initializeFlyingLetters({ constants, variables });
  initializeGameMusic(constants);
  addMouseUpDownHandler(constants);
  addLeftMouseButtonHandler({ constants, variables });
  gameContainer.classList.remove("displayOff");

  const displayBackgroundPicture = ({ backgroundImage, renderingContext }) => {
    renderingContext.drawImage(backgroundImage, 0, 0);
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

  const moveShot = ({ constants, variables }) => {
    const checkShotCollisionWithRightBorder = (
      shot,
      { constants, variables }
    ) => {
      const { elements } = constants;
      if (shot.xPosition > elements.canvas.width) {
        [variables.isShotEnabled, shot.xPosition] = [false, 116];
      }
    };

    const { shotHorizontalSpeed, renderingContext, shot } = constants;
    const { xPosition, yPosition, imageUrl } = shot;
    renderingContext.drawImage(imageUrl, xPosition, yPosition);
    shot.xPosition += shotHorizontalSpeed;
    checkShotCollisionWithRightBorder(shot, { constants, variables });
  };

  const checkMissingLetterHit = (i, { constants, variables }) => {
    const insertHitLetterInAssembledWord = (i, { constants, variables }) => {
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
          );
          return true;
        }
      }
      return false;
    };

    const reduceEnergy = ({ constants, variables }) => {
      const { maxEnergy, energyCountStep, negativeHitSound } = constants;
      negativeHitSound.play();
      variables.energy > energyCountStep
        ? (variables.energy -= energyCountStep)
        : (variables.lives -= 1) === 0
        ? (variables.isGameOver = true)
        : (variables.energy = maxEnergy);
    };

    const checkAllMissedLettersHit = () => {
      for (let k = 0; k < currentTemplateWord.length; k++) {
        if (currentTemplateWord[k] !== " ") {
          return false;
        }
      }
      return true;
    };

    const isMissedLetterHit = insertHitLetterInAssembledWord(i, {
      constants,
      variables,
    });
    !isMissedLetterHit && reduceEnergy({ constants, variables });
    const isAllMissedLettersHit = checkAllMissedLettersHit();
    return isAllMissedLettersHit;
  };

  const checkShotCollisionWithLetters = (i, { constants, variables }) => {
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
      variables.isNextLevel = checkMissingLetterHit(i, {
        constants,
        variables,
      });
      letters.splice(i, 1);
      variables.isShotEnabled = false;
      shot.xPosition = 116;
      return true;
    }
    return false;
  };

  const moveLetters = ({ constants, variables }) => {
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
      const isShotCollisionWithLetters = checkShotCollisionWithLetters(i, {
        constants,
        variables,
      });
      if (isShotEnabled && isShotCollisionWithLetters) {
        continue;
      }
      if (
        letters[i].yPosition < 0 ||
        letters[i].yPosition > 600 - letterConstants.height
      ) {
        letters[i].yDirection *= -1;
      }
      letters[i].yPosition += letters[i].yDirection;
    }
  };

  const displayEnergy = ({ constants, variables }) => {
    const { renderingContext } = constants;
    const { energy } = variables;
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText("Energy", 10, 30);
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillRect(
      110, // left top of the screen
      15,
      energy,
      16
    );
  };

  const displayScore = ({ constants, variables }) => {
    const { renderingContext } = constants;
    const { score } = variables;
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      `Score ${score.toString().padStart(6, 0, 0)}`,
      320, // centre of the top screen
      30
    );
  };

  const displayLives = ({ constants, variables }) => {
    const { lifeImage, renderingContext } = constants;
    const { lives } = variables;
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      "Lives",
      630, // right top of the screen
      30
    );
    if (lives !== 0) {
      let livesStartXPosition = 705;
      for (let i = 0; i < lives; i++) {
        renderingContext.drawImage(
          lifeImage,
          livesStartXPosition, // right top of the screen
          17
        );
        livesStartXPosition += 30;
      }
    }
  };

  const displayTemplateWord = ({
    renderingContext,
    elements,
    templateWords,
  }) => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillText(
      templateWords[startIndex],
      10, // left bottom of the screen
      elements.canvas.height - 15
    );
  };

  const displayAssembledWord = ({ renderingContext, elements }) => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      assembledWord,
      620, // right bottom of the screen
      elements.canvas.height - 15
    );
  };

  const getNextTemplateWord = ({ constants, variables }) => {
    const { templateWords } = constants;
    const { letters } = variables;
    while (startIndex === oldStartIndex) {
      startIndex = Math.floor(Math.random() * templateWords.length);
    }
    [oldStartIndex, assembledWord, variables.isNextLevel] = [
      startIndex,
      definedAssembledWord,
      false,
    ];
    currentTemplateWord = templateWords[startIndex];
    letters.splice(0, letters.length);
    initializeFlyingLetters({ constants, variables });
  };

  const stopGame = ({ constants, variables }) => {
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

    const removeMouseHandlers = () => {
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

    const { gameContainer } = constants.elements;
    stopInterval(variables);
    removeMouseHandlers();
    stopGameMusic(constants);
    gameContainer.classList.add("displayOff");
    displayGameoverScreen({ constants, variables });
  };

  const renderGameElements = ({ constants, variables }) => {
    const { isNextLevel, isGameOver } = variables;
    displayBackgroundPicture(constants);
    isNextLevel && getNextTemplateWord({ constants, variables });
    if (isGameOver) {
      stopGame({ constants, variables });
    } else {
      displaySpaceship(constants);
      if (variables.isShotEnabled) {
        moveShot({ constants, variables });
      }
      moveLetters({ constants, variables });
      displayEnergy({ constants, variables });
      displayScore({ constants, variables });
      displayLives({ constants, variables });
      displayTemplateWord(constants);
      displayAssembledWord(constants);
    }
  };

  const startInterval = (variables) => {
    variables.intervalId = setInterval(
      () =>
        (variables.requestId = requestAnimationFrame(() => {
          renderGameElements({ constants, variables });
        })),
      10 // 60 frames per second
    );
  };

  startInterval(variables);
};

const displaySplashScreen = ({ constants, variables }) => {
  const handleStartButton = ({ constants, variables }) => {
    const initializeGameScreen = ({ constants, variables }) => {
      const { splashContainer, startButton } = constants.elements;
      startButton.removeEventListener(
        "click",
        variables.handleStartButtonCallback
      );
      splashContainer.classList.add("displayOff");
      displayGameScreen({ constants, variables });
    };
    initializeGameScreen({ constants, variables });
  };

  const addStartButtonHandler = (
    handleStartButton,
    { constants, variables }
  ) => {
    variables.handleStartButtonCallback = () => {
      handleStartButton({ constants, variables });
    };

    constants.elements.startButton.addEventListener(
      "click",
      variables.handleStartButtonCallback
    );
  };

  addStartButtonHandler(handleStartButton, { constants, variables });
  const { splashContainer } = constants.elements;
  splashContainer.classList.remove("displayOff");
};

displaySplashScreen({ constants, variables }); // Start game
