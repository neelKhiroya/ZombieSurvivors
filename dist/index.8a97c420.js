var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
let player; // To store the player sprite
let cursors; // For keyboard input
let speed = 200; // Movement speed
function preload() {
    this.load.image('dude', 'assets/dude.png');
}
function create() {
    // Create player sprite at position (100, 100)
    player = this.physics.add.sprite(100, 100, 'player');
    // Set player properties (e.g., make the character non-interactive with walls)
    player.setCollideWorldBounds(true);
    // Enable keyboard inputs
    cursors = this.input.keyboard.createCursorKeys();
}
function update() {
    // Reset player velocity
    player.setVelocity(0);
    // Handle movement input (up, down, left, right)
    if (cursors.left.isDown) player.setVelocityX(-speed);
    else if (cursors.right.isDown) player.setVelocityX(speed);
    if (cursors.up.isDown) player.setVelocityY(-speed);
    else if (cursors.down.isDown) player.setVelocityY(speed);
}

//# sourceMappingURL=index.8a97c420.js.map
