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

var platforms;
var player;
// shall be cleanse on later version ---
var rules = {
 score : 0,
 best : 0,
 treshold : 10,
 tresholdGap : 5,
 speed : 5,
 maxspeed : 10,
 maxpacing : 120,
 scoreText : null,
 bestScoreText : null,
 debug : 0,
 swag : 100,
 SpaceKey : null
};
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
    var ledge = platforms.create(550, 450, 'ground');
    ledge.body.immovable = true;


    //  game.input.onTap.add(playerTap, this);
    rules.SpaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.mouse.capture = true;

    createPlayer();


    rules.scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
    rules.bestScoreText = game.add.text((game.width / 1.43), 16, 'Best Score: 0', { fontSize: '32px', fill: '#FFF' });
    //  onResize();
}

function update() {

    rules.scoreText.text = 'Score : ' + rules.score;
    game.physics.arcade.collide(player, platforms);
    player.body.velocity.x = 0;
    playerControl();
    isDeadPlayer()
    checkLedge();
}

function createLedge() {
    var ledge;
    var nextHeight;
    var nextWidth;
    var spacing = (rules.speed + rules.score);
    if (spacing > rules.maxpacing)
        spacing = rules.maxpacing;

        nextWidth = randomIntFromInterval(game.width + 32, game.width + 64 + spacing);
nextHeight = randomIntFromInterval(420, 540);

console.log(nextHeight);// x125 y150 z180
    if (rules.score < rules.swag)
        ledge = platforms.create(nextWidth, nextHeight , 'ground');
    if (rules.score >= rules.swag)
    {
        nextWidth = randomIntFromInterval(game.width + 64, game.width + 96 + spacing);
        ledge = platforms.create(nextWidth, nextHeight, 'plat-sm');
}
    ledge.body.immovable = true;
}

function cleanLedge(item) {
    //  Remove the item from the Group.
    platforms.remove(item);
    rules.score += 1;
    if (rules.score == rules.treshold) {
        if (rules.speed != rules.maxspeed)
            rules.speed += 1;
        rules.treshold += rules.tresholdGap;
        rules.tresholdGap += 5;
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
    item.x -= rules.speed * (1 + game.time.physicsElapsed);
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