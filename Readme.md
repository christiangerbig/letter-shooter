Letter Shooter

Description
Letter Shooter is a game where the player moves vertically on the screen and can shoot ink at flying letters. The player gets a template word and has to shoot the characters of this word out of a formation of letters. If the player hits the wrong letter out of this formation, he looses energy. If the energy is zero, he looses one of his three lives. The game ends when he has lost all his three lives. After that the highscore table with the position of the player is displayed.

MVP (DOM - CANVAS)
-intro part with start button
-main part with:
*move the pen with the mouse
*shoot with ink at the letters
*the letters flying arount
*random fetch of a word template out of an array
*the letters matching the letters of the word template disappear out of the letter formation
*the matching letters are displayed at the bottom of the screen
*energery is decreased if the wrong letter was hit
*live gets lost, if energy has reached zero
*energy and lives displayed
*game over after all lives are lost
end part with:
*display high score table after game over
*restart game supported

Backlog
-add music or sounds
-change graphics

Data structure
intro.js
-displayIntroScreen() {}
-startGame() {}

game.js
-displayMainScreen() {}
-displayBGPicture() {}
-movePen() {}
-shootInk() {}
-moveLetters() {}
-letterHit() {}
-displayTemplateWord() {}
-displayAssembledWord() {}
-setMissingLetter() {}
-displayEnergy() {}
-displayLives() {}
-displayScore() {}

end.js
-displayEndScreen() {}
-displayHighScore() {}
-restartGame() {}

Classes
-Letters
X-Position
Y-Position
Width
Height
URL-image
„A“

-Pen
X-Position
Y-Posiztion
Width
Height
URL-image

-Ink
X-Position
Y-Position
Width
Height
URL-image

Array
-templateWords
„TOWER“
„CAT“
„TABLE“ 

States y States Transitions
Definition of the different states and their transition (transition functions)
-splashScreen
-gameScreen
-gameoverScreen

Task
intro - Build DOM
intro - addEventListener

game - start-loop
game - build canvas
game - update canvas
game - draw canvass
game - move pen
game - shot handler
game - check collision
game - move letters
game - show words
game - display energy
game - display lives
game - display score

end - display high score
end - build DOM
end - addEventListener

Links
Trello

Git
https://christiangerbig.github.io/letter-shooter/

Slides
https://docs.google.com/presentation/d/e/2PACX-1vSlsfckWmcssGIl8FGOARO5BiIyPk2Q_qI9VV0Zp4ELx8Gy79NHXccQljmXJB2h8kMgOK3TD9nKH3cO/pub?start=true&loop=false&delayms=3000