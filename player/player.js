export function spawnPlayer(scene, sprite) {

    player = scene.physics.add.sprite(400, 300, sprite);

    player.health = 100;

    scene.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNumbers(sprite, { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
    });

    scene.anims.create({
        key: 'idle',
        frames: [{ key: sprite, frame: 0 }], // Only frame 0 for idle state
        frameRate: 10
    });

    player.setCollideWorldBounds(true);

    createPlayerHealthBar(scene, player)

    return player;
}

export function initCursors(scene) {
    cursors = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    return cursors;
}

export function handleCursors(cursors, player, playerSpeed) {
    player.setVelocity(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-playerSpeed);
        player.anims.play('walk', true);  // Play the walk animation (if moving left)
    } else if (cursors.right.isDown) {
        player.setVelocityX(playerSpeed);
        player.anims.play('walk', true);  // Play the walk animation (if moving right)
    }
    if (cursors.up.isDown) {
        player.setVelocityY(-playerSpeed);
        player.anims.play('walk', true); 
    } else if (cursors.down.isDown) {
        player.setVelocityY(playerSpeed);
        player.anims.play('walk', true); 
    } else {
        player.anims.play('walk', false);
    }
}

export function rotatePlayerToCursor(scene, player) {
    // Get the cursor (or pointer) position
    const pointer = scene.input.activePointer;
    
    if (pointer) {
        // Get the cursor (or pointer) position
        const cursorX = pointer.x;
        const cursorY = pointer.y;

        // Calculate the angle to the cursor
        const targetAngle = Phaser.Math.Angle.Between(player.x, player.y, cursorX, cursorY);

        // Smoothly rotate the player towards the target angle
        player.rotation = Phaser.Math.Angle.RotateTo(player.rotation, targetAngle, 0.1); // 0.1 is the rotation speed
    }
    updatePlayerHealthBar(player);
}

export function shootBullet(scene, bullets, player, bulletSpeed) {
    const bullet = bullets.get(player.x, player.y);

    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.rotation = player.rotation;
        bullet.setData('hasHit', false);

        scene.physics.velocityFromRotation(player.rotation, bulletSpeed, bullet.body.velocity);

        scene.time.delayedCall(1000, () => {
            bullet.setActive(false);
            bullet.setVisible(false);
        })
    }
}

function createPlayerHealthBar(scene, player) {
    const healthBar = scene.add.graphics();

    healthBar.fillStyle(0x00FF00, 0.8); // Set color to green
    healthBar.fillRect(player.x - 20, player.y - 30, 40, 2);

    player.healthBar = healthBar;
}

function updatePlayerHealthBar(player) {
    if (player.healthBar) {
        const healthWidth = (player.health / 100) * 40; // Health is between 0 and 100, width of 40
        player.healthBar.clear();
        player.healthBar.fillStyle(0x00FF00, 0.8);
        player.healthBar.fillRect(player.x - 20, player.y - 30, healthWidth, 2);
    }
}