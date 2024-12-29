import Phaser from 'phaser'; // Import Phaser from the npm package
import { spawnZombie, updateZombieHealthBar, moveZombiesToPlayer } from './zombie/zombie'; // Import zombie functions
import { handleCursors, initCursors, rotatePlayerToCursor, shootBullet, spawnPlayer } from './player/player';

import playerPNG from "./assets/dude.png";
import zombiePNG from "./assets/zombie.png";
import bulletPNG from "./assets/bullet.png";

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',  // Make sure physics is correctly set up
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

const game = new Phaser.Game(config);

let player;
let bullets = [];
let zombies;
let cursors;

let zombieSpeed = 100;
let playerSpeed = 200;
let bulletSpeed = 500;
let bulletDamage = 25;

let lastCollisionTime = 0;
let collisionCooldown = 1000; // 1s
let lastFiredTime = 0;
let rateOfFire = 450;


// Preload function - load assets here
function preload() {
    this.load.spritesheet('dude', playerPNG, {
        frameWidth: 41,
        frameHeight: 21,
        startFrame: 0,
        endFrame: 2
    });

    this.load.image('zombie', zombiePNG);
    this.load.image('bullet', bulletPNG);
}

// Create function - set up game objects here
function create() {

    this.cameras.main.setBackgroundColor('#808080');

    player = spawnPlayer(this, 'dude');

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    zombies = this.physics.add.group({
        defaultKey: 'zombie',
        maxSize: 10,
    });

    cursors = initCursors(this);

    this.input.keyboard.on('keydown-P', () => {
        spawnZombie(this, zombies, zombieSpeed, 'zombie');
    });

    this.physics.add.collider(player, zombies, handlePlayerZombieCollision, null, this);
    this.physics.add.collider(bullets, zombies, handleZombieHitByBullet, null, this);
    this.physics.add.collider(zombies, zombies, () => {}, null, this);
}

// Update function - handle game logic (movement in this case)
function update(time) {

    handleCursors(cursors, player, playerSpeed);

    lastFiredTime = shoot(this, time, lastFiredTime, rateOfFire, bullets, player, bulletSpeed);

    rotatePlayerToCursor(this, player);
    moveZombiesToPlayer(this, zombies, player);

    spawnWaveOfZombies(this, zombies, zombieSpeed);

}

function handlePlayerZombieCollision(player, zombie) {
    const currentTime = this.time.now;

    if (currentTime - lastCollisionTime >= collisionCooldown) {
        player.health -= 15;  // Assuming player has a health property
        lastCollisionTime = currentTime;
        console.log(`player hit`);
    }
}

function handleZombieHitByBullet(bullet, zombie) {
    bullet.setActive(false);
    bullet.setVisible(false);
    bullet.destroy();

    if (!bullet.getData('hasHit')) {
        bullet.setData('hasHit', true);

        // Get and update the zombie's health using getData and setData
        let currentHealth = zombie.getData('health');
        zombie.setData('health', currentHealth - bulletDamage);
        updateZombieHealthBar(this, zombie);
        console.log(`Zombie was hit! Zombie health: ${zombie.getData('health')}`);
        if(zombie.getData('health') <= 0) {
            zombie.destroy();
        }
    }
}

function shoot(scene, time, lastFiredTime, rateOfFire, bullets, player, bulletSpeed) {
    if (time > lastFiredTime + rateOfFire) {
        shootBullet(scene, bullets, player, bulletSpeed);
        lastFiredTime = time;
    }
    return lastFiredTime;
}

function spawnWaveOfZombies(scene, zombies, zombieSpeed) {
    const spawnChance = Phaser.Math.Between(0, 10);
    const spawnCount = Phaser.Math.Between(5, 10);

    // 10% chance to spawn zombies
    if (spawnChance === 1 && zombies.getChildren().length < 10) {
        for (let i = 0; i <= spawnCount; i++) {
            spawnZombie(scene, zombies, zombieSpeed, 'zombie');
        }
    }
}
