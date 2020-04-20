// developer: Sheng Yu
// Track a high score that persists across scenes and display it in the UI (10)
// Implement the 'FIRE' UI text from the original game (10)
// Implement the speed increase that happens after 30 seconds in the original game (10)
// Allow the player to control the Rocket after it's fired (10)
// Display the time remaining (in seconds) on the screen (15)
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits (25)
// Implement mouse control for player movement and mouse click to fire (25)
let config = {
   type: Phaser.CANVAS,
   width: 640,
   height: 480,
   scene: [ Menu, Play],

};
let game = new Phaser.Game(config);

// define game settings
game.settings = {
   spaceshipSpeed: 3,
   gameTimer: 60000
} 

// reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT; 
