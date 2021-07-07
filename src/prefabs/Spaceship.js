// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        // add object to existing scene
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.direction = 0;
    }

    update() {
        if(this.direction == 0){
            this.x -= this.moveSpeed;
            if(this.x <= 0 - this.width) {
                this.x = game.config.width;
            }
        }
        if(this.direction == 1){
            this.x += this.moveSpeed;
            if(this.x >= game.config.width) {
                this.x = 0 - this.width;
            }
        }
    }

    reset() {
        this.direction = Math.floor(2 * Math.random());
        this.x = game.config.width;
    }

}