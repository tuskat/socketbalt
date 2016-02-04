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

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update });

// shall be cleanse on later version ---

var platforms;
var player;

var score = 0;
var best = 0;

var treshold = 10;
var tresholdGap = 5;
var speed = 5;
var maxspeed = 15;
var maxpacing = 1800;

var scoreText;
var bestScoreText;
var debug = 0;
var swag = 100;

var SpaceKey;
// End of the horror ----

function preload() {
    game.load.image('sky', 'assets/bg.png');
    game.load.image('wall', 'assets/wall.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('plat-sm', 'assets/platform-sm.png');
    game.load.image('plat-xs', 'assets/platform-xs.png');
    game.load.image('cloud', 'assets/cloud.png');
    game.load.image('city', 'assets/city.png');
    game.load.spritesheet('player', 'assets/hero.png', 32, 32);
    game.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurX.js');
    game.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurY.js');
}

function create() {


    game.time.advancedTiming = true;
    //game.world.setBounds(0, 0, 1000, 600);
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

   
    
    //var myMask = game.add.illuminated.darkMask(myLamps/*, color*/);
    //  A simple background for our game
    
    //    game.add.sprite(0, 0, 'sky');
    var sky = game.add.sprite(0, 0, 'sky');

    sky.width = game.width;
    sky.height = game.height;

    var city = game.add.sprite(0, 300, 'city');

    game.add.tween(city).to({ x: -500 }, 50 * 1000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
   
    game.add.sprite(0, 400, 'wall');
   

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    //  Now let's create two ledges
    var ledge = platforms.create(200, 450, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(600, 550, 'ground');
    ledge.body.immovable = true;

    //  game.input.onTap.add(playerTap, this);
    SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.mouse.capture = true;

    createPlayer();


    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
    bestScoreText = game.add.text((game.width / 1.43), 16, 'Best Score: 0', { fontSize: '32px', fill: '#FFF' });
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
    var spacing = game.width + (speed * score);
    if (spacing > maxpacing)
        spacing = maxpacing;

    if (score < swag)
        var ledge = platforms.create(spacing, randomIntFromInterval(450, 550), 'ground');
    if (score >= swag)
        var ledge = platforms.create(spacing, randomIntFromInterval(400, 550), 'plat-sm');

    ledge.body.immovable = true;
}

function cleanLedge(item) {
    //  Remove the item from the Group.
    platforms.remove(item);
    score += 1;
    if (score == treshold) {
        if (speed != maxspeed)
            speed += 1;
        treshold += tresholdGap;
        tresholdGap += 5;
    }
}
function checkLedge() {

    var isLedge = false;

    platforms.forEach(function (item) {
        moveLedge(item);
        if (item.x > (game.width / 4)) {
            //     console.log("there's a ledge..." + item.x);
            isLedge = true;
        }
        if (item.x < -400) {

            cleanLedge(item);
        }
    }, this);
    if (isLedge == false) {
        //   console.log("no ledge, trying to create one...");
        createLedge();
    }
}

function moveLedge(item) {
    item.x -= speed * (1 + game.time.physicsElapsed);
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