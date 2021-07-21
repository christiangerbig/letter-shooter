// ---------- Global ----------
// Initialize constants
const maxLives = 3
const maxEnergy = 90;
const energyCountdownStep = 30;
const shotHorizontalSpeed = 15;

// Initialize object
let game = {
  energy: maxEnergy,
  score: 0,
  lives: maxLives,
  isNextLevel: false, 
  isGameOver: false,
  isShotEnabled: false,
  intervalId: null,
  elements: {
    splashContainer: document.querySelector("#splashContainer"),
    startButton: document.querySelector("#startButton"),
    gameContainer: document.querySelector("#gameContainer"),
    canvas: document.querySelector("canvas"),
    gameOverContainer: document.querySelector("#gameOverContainer"),
    scoreList: document.querySelector("#scoreList"),
    scoreEntry: null,
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
  letterObjects: [],
  letters: [],
  scoresTable: [
    10100,
    9000,
    1000
  ]
};


// ---------- Display game screen ----------
const displayGameScreen = game => {

  // Initialize constants
  const renderingContext = game.elements.canvas.getContext("2d");
  const definedAssembledWord = " ".repeat(6);

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

  // Initialize variables
  let startIndex = Math.floor(Math.random() * game.templateWords.length);
  let oldStartIndex = startIndex;
  let currentTemplateWord = game.templateWords[startIndex];
  let assembledWord =  definedAssembledWord;

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
      if ((clientY > (4 * height)) && (clientY < game.elements.canvas.height - (8 * height))) spaceship.yPosition = clientY;
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
      game.isShotEnabled = true;
      shot.yPosition = spaceship.yPosition + game.letterConstants.horizontalGap;
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

  // Initialize xy offset of each letter in letters image
  const initializeLetterObjects = game => {
    const {width, height, horizontalGap, verticalGap} = game.letterConstants;
    let [xOffset, yOffset] = [5, 8];
    game.alphabetCharacters.forEach(
      character => {
        const letterSubRectangle = new LetterSubRectangleObject(
          xOffset,
          yOffset,
          character
        );
        game.letterObjects.push(letterSubRectangle);
        xOffset += width + horizontalGap;
        if (xOffset > 608) {
          xOffset = 5;
          yOffset += height + verticalGap;
        }
      }
    );
  }
  initializeLetterObjects(game);

  const spaceship = new SpaceshipObject(
    10,
    game.elements.canvas.height / 2,
    163,
    16,
    spaceshipImage
  );

  const shot = new ShotObject(
    116,
    game.elements.canvas.height / 2,
    23,
    16,
    shotImage
  );

  const initializeFlyingLetters = game => {
    const {width, height, maxVerticalSpeed} = game.letterConstants;
    for (let i = 0; i < game.flyingLetters[startIndex].length; i++) {
      const xPosition = game.elements.canvas.width - (Math.floor(Math.random() * 500)) - width;
      const yPosition = height + (Math.floor(Math.random() * 500));
      const yDirection = 1 + (Math.floor(Math.random() * maxVerticalSpeed));
      const letter = new LetterObject(
        xPosition,
        yPosition,
        width,
        height,
        yDirection,
        game.flyingLetters[startIndex][i]
      );
      game.letters.push(letter);
    }
  }
  initializeFlyingLetters(game);

  // Initialize game music
  gameMusic.loop = "loop";
  gameMusic.play();

  // Display background picture
  const displayBgPicture = bgImage => renderingContext.drawImage(
    bgImage,
    0,
    0
  )

  // Display spaceship
  const displaySpaceship = spaceship => renderingContext.drawImage(
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
  const shootBullet = (game, shot) => {
    // only if shot enabled
    if (game.isShotEnabled) {
      renderingContext.drawImage(
        shot.imageUrl,
        shot.xPosition,
        shot.yPosition
      );
      shot.xPosition += shotHorizontalSpeed;
      // Check shot against right border
      if (shot.xPosition > game.elements.canvas.width) {
        game.isShotEnabled = false;
        shot.xPosition = 116;
      }
    }
  }

  // Check if missing letter was hit
  const checkMissingLetter = (i, game) => {

    // Insert hit letter in assembled word
    const insertHitLetter = (i, game) => {
      game.isLetterHit = false;
      let buffer = "";
      for (let j = 0; j < currentTemplateWord.length; j++) {
        if (game.letters[i].character === currentTemplateWord[j]) {
          positiveHitSound.play();
          game.score += 100;
          game.isLetterHit = true;
          for (let k = 0; k < assembledWord.length; k++) {
            j === k ? buffer += game.letters[i].character : buffer += assembledWord[k];
          }
          assembledWord = buffer;
          // Clear hit letter in current template word
          buffer = currentTemplateWord.replace(game.letters[i].character, " ");
          currentTemplateWord = buffer;
          break;
        }
      }
      return game.isLetterHit;
    }

    // Reduce energy if wrong letter was hit
    const reduceEnergy = game => {
      negativeHitSound.play();
      if (game.energy > energyCountdownStep) {
        game.energy -= energyCountdownStep;
      }
      else {
        game.lives -= 1;
        game.lives === 0 ? game.isGameOver = true : game.energy = maxEnergy;
      }
    }
    !insertHitLetter(i, game) && reduceEnergy(game);

    // Check if all missed letters are hit
    for (let k = 0; k < currentTemplateWord.length; k++) {
      if (currentTemplateWord[k] !== " ") return;
    }
    game.isNextLevel = true;
  }

  // Check collision shot vs. letter(s)
  const checkLetterHit = (i, game, shot) => {
    const {xPosition, yPosition, width, height} = shot;
    // ( shot.xr >= letter.xl ) && ( shot.xl <= letter.xr )
    const xCollisionCheck1 = ((xPosition + width) >= game.letters[i].xPosition) && (xPosition <= (game.letters[i].xPosition + game.letters[i].width));
    // ( shot.yt >= letter.yt ) && ( shot.yt <= letter.yb )
    const yCollisionCheck1 = (yPosition >= game.letters[i].yPosition) && (yPosition <= (game.letters[i].yPosition + game.letters[i].height));
    // ( shot.yb <= letter.yb ) && ( shot.yt >= letter.yt )
    const yCollisionCheck2 = ((yPosition + height) <= (game.letters[i].yPosition + game.letters[i].height)) && (yPosition >= game.letters[i].yPosition);
    if (xCollisionCheck1 && (yCollisionCheck1 || yCollisionCheck2)) {
      checkMissingLetter(i, game);
      game.letters.splice(i, 1);
      game.isShotEnabled = false;
      shot.xPosition = 116;
      return true;
    }
    return false;
  }

  // Display letters and do collision check if shot is enabled
  const moveLetters = (game, shot) => {
    for (let i = 0; i < game.letters.length; i++) {
      const currentCharacter = game.letters[i].character;
      let currentLetter = null;
      for (j = 0; j < game.alphabetCharacters.length; j++) {
        if (currentCharacter === game.letterObjects[j].character) {
          currentLetter = game.letterObjects[j];
          break;
        }
      }
      const {width, height} = game.letterConstants;
      renderingContext.drawImage(
        lettersImage,
        currentLetter.xOffset,
        currentLetter.yOffset,
        width,
        height,
        game.letters[i].xPosition,
        game.letters[i].yPosition,
        width,
        height
      );
      if (game.isShotEnabled && checkLetterHit(i, game, shot)) continue;

      // Top / bottom border check
      if ((game.letters[i].yPosition < 0) || (game.letters[i].yPosition > (600 - game.letterConstants.height))) game.letters[i].yDirection *= - 1; // Change vertical direction
      game.letters[i].yPosition += game.letters[i].yDirection;
    }
  }

  // Display energy left at the left top of the screen
  const displayEnergy = game => {
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
      game.energy,
      16
    );
  }

  // Display current player score in the centre of the top screen
  const displayScore = game => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      `Score ${game.score.toString().padStart(6, 0, 0)}`,
      320,
      30
    );
  }

  // Display number of lives left at the right top of the screen
  const displayLives = game => {
    renderingContext.font = "22px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      "Lives",
      630,
      30
    );
    // Display life symbols only if lives are left
    if (game.lives !== 0) {
      let livesStartXPosition = 705;
      for (let i = 0; i < game.lives; i++) {
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
  const displayTemplateWord = game => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "steelblue";
    renderingContext.fillText(
      game.templateWords[startIndex],
      10,
      game.elements.canvas.height - 15
    );
  }

  // Display assembled word at the right bottom of the screen
  const displayAssembledWord = game => {
    renderingContext.font = "40px Coda Caption";
    renderingContext.fillStyle = "orange";
    renderingContext.fillText(
      assembledWord,
      620,
      game.elements.canvas.height - 15
    );
  }

  // Get next random template word if all missing letters were hit
  const checkTemplateWord = game => {
    assembledWord = definedAssembledWord;
    while (startIndex === oldStartIndex) startIndex = Math.floor(Math.random() * game.templateWords.length);
    oldStartIndex = startIndex;
    currentTemplateWord = game.templateWords[startIndex];
    game.letters.splice(0, game.letters.length);
    initializeFlyingLetters(game);
    game.isNextLevel = false;
  }


  // ---------- Display gameover screen ----------
  const displayGameoverScreen = game => {

    // Create highscore table
    const createHighScoreTable = game => {
      // Insert score in highscore table and sort entries
      if ((game.scoresTable.length < 10) && (game.score !== 0)) {
        game.scoresTable.push(game.score);
        game.scoresTable.sort((a, b) => b - a);
      }
      // Create highscore table list elements
      game.elements.scoreList.innerHTML = ""; // clear the list
      game.scoresTable.forEach(
        score => {
          game.elements.scoreEntry = document.createElement("li");
          game.elements.scoreEntry.innerText = score.toString().padStart(6, 0, 0);
          game.elements.scoreList.appendChild(game.elements.scoreEntry);
        }
      );
    }

    // Reset all game variables to default 
    const resetAllVariables = game => {
      game.ShotObjectenergy = maxEnergy;
      game.score = 0;
      game.lives = maxLives;
      game.isNextLevel = false; 
      game.isGameOver = false;
      game.isShotEnabled = false;
      game.intervalId = null;
      game.letterObjects = [];
      game.letters = [];
    }

    game.elements.gameContainer.classList.add("displayOff");
    game.elements.gameContainer.classList.remove("cursorOn");
    game.elements.gameContainer.classList.add("cursorOff");
    game.elements.gameOverContainer.classList.remove("displayOff");
    createHighScoreTable(game);
    // Handler for click on restart button
    const handleRestartButton = () => {
      game.elements.scoreList.innerHTML = "";
      game.elements.gameOverContainer.classList.add("displayOff");
      game.elements.gameContainer.classList.remove("displayOff");
      // Remove handler for click on restart button
      game.elements.restartButton.removeEventListener(
        "click",
        handleRestartButton
      );
      // Restart game
      resetAllVariables(game);
      displayGameScreen(game);
    }
    // Add handler for click on restart button
    game.elements.restartButton.addEventListener(
      "click",
      handleRestartButton
    );

  }


  // Stop game if no lives left
  const stopGame = game => {
    game.isGameOver = false;
    gameContainer.classList.remove("cursorOff");
    gameContainer.classList.add("cursorOn");
    // Stop interval
    clearInterval(game.intervalId);
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
    displayGameoverScreen(game);
  }

  // Game loop
  const animateAll = () => {
    // Always display background picture
    displayBgPicture(bgImage);
    // Check template word if level is finished
    if (game.isNextLevel) checkTemplateWord(game);
    // Graphic elements only displayed if game not over
    if (game.isGameOver) {
      stopGame(game);
    }
    else {
      displaySpaceship(spaceship);
      shootBullet(game, shot);
      moveLetters(game, shot);
      displayEnergy(game);
      displayScore(game);
      displayLives(game);
      displayTemplateWord(game);
      displayAssembledWord(game);
    }
  }

  // Handler for interval timer
  const handleIntervalTimer = () => requestAnimationFrame(animateAll)
  // Start game by interval
  game.intervalId = setInterval(
    handleIntervalTimer,
    10
  );
}


// ---------- Display splash screen ----------
const displaySplashScreen = (game) => {

  // Handler for click on start button
  const handleStartButton = () => {
    game.elements.splashContainer.classList.add("displayOff");
    game.elements.gameContainer.classList.remove("displayOff");
    // Remove handler for click on start button
    game.elements.startButton.removeEventListener(
      "click",
      handleStartButton
    );
    // Start game
    displayGameScreen(game);
  }
  // Add handler for click on start button
  game.elements.startButton.addEventListener(
    "click",
    handleStartButton
  );
}

// Start game
displaySplashScreen(game);