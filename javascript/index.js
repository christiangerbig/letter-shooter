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
    splashContainer: document.querySelector("#splash-container"),
    startButton: document.querySelector("#start-button"),
    gameContainer: document.querySelector("#game-container"),
    canvas: document.querySelector("canvas"),
    gameOverContainer: document.querySelector("#game-over-container"),
    highscoresList: document.querySelector("#highscores-list"),
    restartButton: document.querySelector("#restart-button"),
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
  highscores: [10100, 9000, 1000],
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

const displayGameOverScreen = ({ constants, variables }) => {
  const loadGameOverSound = () => {
    const gameOverSound = new Audio("./sounds/GameOver.mp3");
    return gameOverSound;
  };

  const playGameoverSound = ({ gameOverSound }) => {
    gameOverSound.play();
  };

  const updateHighscores = (score, highscores) => {
    if (highscores.length < 10 && score !== 0) {
      highscores.push(score);
      highscores.sort((a, b) => b - a);
    }
  };

  const clearHighscoresList = (highscoresList) => {
    highscoresList.innerHTML = "";
  };

  const createHighscoresList = (highscores, highscoresList) => {
    highscores.forEach((singleScore) => {
      let scoreEntry = document.createElement("li");
      scoreEntry.innerText = singleScore.toString().padStart(6, 0, 0);
      highscoresList.appendChild(scoreEntry);
    });
  };

  const createHighscoreTable = ({ constants, variables }) => {
    const {
      highscores,
      elements: { highscoresList },
    } = constants;
    const { score } = variables;
    updateHighscores(score, highscores);
    clearHighscoresList(highscoresList);
    createHighscoresList(highscores, highscoresList);
  };

  const resetAllVariables = ({
    constants: { maxEnergy, maxLives },
    variables,
  }) => {
    variables.energy = maxEnergy;
    variables.score = 0;
    variables.lives = maxLives;
    variables.isNextLevel = false;
    variables.isGameOver = false;
    variables.isShotEnabled = false;
    variables.letterObjects = [];
    variables.letters = [];
  };

  const handleRestartButton = ({ constants, variables }) => {
    const {
      elements: { gameOverContainer, highscoresList },
    } = constants;
    clearHighscoresList(highscoresList);
    resetAllVariables({ constants, variables });
    gameOverContainer.classList.add("is-display-off");
    displayGameScreen({ constants, variables });
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
      variables.handleRestartButtonCallback,
      { once: true }
    );
  };

  constants.gameOverSound = loadGameOverSound();
  playGameoverSound(constants);
  createHighscoreTable({ constants, variables });
  const {
    elements: { gameOverContainer, restartButton },
  } = constants;
  addRestartButtonHandler(restartButton, handleRestartButton, {
    constants,
    variables,
  });
  gameOverContainer.classList.remove("is-display-off");
};

