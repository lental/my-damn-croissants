
function Board() {
  var then = Date.now();

  var canvas;
  canvas = $('canvas#game')[0];
  var ctx = canvas.getContext("2d");
  canvas.width = 565;
  canvas.height = 512;

  var board = new Object();
  board.topDeadSpace = 32
  board.width=512;
  board.height=480;


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
  bgImage.src = "img/kanyeground.png";

  var restaurantReady = false;
  var restaurantImage = new Image();
  restaurantImage.onload = function () {
    restaurantReady = true;
  };
  restaurantImage.src = "img/restaurant.png";

  var heroReady = false;
  var heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "https://www.gravatar.com/avatar/42cefdfc8bf68676484cebf431329369?s=32&d=identicon&r=PG";

  var kanyeReady = false;
  var kanyeImage = new Image();
  kanyeImage.onload = function () {
    kanyeReady = true;
  };
  kanyeImage.src= "img/kanye.png";

  var fedyeReady = false;
  var fedyeImage = new Image();
  fedyeImage.onload = function () {
    fedyeReady = true;
  };
  fedyeImage.src= "img/fedye.png";

  var croissantReady = false;
  var croissantImage = new Image();
  croissantImage.onload = function () {
    croissantReady = true;
  };
  croissantImage.src= "img/croissant.png";

  var kanye = function(){
    this.x = 0;
    this.y = 0;
    this.yOffset = -32;
    this.width = 40;
    this.height = 32;
    this.isHungry = true;
    this.timeToEat = 0;
  };

  var hero = function(){
      this.speed = 350; // movement in pixels per second
      this.x = 0;
      this.y = 0;
      this.width = 32;
      this.height = 32;
      this.ammo=5;
  };


  var kanyes = [];
  var chunks = 4
  var hungryKanyes = chunks * chunks;
  var hero = new hero();

  // Reset the game when the player catches a kanye
  this.reset = function () {
    hero.x = board.width / 2;
    hungryKanyes = chunks * chunks;
    hero.y = 0;
    hero.ammo = 5;
    kanyes = [];

    //place tables randomly, one per chunk of space
    var chunkWidth  = board.width / chunks
    var chunkHeight = (board.height - 32) / chunks

    for(var row = 0; row < chunks; row++) {
      for(var col = 0; col < chunks; col++) {
        var mob = new kanye();
        mobx = Math.random()  * (chunkWidth - mob.width) + chunkWidth * col;
        moby = Math.random()  * (chunkHeight - mob.height) + 32 + chunkHeight * row;
        mob.x = mobx;
        mob.y = moby;
        kanyes.push(mob);
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

    if (kanyeReady) {
      for(var i = 0; i < kanyes.length; i++) {
        var mob = kanyes[i];

        //If kanye has finished his current croissant
        if(!mob.isHungry && mob.timeToEat <= 0) {
          mob.isHungry = true;
          if (hungryKanyes == 0) {
            $(".god").text("");
          }
          hungryKanyes++;
        }

        if(!mob.isHungry) {
          mob.timeToEat--;
          ctx.drawImage(fedyeImage, mob.x, mob.y + mob.yOffset);
        } else {
          ctx.drawImage(kanyeImage, mob.x, mob.y + mob.yOffset);
        }
      }
    }
    if (restaurantReady) {
      ctx.drawImage(restaurantImage, canvas.width-70, 0);
    }
  // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Croissants: ", 4, canvas.height - 28);

    if (croissantReady) {
      for (var i = 0; i < hero.ammo; i++) {
        ctx.drawImage(croissantImage, 130 + i * 35, canvas.height - 32);
      }
    }
    if (hungryKanyes == 0) {
    $(".god").text("ALL KANYES FED. YOU ARE A GOD");
    }
  };

  function collidingMonster() {
    for (var i = 0; i < kanyes.length; i++) {
      var mob = kanyes[i];
      var xCollision =(hero.x < mob.x + mob.width && hero.x > mob.x) ||
                      (mob.x < hero.x + hero.width && mob.x > hero.x);
      var yCollision = (hero.y < mob.y + mob.height && hero.y > mob.y) ||
                       (mob.y < hero.y + hero.height && mob.y > hero.y);

      if (xCollision && yCollision) {
       return mob;
      }
   }

   return null;
  };

  function outOfXBounds() {
    return hero.x < 0  || hero.x + hero.width > board.width;
  }
  function outOfYBounds() {
    return hero.y < 0  || hero.y + hero.height > board.height;
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

    var collision = collidingMonster();
    if (collision) {
      if (collision.isHungry && hero.ammo > 0){
        hero.ammo--;
        collision.isHungry = false;
        hungryKanyes--;
        collision.timeToEat = Math.random() * 1200 + 500;
      }
      hero.y = oldy;
    }

    if (outOfYBounds()) {
      hero.y = oldy;
    }

    if (37 in keysDown) { // Player holding left
      hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
      hero.x += hero.speed * modifier;
    }

   collision = collidingMonster();
    if (collision) {
      if (collision.isHungry && hero.ammo > 0){
        hero.ammo--;
        collision.isHungry = false;
        hungryKanyes--;
        collision.timeToEat = Math.random() * 10000 + 5000;
      }
      hero.x = oldx;
    }
    if (outOfXBounds()) {
      if (hero.x + hero.width >= board.width) {
        hero.ammo = 8;
      }
      hero.x = oldx;
    }

    if (hero.x + hero.width == board.width) {
      ammo = 10;
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

resetButton = $('#reset_button');
resetButton.click(board.reset);

board.reset();
setInterval(board.mainLoop, 1);

}
