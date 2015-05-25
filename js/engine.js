/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        //add counter for win and lsot
        winCounter = 0,
        lostCounter = 0,
        //add variable to store info text for player
        infoText = "Game started!",
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
         //write infoText for the first time (Game started)
        ctx.font="20px Georgia";
        ctx.textAlign="center";
        ctx.fillText(infoText,253,100);


        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */


        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        //call function to check player and enemies for colision
        checkCollisions();
    }

    function checkCollisions(){
        //loop trought all enemies
        allEnemies.forEach(function(enemy) {
            //calculate different beetween players x and enemmys x
            var diff = player.x - enemy.x;
            //compare position of player with enemie
            if ((diff > -75 && diff < 75) && enemy.y == player.y) {
                //colision found, set status to "colision" and call reset function
                player.status = "collision";
                reset();
            }
        });
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        //maximum number of enemies is 10. I use this variable "timeForAnother" to store information
        //if I have to add another enemy into the canvas
        var timeForAnother = true;
        allEnemies.forEach(function(enemy,index) {
            enemy.update(dt);
            //in this condition, I am checking distance of latest enemy in canvas.
            //I want to have some space between enemies.
            //Plus I am generating random number, to decide if another enemy will be add to canvas
            if (enemy.x > 101 && Math.random() > 0.98) {
                timeForAnother = true;
            }
            else{
                timeForAnother = false;
            }
            //If enemy is of screan/canvas, It's removed from allEnemies array
            if(enemy.x > 500){
                allEnemies.splice(index,1);
            }
        });
        //I don't want to have more than 10 enemies in screan.
        if (allEnemies.length < 10 && timeForAnother) {
            //if less than 10 enemies and timeForAnother is true, create a new enemy
            var new_enemy = new Enemy();
            //set x of new enemy to 0
            new_enemy.x = 0;
            //base on the random number from 1 to 3, set starting y position fo new enemy (42 or 125 or 208)
            new_enemy.y = Math.floor((Math.random() * 3) + 1) * 83 -41;
            //add new enemy into to allEnemies array
            allEnemies.push(new_enemy);
        }
        //player.update function return true/false
        //if return false, it's time for reset game.
        if(!player.update()){
            reset();
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        //add game status into the canvas
        ctx.font="20px Georgia";
        ctx.textAlign="center";
        ctx.fillStyle = 'black';
        ctx.fillText(infoText,253,570);
        //show score in right top corner, positive score is green, negative(bad) is red
        ctx.font="20px Georgia";
        ctx.textAlign="center";
        if(winCounter>=lostCounter) ctx.fillStyle = 'LawnGreen';
        else ctx.fillStyle = 'red';
        ctx.fillText("Win/Lost score: "+winCounter+"/"+lostCounter,400,80);
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        //Base on the player.status swith, if player win or lost
        switch(player.status){
        case 'win':
            infoText = "WIN!";
            winCounter += 1;
            break;
        case 'collision':
            infoText = "LOST - because of collision! Game restarted";
            lostCounter += 1;
            break;
        default:
            break;
        }
        player.reset();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
