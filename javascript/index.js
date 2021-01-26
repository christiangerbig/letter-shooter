


function displayMainScreen() {

  // Init objects
  class PenObject {
    constructor(x,y,w,h,im) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.imageUrl = im;
    }
  }

  class DropObject {
    constructor(x,y,w,h,im) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.imageUrl = im;
    }
  }

  class LetterObject {
    constructor(x,y,w,h,di,ch) {
      this.xPos = x;
      this.yPos = y;
      this.width = w;
      this.height = h;
      this.yDirection = di
      this.char = ch;
    }
  }

  const flyingLetters = [
    "DTGCSEAFT",
    "HFEODUSRE"
  ];

  const templateWords = [
    "CAT",
    "HOUSE"
  ];

  let letters = [];


   // Init Canvas stuff
  let canvas = document.querySelector("canvas");
  let ctx = canvas.getContext("2d");

  let bgImage = document.createElement("img");
  bgImage.src = "/images/letters-picture_1280x712.jpg";
  bgImage.addEventListener(
    "load",
    function() {
    }
  );

  let penImage = document.createElement("img");
  penImage.src = "/images/pen_163x16.jpg";
  penImage.addEventListener(
    "load",
    function() {
    }
  );

  let dropImage = document.createElement("img");
  dropImage.src = "/images/drop_23x16.jpg";
  dropImage.addEventListener(
    "load",
    function() {
    }
  );

  // Init objects and arrays
  let pen = new PenObject(10,canvas.height/2,163,16,penImage);
  let drop = new DropObject(10+pen.width,canvas.height/2,27,19,dropImage);

  for (let i = 0; i < flyingLetters.length; i++) {
    for (let j = 0; j < flyingLetters[i].length; j++) {
      let x = canvas.width - (Math.floor(Math.random()*500)) - 50;
      let y = 50 + (Math.floor(Math.random()*500));
      let width = 50;
      let height = 50;
      let yDirection = 1 + (Math.floor(Math.random()*3));
      let letterObject = new LetterObject(x,y,width,height,yDirection,flyingLetters[i][j]);
      letters.push(letterObject);
    }
  }

  let dropEnabled = false;
  let intervalId = 0;

  
  // Add event listener for mouse movement and mouse button
 document.addEventListener(
    "mousemove",
    function(e) {
      if (e.clientY > (4*pen.height) && e.clientY < canvas.height-(5*pen.height)) {
        pen.yPos = e.clientY;
      }
    }
  );
  
  document.addEventListener(
    "mousedown",
    function() {
      dropEnabled = true;
      drop.yPos = pen.yPos;
    }
  );

  // Add event listener for esc key
  document.addEventListener(
    "keydown",
    function(event) {
     if ((event.keyCode == 39 || event.key == "ArrowRight")) {
        clearInterval(intervalId);
      }
    }
  );



  function displayBgPicture() {
    ctx.drawImage(bgImage, 0, 0);
  }

  function displayPen() {
    ctx.drawImage(pen.imageUrl,pen.xPos,pen.yPos);
  }

  function shootInk() {
    if (dropEnabled) {
      ctx.drawImage(drop.imageUrl,drop.xPos,drop.yPos);
      drop.xPos +=5;
      if (drop.xPos > canvas.width) {
        dropEnabled = false;
        drop.xPos = 10+pen.width;
      }
    }
  }

  function checkLetterHit() {
    const xCollisionCheck1 = (drop.xPos + drop.width) > letters[i].xPos;
    const xCollisionCheck2 = (drop.xPos + drop.width) < (letters[i].xPos + letters[i].width);
    const yCollisionCheck1 = (drop[i].yPos + drop[i].height) > letters[i].height;
    const yCollisionCheck2 = (drop[i].yPos + drop[i].height) < (letters[i].yPos + letters[i].height);
    if ((xCollisionCheck1 || xCollisionCheck2) && (yCollisionCheck1 || yCollisionCheck2)) {
      letters.splice(i,1);
      return true;
    }
  }


  function moveLetters() {
    ctx.font = "50px Verdana";
    ctx.fillStyle = "yellow";
    


    for (let i = 0; i < 9; i++) {
      ctx.fillText(letters[i].char,letters[i].xPos,letters[i].yPos);
      if (checkLetterHit()) {
        continue;
      }
      if ((letters[i].yPos < 50) || (letters[i].yPos > 580)) {
        letters[i].yDirection *= - 1;
      }
      letters[i].yPos += letters[i].yDirection;
    }
  }

  function animateAll() {
  
    displayBgPicture();
    displayPen();
    shootInk();
    moveLetters();
  }


  // Start interval
  intervalID = setInterval(
    function() {
      requestAnimationFrame(animateAll);
    }, 
    10
  );  

}

displayMainScreen();







 /*
 
 const lastPoint = {
    //x: null,
    y: canvas.height/2
  };

 if (e.clientX > lastPoint.x) {
        console.log('right');
      }
      else if (e.clientX < lastPoint.x) {
        console.log("left");
      }
      else {
        console.log('none');
      }*/
      /*if (e.clientY > lastPoint.y) {
        if (pen.yPos < 512) {
          pen.yPos += 2;
        }
      }
      else if (e.clientY < lastPoint.y) {
        if (pen.yPos > 0) {
          pen.yPos -= 2;
        }

      lastPoint.x = e.clientX;
      lastPoint.y = e.clientY;
      }*/
      
