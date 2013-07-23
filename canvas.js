
function Board() {
  var then = Date.now();

  var canvas;
  canvas = $('canvas#game')[0];
  var ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 480;


this.audio = new Audio('croissant.mp3');
this.audio.loop = true;
this.audio.play();

  // Handle keyboard controls
  var keysDown = {};
  addEventListener("keydown", function (e) {keysDown[e.keyCode] = true;}, false);

  addEventListener("keyup", function (e) {delete keysDown[e.keyCode];}, false);

  // Background image
  var bgReady = false;
  var bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "http://farm7.static.flickr.com/6203/6084194152_35c3e3ba34_z.jpg";

  var heroReady = false;
  var heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "https://www.gravatar.com/avatar/42cefdfc8bf68676484cebf431329369?s=32&d=identicon&r=PG";

  var monsterReady = false;
  var monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src= "https://www.gravatar.com/avatar/c8b387c489181844b3ffc704fadc0f14?s=32&d=identicon&r=PG";

  var monster = function(){
    this.x = 0;
    this.y = 0;
    this.width = 32;
    this.height = 32;
  };

  var hero = function(){
      this.speed = 256; // movement in pixels per second
      this.x = 0;
      this.y = 0;
      this.width = 32;
      this.height = 32;
  };


var monstersCaught = 0;
var monsters = [];
var hero = new hero();

  // Reset the game when the player catches a monster
  this.reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    //place tables randomly, one per chunk of space
    chunks = 4
    var chunkWidth  = canvas.width / chunks
    var chunkHeight = canvas.height / chunks
    for(var row = 0; row < chunks; row++) {
      for(var col = 0; col < chunks; col++) {
        var mob = new monster();
        mobx = Math.random()  * (chunkWidth - mob.width) + chunkWidth * col;
        moby = Math.random()  * (chunkHeight - mob.height) + chunkHeight * row;
        mob.x = mobx;
        mob.y = moby;
        monsters.push(mob);
      }
    }
  };

  // Draw everything
  var render = function () {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
      ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
      for(var i = 0; i < monsters.length; i++) {
        var mob = monsters[i];
        ctx.drawImage(monsterImage, mob.x, mob.y);
      }
    }
  };

  function areColliding() {
    for (var i = 0; i < monsters.length; i++) {
      var mob = monsters[i];
      var xCollision =(hero.x < mob.x + mob.width && hero.x > mob.x) || 
                      (mob.x < hero.x + hero.width && mob.x > hero.x);
      var yCollision = (hero.y < mob.y + mob.height && hero.y > mob.y) ||
                       (mob.y < hero.y + hero.height && mob.y > hero.y);

      if (xCollision && yCollision) {
       return true;
      }
   }

   return false;
  };

  function outOfXBounds() {
    return hero.x < 0  || hero.x + hero.width > canvas.width;
  }
  function outOfYBounds() {
    return hero.y < 0  || hero.y + hero.height > canvas.height;
  }

  // Update game objects
  var update = function (modifier) {
    var oldx = hero.x;
    var oldy = hero.y;

    if (38 in keysDown) { // Player holding up
      hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
      hero.y += hero.speed * modifier;
    }
    if (areColliding() || outOfYBounds()) {
      hero.y = oldy;
    }
    if (37 in keysDown) { // Player holding left
      hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
      hero.x += hero.speed * modifier;
    }
    if (areColliding() || outOfXBounds()) {
      hero.x = oldx;
    }
  };


  // The main game loop
  this.mainLoop = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;
  };


};

  toggleAudio = function() {
    if(!board.audio.paused){
      board.audio.pause();
    } else {
      board.audio.play();
    }

  };
function initialize() {

board = new Board();
audioToggle = $('#audio_toggle');
audioToggle.click(toggleAudio);

board.reset();
setInterval(board.mainLoop, 1);

}
