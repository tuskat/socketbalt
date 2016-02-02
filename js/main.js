/* BLEND MODE FOR REFERENCE
PIXI.blendModes = {
    NORMAL:0,
    ADD:1,
    MULTIPLY:2,
    SCREEN:3,
    OVERLAY:4,
    DARKEN:5,
    LIGHTEN:6,
    COLOR_DODGE:7,
    COLOR_BURN:8,
    HARD_LIGHT:9,
    SOFT_LIGHT:10,
    DIFFERENCE:11,
    EXCLUSION:12,
    HUE:13,
    SATURATION:14,
    COLOR:15,
    LUMINOSITY:16
}; */

var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

// shall be cleanse on later version ---

var platforms;
var player;
var stars;

var score = 0;
var best = 0;

var treshold = 10;
var speed = 4;

var scoreText;
var bestScoreText;
var debug = 0;

// End of the horror ----

function preload() {
    game.load.image('sky', 'assets/bg.png');
    game.load.image('wall', 'assets/parralax1.png');
    game.load.image('ground', 'assets/platform.png');
     game.load.image('plat-sm', 'assets/platform-sm.png');
     game.load.image('plat-xs', 'assets/platform-xs.png');
    game.load.image('star', 'assets/coin.png');
    game.load.spritesheet('player', 'assets/hero.png', 32, 32);
}

function create() {

    game.time.advancedTiming = true;
    //game.world.setBounds(0, 0, 1000, 600);
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    
    //    game.add.sprite(0, 0, 'sky');
    var sky = game.add.sprite(0, 0, 'sky');

    sky.width = game.width;
    sky.height = game.height;
   //  The platforms group contains the ground and the 2 ledges we can jump on
    var bg = game.add.sprite(0, 400, 'wall');
    bg.blendMode = PIXI.blendModes.NORMAL;
    
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    //  Now let's create two ledges
    var ledge = platforms.create(200, 450, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(600, 550, 'ground');
    ledge.body.immovable = true;

    game.input.onTap.add(playerTap, this);

    createPlayer();
    stars = game.add.group();
    stars.enableBody = true;

    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
    bestScoreText = game.add.text((game.width / 1.43) , 16, 'Best Score: 0', { fontSize: '32px', fill: '#FFF' });
    //  onResize();
}

function update() {

    scoreText.text = 'Score : ' + score;
    game.physics.arcade.collide(player, platforms);
    player.body.velocity.x = 0;
    playerControl();
    isDeadPlayer()
    checkLedge();
}

function createLedge() {

    var ledge = platforms.create(game.width, randomIntFromInterval(400, 550), 'ground');
    
        ledge.body.immovable = true;
}

function cleanLedge(item) {


    if (item.x < -400) {
        //  Remove the item from the Group.
        platforms.remove(item);
        score += 1;
        if (score == treshold) {
            speed += 1;
            treshold += 5;
        }
    }


}
function checkLedge() {

    var isLedge = false;

    platforms.forEach(function (item) {
        moveLedge(item);
        if (item.x > ((game.width / 2) - (game.width / 4))) {
            //     console.log("there's a ledge..." + item.x);
            isLedge = true;
        }
        cleanLedge(item);
    }, this);
    if (isLedge == false) {
        //   console.log("no ledge, trying to create one...");
        createLedge();
    }
}

function moveLedge(item) {
    item.x -= speed;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function onResize() {
    // this function is called each time the browser is resized, and re-positions
    // game elements to keep them in their right position according to game size
		
    /*	
            platforms.x = Math.round((game.width-320)/2);
              platforms.y = Math.round((game.height-320)/2);
            player.x = Math.round((game.width-320)/2);
              player.y = Math.round((game.height-320)/2);	
      */


}