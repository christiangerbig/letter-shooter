Letter Shooter

Description
Letter Shooter is a game where the player moves vertically on the screen and can shoot ink at flying letters. The player gets a template word and has to shoot the characters of this word out of a formation of letters. If the player hits the wrong letter out of this formation, he looses energy. If the energy is zero, he looses one of his three lives. The game ends when he has lost all his three lives. After that the highscore table with the position of the player is displayed.

MVP (DOM - CANVAS)
-move the pen with the mouse
-shoot with ink at the letters
-the letters flying arount
-random fetch of a word template out of an array
-the letters matching the letters of the word template disappear out of the letter formation
-the matching letters are displayed at the bottom of the screen

Backlog
-Intro-Part
-Main part
    -add display of energy, score and number of lifes
    -add functions to handle the loss of energy and lifes
-End-Part
    -display high score table
    -restart game

Data structure
intro.js
-displayIntroScreen() {}

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

end.js
-displayEndScreen() {}
-displayBGPicture() {}
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

end - display high score
end - build DOM
end - addEventListener

Links
Trello
Link url

Git
URls for the project repo and deploy Link Repo Link Deploy

Slides
URls for the project presentation (slides) Link Slides.com