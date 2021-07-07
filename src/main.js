/*
Rocket Patrol mods by Anna Perlow
Completed July 6, 2021
Modifications completed in roughly 2-3 hours
Read the readme for points breakdown
*/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}

//reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyG;

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;