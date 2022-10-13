# Letter Shooter

## Description

Letter Shooter is a game where the player moves a spaceship vertically on the screen and can shoot with bullets at flying letters. The player gets a template word and has to shoot the characters of this given word out of a formation of letters. If the player hits the right letter his score is increased by 100. If the player hits the wrong letter out of this formation, he looses energy. If the energy is zero, he looses one of his three lives. The game ends if he has lost all his three lives. After that the highscore table with the position of the player is displayed.

## MVP (DOM - CANVAS)

- Splash screen with start button

- Game screen screen with:
  - game music is played in the background and is looped if end of song is reached
  - move the spaceship with the mouse
  - shoot with bullets at the letters
  - the letters are bouncing up and down
  - random fetch of a word template out of an array
  - if the right letter was hit a positive sound is displayed
  - if the wrong letter was hit a negative sound is displayed
  - the letters matching the letters of the word template disappear out of the flying letters formation
  - the letters of the template word are displayed at the left bottom of the screen
  - the matching letters are displayed at the right bottom of the screen
  - energy is displayed as a bar on the top left of the screen and is decreased if the wrong letter was hit
  - current player score is displayed at the top centre of the screen
  - lifes left are displayed at the right top of the screen
  - a life gets lost, if energy has reached zero
  - game over after all lives are lost

- Game over screen with:
  - a game over sound is played
  - display high score table after game over
  - restart game supported

## Data structure

splash
- displaySplashScreen() {}

game
- displayGameScreen() {}
- displayBackgroundPicture() {}
- displaySpaceship() {}
- moveShot() {}
- moveLetters() {}
- checkMissingLetterHit() {}
- checkShotCollisionWithLetters() {}
- displayTemplateWord() {}
- displayAssembledWord() {}
- displayEnergy() {}
- displayLives() {}
- displayScore() {}
- fetchNextTemplateWord() {}

gameOver
- displayGameOverScreen() {}

## Classes

- Letter
  - X-Position
  - Y-Position
  - Width
  - Height
  - Y-Direction
  - char

- LetterSubRectangle
  - x-Offset
  - y-Offset
  - char

- Spaceship
  - X-Position
  - Y-Position
  - Width
  - Height
  - URL-image

- Shot
  - X-Position
  - Y-Position
  - Width
  - Height
  - URL-image

- Elements
  - introContainer
  - startButton
  - gameContainer
  - canvas
  - endContainer
  - scoreList
  - scoreEntry
  - restartButton

## Arrays

- templateWords
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

- flyingLetters
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

- alphabetChars
"A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
"K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
"U", "V", "W", "X", "Y", "Z"

- letterObjects
- letters

## States y States Transitions

- splashScreen
- gameScreen
- gameoverScreen

## Task

- splash - Build DOM
- splash - addEventListener

- game - start-loop
- game - build canvas
- game - update canvas
- game - draw canvass
- game - move spaceship
- game - shot handler
- game - check collisions
- game - move letters
- game - show words
- game - display energy
- game - display lives
- game - display score
- game - play music
- game - play positive/negative samples for letters hit

- game over - play game over sound
- game over - display high score
- game over - build DOM
- game over - addEventListener

## Links

### Git
[Repository Link](https://github.com/christiangerbig/letter-shooter)

[Deployed App Link](https://christiangerbig.github.io/letter-shooter/)

### Slides
[Slides Link](https://docs.google.com/presentation/d/19SUX9neMiqWqEPA53OpoDVEWDInEuT_owJnXoIe3P_Q/edit?usp=sharing)