// zombie.js

export function spawnZombie(scene, zombies, zombieSpeed, sprite) {

    // Create new zombie and set initial properties
    if (zombies.getChildren().length < 10) {

        const x = Phaser.Math.Between(10, 100);
        const y = Phaser.Math.Between(100, 800);

        console.log(`Spawning zombie`);

        const newZombie = zombies.create(x, y, sprite);
        newZombie.setData('health', 100);
        newZombie.setData('speed', zombieSpeed * Phaser.Math.Between(1, 1.5));
        newZombie.setData('alive', true);

        // Create health bar for the zombie
        createZombieHealthBar(scene, newZombie);
    }
}

export function moveZombiesToPlayer(scene, zombies, player) {
    zombies.getChildren().forEach(zombie => {
        if (zombie.getData('alive')) {
            const angleToPlayer = Phaser.Math.Angle.Between(zombie.x, zombie.y, player.x, player.y);
            zombie.rotation = Phaser.Math.Angle.RotateTo(zombie.rotation, angleToPlayer, 0.1);
            zombie.setVelocity(Math.cos(angleToPlayer) * zombie.getData('speed'), Math.sin(angleToPlayer) * zombie.getData('speed'));
            updateZombieHealthBar(scene, zombie);
        }
    });
}

function createZombieHealthBar(scene, zombie) {
    const healthBar = scene.add.graphics();

    healthBar.fillStyle(0x150000, 0.5); // Set color to red
    healthBar.fillRect(zombie.x - 20, zombie.y - 50, 40, 8);

    zombie.setData('healthBar', healthBar);
}

export function updateZombieHealthBar(scene, zombie) {

    const healthBar = zombie.getData('healthBar');

    if (healthBar) {
        const healthWidth = (zombie.getData('health') / 100) * 40; // Health is between 0 and 100, width of 40
        healthBar.clear();
        healthBar.fillStyle(0x150000, 0.5);
        healthBar.fillRect(zombie.x - 20, zombie.y + 20, healthWidth, 2);
    }
}