const displayGameScreen = ({ constants, variables }) => {
  const {
    elements: { canvas },
    templateWords,
  } = constants;
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
    const backgroundImage = document.createElement("img");
    backgroundImage.src = "./images/Andromeda.png";
    return backgroundImage;
  };

  const loadSpaceshipImage = () => {
    const spaceshipImage = document.createElement("img");
    spaceshipImage.src = "./images/Ships.png";
    return spaceshipImage;
  };

  const loadShotImage = () => {
    const shotImage = document.createElement("img");
    shotImage.src = "./images/Shot.png";
    return shotImage;
  };

  const loadLifeImage = () => {
    const lifeImage = document.createElement("img");
    lifeImage.src = "./images/Ship-sm.png";
    return lifeImage;
  };

  const loadLettersImage = () => {
    const lettersImage = document.createElement("img");
    lettersImage.src = "./images/Characters-Set.png";
    return lettersImage;
  };

  const loadGameMusic = () => {
    const gameMusic = new Audio("./sounds/RetroRulez.mp3");
    return gameMusic;
  };

  const loadPositiveHitSound = () => {
    const positiveHitSound = new Audio("./sounds/PosHit.mp3");
    return positiveHitSound;
  };

  const loadNegativeHitSound = () => {
    const negativeHitSound = new Audio("./sounds/NegHit.mp3");
    return negativeHitSound;
  };

  const initializeLetterObjects = ({ constants, variables }) => {
    const {
      alphabetCharacters,
      letterConstants: { width, height, horizontalGap, verticalGap },
    } = constants;
    const { letterObjects } = variables;
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
    const {
      flyingLetters,
      letterConstants: { width, height, maxVerticalSpeed },
      elements,
    } = constants;
    const { letters } = variables;
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

  const initializeGameObjects = ({ constants, variables }) => {
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
  };

  const displayBackgroundPicture = ({ backgroundImage, renderingContext }) => {
    renderingContext.drawImage(backgroundImage, 0, 0);
  };

  const displaySpaceship = ({
    spaceship: { xPosition, yPosition, imageUrl },
    renderingContext,
  }) => {
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
      const {
        elements: { canvas },
      } = constants;
      if (shot.xPosition > canvas.width) {
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

    const reduceEnergy = ({
      constants: { maxEnergy, energyCountStep, negativeHitSound },
      variables,
    }) => {
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
      letterConstants: { width, height },
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
      if (letters[i].yPosition < 0 || letters[i].yPosition > 600 - height) {
        letters[i].yDirection *= -1;
      }
      letters[i].yPosition += letters[i].yDirection;
    }
  };

  const displayEnergy = ({
    constants: { renderingContext },
    variables: { energy },
  }) => {
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

  const displayScore = ({
    constants: { renderingContext },
    variables: { score },
  }) => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      `Score ${score.toString().padStart(6, 0, 0)}`,
      320, // centre of the top screen
      30
    );
  };

  const displayLives = ({
    constants: { lifeImage, renderingContext },
    variables: { lives },
  }) => {
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

  const fetchNextTemplateWord = ({ constants, variables }) => {
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

  const stopGame = ({ constants, variables }) => {
    const {
      elements: { gameContainer },
    } = constants;
    stopInterval(variables);
    removeMouseHandlers();
    stopGameMusic(constants);
    gameContainer.classList.add("is-display-off");
    displayGameOverScreen({ constants, variables });
  };

  const renderGameElements = ({ constants, variables }) => {
    const { isNextLevel, isGameOver } = variables;
    displayBackgroundPicture(constants);
    isNextLevel && fetchNextTemplateWord({ constants, variables });
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
        const {
          shot,
          spaceship: { yPosition },
          letterConstants: { horizontalGap },
        } = constants;
        variables.isShotEnabled = true;
        shot.yPosition = yPosition + horizontalGap;
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

  const startInterval = (variables) => {
    variables.intervalId = setInterval(
      () => {
        variables.requestId = requestAnimationFrame(() => {
          renderGameElements({ constants, variables });
        });
      },
      10 // 60 frames per second
    );
  };

  const startGameMusic = ({ gameMusic }) => {
    gameMusic.loop = "loop";
    gameMusic.play();
  };

  const startGame = ({ constants, variables }) => {
    addMouseUpDownHandler(constants);
    addLeftMouseButtonHandler({ constants, variables });
    constants.elements.gameContainer.classList.remove("is-display-off");
    startInterval(variables);
    startGameMusic(constants);
  };

  const handleLoadBackgroundImage = () => {
    startGame({ constants, variables });
  };

  initializeGameObjects({ constants, variables });
  constants.backgroundImage.addEventListener(
    "load",
    handleLoadBackgroundImage,
    { once: true }
  );
};

const displaySplashScreen = ({ constants, variables }) => {
  const handleStartButton = ({ constants, variables }) => {
    const initializeGameScreen = ({ constants, variables }) => {
      const {
        elements: { splashContainer },
      } = constants;
      splashContainer.classList.add("is-display-off");
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
      variables.handleStartButtonCallback,
      { once: true }
    );
  };

  addStartButtonHandler(handleStartButton, { constants, variables });
  const {
    elements: { splashContainer },
  } = constants;
  splashContainer.classList.remove("is-display-off");
};

displaySplashScreen({ constants, variables });
