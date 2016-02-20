
function createPlayer() {
    // The player and its settings

    player = game.add.sprite(100, game.world.height - 450, 'player');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);


    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.05;
    player.body.gravity.y = 800;
    player.body.collideWorldBounds = false;
    
    /*
           player.anchor.setTo(0.5, 0.5);
           game.camera.follow(player);
       */

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

}

function isDeadPlayer() {
    if (player.y > 620) {
        respawnPlayer();
    }
}

function respawnPlayer() {
    player.y = 0;
    console.log('speed : ' + rules.speed + ' tresholdGap : ' + rules.tresholdGap + ' spacing : ' + (rules.speed * rules.score));
    if (rules.score > rules.best) {
        rules.best = rules.score - 1;
        rules.bestScoreText.text = 'Best Score : ' + rules.score;

    }

    rules.score = 0;
    rules.speed = 5;
    rules.treshold = 10;
    rules.tresholdGap = 5;

}

function playerControl() {
    var cursors = game.input.keyboard.createCursorKeys();

    if (rules.debug == 1) {
        if (cursors.left.isDown) {
            //  Move to the left
            player.body.velocity.x = -300;

            player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            //  Move to the right
            player.body.velocity.x = 300;

            player.animations.play('right');
        }
        else {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }
    }
    //  Allow the player to jump if they are touching the ground.
    /*   if (cursors.up.isDown && player.body.touching.down) {
           player.body.velocity.y = -500;
       }
      */

    if ((rules.SpaceKey.isDown || game.input.pointer1.isDown || game.input.mousePointer.isDown) && player.body.touching.down) {
        player.body.velocity.y = -250;
        player.force = 300;
        player.jumping = true;

        console.log("height on floor :" + player.y);
    }
    else if ((rules.SpaceKey.isDown || game.input.pointer1.isDown || game.input.mousePointer.isDown) && player.force > 0 && player.jumping) {
        player.body.velocity.y -= 25;
        player.force -= 25;
      
    }
    else if (!(rules.SpaceKey.isDown || game.input.pointer1.isDown || game.input.mousePointer.isDown) || player.force <= 0) {
        player.jumping = false;
    }
}

function playerTap() {
    if (player.body.touching.down) {
        player.body.velocity.y = -500;
    }
}