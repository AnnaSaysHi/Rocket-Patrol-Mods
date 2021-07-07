class Play extends Phaser.Scene {
  constructor() {
    super("playScene");
  }
  preload() {
    // load images/tile sprites
    this.load.image('rocket', './assets/rocket.png');
    this.load.image('spaceship', './assets/spaceship.png');
    this.load.image('starfield', './assets/starfield.png');
    this.load.spritesheet('laser', './assets/laser.png', {frameWidth: 4, frameHeight: 400, startFrame: 0, endFrame: 3});
    this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
  }
  create() {
    // place tile sprite
    this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

    // green UI background
    this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

    // white borders
    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

    // add rocket (p1)
    this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

    // add spaceships (x3)
    this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30, 4).setOrigin(0, 0);
    this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20, 2).setOrigin(0,0);
    this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10, 1).setOrigin(0,0);

    // define keys
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);

    // animation config
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
      frameRate: 30
    });
    this.anims.create({
      key: 'lasershot',
      frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 3, first: 0}),
      frameRate: 15
    });

    this.p1Score = 0;
    this.p1time = 60;
    this.timeleft = 60;
    // display score
    let scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#F3B141',
      color: '#843605',
      align: 'right',
        padding: {
          top: 5,
          bottom: 5,
        },
      fixedWidth: 100
    }
    this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
    this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*2, this.timeleft, scoreConfig);
    this.scoreCTR = this.add.text((game.config.width - scoreConfig.fixedWidth)/2, borderUISize + borderPadding*2, "", scoreConfig);
    this.gameOver = false;

    // 60-second play clock
    //scoreConfig.fixedWidth = 0;
    this.startTime = Date.now();
  }

  update() {
    if(this.timeleft <= 0){
      this.timeleft = 0;
      let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
          padding: {
            top: 5,
            bottom: 5,
          },
        fixedWidth: 0
      }
      this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
      this.gameOver = true;
    }
    this.starfield.tilePositionX -= 4;
    if(!this.gameOver){
      if(Phaser.Input.Keyboard.JustDown(keyF) && !this.p1Rocket.isFiring){
        this.scoreCTR.text = "FIRE!";
        this.clock = this.time.delayedCall(1000, () => {
          this.scoreCTR.text = "";
        }, null, this);
        this.p1Rocket.isFiring = true;
        this.p1Rocket.sfxRocket.play();
      }
      if(Phaser.Input.Keyboard.JustDown(keyG) && !this.p1Rocket.isFiring ){
        this.p1time -= 5;
        this.p1Rocket.sfxRocket.play();
        let ray = this.add.sprite(this.p1Rocket.x - 2, this.p1Rocket.y - 408, 'laser').setOrigin(0, 0);
        ray.anims.play('lasershot');             // play laser animation
        ray.on('animationcomplete', () => {    // callback after anim completes
          ray.destroy();
        });
        
        if(this.checkLaser(this.p1Rocket, this.ship01)){
          this.shipExplode(this.ship01);
        }
        if(this.checkLaser(this.p1Rocket, this.ship02)){
          this.shipExplode(this.ship02);
        }
        if(this.checkLaser(this.p1Rocket, this.ship03)){
          this.shipExplode(this.ship03);
        }
        //laser code goes here
      }
      this.p1Rocket.update();
      this.ship01.update();
      this.ship02.update();
      this.ship03.update();
    }
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
      this.scene.restart();
    }
    this.timeleft = Math.floor((this.p1time*1000 - (Date.now() - this.startTime))/1000);
    if (Date.now() - this.startTime > 30000){
      this.ship01.moveSpeed = game.settings.spaceshipSpeed + 2;
      this.ship02.moveSpeed = game.settings.spaceshipSpeed + 2;
      this.ship03.moveSpeed = game.settings.spaceshipSpeed + 2;
    }
    if(this.timeleft < 0){
      this.timeleft = 0;
    }
    if(this.timeleft % 60 < 10){
      this.scoreRight.text = (Math.floor(this.timeleft/60) + ':0' + (this.timeleft % 60));
    }
    else{
      this.scoreRight.text = (Math.floor(this.timeleft/60) + ':' + (this.timeleft % 60));
    }
  


    // check collisions

    if(this.checkCollision(this.p1Rocket, this.ship03)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship03);
    }
    if (this.checkCollision(this.p1Rocket, this.ship02)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship02);
      }
    if (this.checkCollision(this.p1Rocket, this.ship01)) {
      this.p1Rocket.reset();
      this.shipExplode(this.ship01);
    }
    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      this.scene.start("menuScene");
    }
  }

  checkCollision(rocket, ship) {
    // simple AABB checking
    if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
      return true;
    } else {
      return false;
    }
  }
  checkLaser(rocket, ship) {
    // simple AABB checking
    if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x) {
      return true;
    } else {
      return false;
    }
  }
  shipExplode(ship) {
    // temporarily hide ship
    ship.alpha = 0;
    // create explosion sprite at ship's position
    let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
    boom.anims.play('explode');             // play explode animation
    boom.on('animationcomplete', () => {    // callback after anim completes
      ship.reset();                         // reset ship position
      if(ship.direction == 1){
        ship.flipX = true;
      }else{
        ship.flipX = false;
      }
      ship.alpha = 1;                       // make ship visible again
      boom.destroy();                       // remove explosion sprite
    });
    this.p1Score += ship.points;
    this.p1time += ship.timeBonus;
    this.scoreLeft.text = this.p1Score; 
    this.sound.play('sfx_explosion');   
  }
}