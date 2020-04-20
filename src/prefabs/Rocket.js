// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      
      scene.add.existing(this);// add object to the exitsing scene
      this.isFiring = false; // track firing status
      this.zoneMode = false; // entering a zone mode
      //this.p1HiScore = 0;
      this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx

   }

   // create() {
   //    let fireConfig = {
   //       fontFamily: 'Courier',
   //       fontsize: '50px',
   //       backgroundColor: '#F3B141',
   //       color: '#843605',
   //       align: 'right',
   //       padding: {
   //          top: 5,
   //          bottom: 5,
   //       },
   //       fixedWidth: 100
   //    }
   //    this.fireLeft = this.add.text(200, 54, 'FIRE', fireConfig);
   //    //this.fireLeft.alpha = 0.5;
   // }

   update() {
      // left/right movement
      if(!this.isFiring) {
         if(keyLEFT.isDown && this.x >= 47)
            this.x -= 2;
         else if(keyRIGHT.isDown && this.x <= 598)
            this.x += 2;

      }

      // fire button (NOT spacebar)
      if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
         this.isFiring = true;
         this.sfxRocket.play(); // play sfx

      }

      // fire button with mouse
      // if(Phaser.Input.Pointer.leftButtonDown() && !this.isFiring) {
      //    console.log("hello");
      //    this.isFiring = true;
      //    this.sfxRocket.play(); // play sfx

      // }

      // if fire, move up
      if(this.isFiring && this.y >= 108) {
         this.y -= 2;
         // Allow the player to control the Rocket after it's fired
         if(keyLEFT.isDown && this.x >= 47)
            this.x -= 2;
         else if(keyRIGHT.isDown && this.x <= 598)
            this.x += 2;
      }
      // reset on miss
      if(this.y <= 108) {
         this.reset();
      }
   }

   // reset rocket to "ground"
   reset() {
      this.isFiring = false;
      this.y = 431;
   }
}