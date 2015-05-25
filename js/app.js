// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x;
    this.y;
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //console.log("Enemy x:"+this.x+" y:"+this.y);
    this.x += Math.floor(dt*70);
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Player = function(){
    this.sprite = 'images/char-cat-girl.png';
    this.x;
    this.y;
    this.status;
}


Player.prototype.update = function(dt){
    //console.log("Player x:"+this.x+" y:"+this.y);
    //check if player is of screan
    if (this.x <= -1 || this.x >= 505 || this.y >= 375) {
        this.status = "lost";
        return false;
    //check if player win
    } else if(this.y <= 0 ){
        this.status = "win";
        return false;
    }else return true
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(pKey){
    switch(pKey){
        case 'left':
            if(this.x>0){
                this.x = this.x - 101;
            }
            break;
        case 'right':
            if(this.x<404){
                this.x = this.x + 101;
            }
            break;
        case 'up':
            this.y = this.y - 83;
            break;
        case 'down':
            if(this.y<293){
                this.y = this.y + 83;
            }
            break;
    }
}

Player.prototype.reset = function(){
    //set player to start position.
    this.x =202;
    this.y =374;
}

var allEnemies = [];
var player = new Player();
player.reset();


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    console.log("key"+e.keyCode);
    player.handleInput(allowedKeys[e.keyCode]);
});
