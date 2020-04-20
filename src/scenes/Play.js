class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
      
   }

   preload() {
      // load image/tile sprite
      this.load.image('rocket', './assets/rocket.png');
      this.load.image('spaceship', './assets/spaceship.png');
      this.load.image('starfield', './assets/starfield.png');

      // load spritesheet
      this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
   }

   create() {
      // place tile sprite
      this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

      // add hi score UI
      this.hiScore = this.add.text(20, 24, 'Hi Score: '+this.p1HiScore);
      // white rectangle borders
      //this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
      //this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
      //this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
      //this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);

      // green UI background
      this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);
      
      // add p1 rocket
      this.p1Rocket = new Rocket(this, game.config.width/2, 435, 'rocket').setScale(0.5,0.5).setOrigin(0, 0);
      console.log(this.p1Rocket.isFiring);

      // add spaceship (x3)
      this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0, 0);
      this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0, 0);
      this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0, 0);

      // define keyboard keys
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);


      // define mouse inputs
      this.input.on('pointermove', function(pointer) {
         if(!this.gameOver)
            this.p1Rocket.x = Phaser.Math.Clamp(pointer.x, 52, 748);
      }, this);
      this.input.on('pointerup', function(pointer) {
         if(!this.gameOver){
            this.p1Rocket.isFiring = true;
            this.p1Rocket.sfxRocket.play(); // play sfx
         }
         
      }, this);

      

      // animation config
      this.anims.create({
         key: 'explode',
         frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
         frameRate: 30
      });

      // score
      this.p1Score = 0;
      if(this.p1HiScore == undefined)
         this.p1HiScore = 0;


      let scoreConfig = {
         fontFamily: 'Courier',
         fontsize: '28px',
         backgroundColor: '#F3B141',
         color: '#843605',
         align: 'right',
         padding: {
            top: 5,
            bottom: 5,
         },
         fixedWidth: 120
      }

      // count down timer
      this.initTime = game.settings.gameTimer/1000;
      
      this.timer = this.add.text(400,54, "Time:"+this.initTime, scoreConfig);
      
      
      this.countdownE = this.time.addEvent({ delay: 1000, callback: this.countdown, callbackScope: this, repeat: this.initTime-1 });

      // score display
      
      
      
      this.scoreLeft = this.add.text(69, 54, "SCORE " + this.p1Score, scoreConfig);

      this.fireLeft = this.add.text(200, 54, 'FIRE', scoreConfig);
      this.fireLeft.alpha = 0;

      

      // game over flag
      this.gameOver = false;
      
      this.timerE = this.time.addEvent({ delay: this.initTime*1000, callback: this.addTime, callbackScope: this, loop: true });

      // 60-second play clock
      // scoreConfig.fixedWidth = 0;
      // this.clock = this.time.delayedCall(this.initTime*1000, () => {
      //    this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
      //    this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu',
      // scoreConfig).setOrigin(0.5);
      //    this.gameOver = true;
      // }, null, this);
      console.log("SCore:"+this.p1Score);
      console.log("HiSCore:"+this.p1HiScore);

     
     
   }

   update() {
      
      // if(this.gameOver)
      //    this.input.destroy();
      // check key input for restart
      if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
         this.scene.restart(this.p1Score);
         console.log("SCore:"+this.p1Score);
          console.log("HiSCore:"+this.p1HiScore);
         if(this.p1Score > this.p1HiScore)
            this.p1HiScore = this.p1Score;
      }

      if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
         this.scene.start("menuScene");
         if(this.p1Score > this.p1HiScore)
            this.p1HiScore = this.p1Score;
      }

      // scroll starfield
      this.starfield.tilePositionX -= 4;
      //this.starfield.tilePositionY -= 4;

      // update rocket
      if(!this.gameOver){
         this.p1Rocket.update();
         if(this.p1Rocket.isFiring)
            this.fireLeft.alpha = 1;
         else this.fireLeft.alpha = 0;
         if(this.initTime>(game.settings.gameTimer/1000-30)){
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
         }else{
            // move spaceship left
            this.ship01.x -= game.settings.spaceshipSpeed + 4;
            this.ship02.x -= game.settings.spaceshipSpeed + 4;
            this.ship03.x -= game.settings.spaceshipSpeed + 4;
            // wraparound from left to right edge
            if(this.ship01.x <= 0 - this.ship01.width)
               this.ship01.reset();
            if(this.ship02.x <= 0 - this.ship02.width)
               this.ship02.reset();
            if(this.ship03.x <= 0 - this.ship03.width)
               this.ship03.reset();
            
         }
      }

      // check collisions
      if(this.checkCollision(this.p1Rocket, this.ship03)) {
         this.p1Rocket.reset();
         this.shipExplode(this.ship03);
         this.initTime += 1;
         this.timerE.remove();
         this.timerE = this.time.addEvent({ delay: this.initTime*1000, callback: this.addTime, callbackScope: this, loop: true });
         this.countdownE.remove();
         this.countdownE = this.time.addEvent({ delay: 1000, callback: this.countdown, callbackScope: this, repeat: this.initTime-1 });
      }
         
      if(this.checkCollision(this.p1Rocket, this.ship02)) {
         this.p1Rocket.reset();
         this.shipExplode(this.ship02);
         this.initTime += 2;
         this.timerE.remove();
         this.timerE = this.time.addEvent({ delay: this.initTime*1000, callback: this.addTime, callbackScope: this, loop: true });
         this.countdownE.remove();
         this.countdownE = this.time.addEvent({ delay: 1000, callback: this.countdown, callbackScope: this, repeat: this.initTime-1 });
      }
         
      if(this.checkCollision(this.p1Rocket, this.ship01)) {
         this.p1Rocket.reset();
         this.shipExplode(this.ship01);
         this.initTime += 3;
         this.timerE.remove();
         this.timerE = this.time.addEvent({ delay: this.initTime*1000, callback: this.addTime, callbackScope: this, loop: true });
         this.countdownE.remove();
         this.countdownE = this.time.addEvent({ delay: 1000, callback: this.countdown, callbackScope: this, repeat: this.initTime-1 });
      }

      // if(this.p1Rocket.isFiring)
      //    this.fireLeft.alpha = 0;

       //+= ship.points;
        //for(let i=0; i<5; ++i){
        // console.log(this.timer.text);
        //
         
       //}
       
      
   }

   checkCollision(rocket, ship) {
      // simple AABB checking
      if (rocket.x < ship.x + ship.width &&
          rocket.x + rocket.width > ship.x &&
          rocket.y < ship.y + ship.height &&
          rocket.y + rocket.height > ship.y) {
             return true;
      }else {
         return false;
      }

   }

   shipExplode(ship) {
      ship.alpha = 0;                       // temporarily hide ship
      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');           // play explode animation
      boom.on('animationcomplete', () => {  // callback after animation completes
         ship.reset();                      // reset ship position
         ship.alpha = 1;                    // make ship visible again
         boom.destroy();                    // remove explostion sprite
      });

      // score increment and repaint
      this.p1Score += ship.points;
      this.scoreLeft.text = "SCORE " + this.p1Score;
      this.sound.play('sfx_explosion');
      

   }

   countdown() {
      this.initTime -= 1;
      this.timer.text = "Time:"+this.initTime;
      
   }

   addTime() {
      let scoreConfig = {
         fontFamily: 'Courier',
         fontsize: '28px',
         backgroundColor: '#F3B141',
         color: '#843605',
         align: 'right',
         padding: {
            top: 5,
            bottom: 5,
         },
         fixedWidth: 100
      }
      scoreConfig.fixedWidth = 0;
      this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu',
         scoreConfig).setOrigin(0.5);
      this.gameOver = true;
   }

}