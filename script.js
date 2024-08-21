let snakeBody;
let food;
let direction;
let allowedToMove;
let isPlaying;
let map;
let one_step_time = 600;
let speed = 1.5;
let play;
let best_score = 0;
let current_score = 0;
let is_game_over = "false";
let current_score_counter = document.getElementById("current_score_counter");

function initializeVariables() {
    snakeBody = [[0, 0]];
    food = 0;
    direction = "Right";
    allowedToMove = false;
    isPlaying = false;
}
// Creating the map and initializing variables
function initializeGameState() {
    map = document.getElementById("map");
    initializeVariables();
    // Generating the map pixels
    for (let i = 0; i < 100; i++) {
        let pixel = document.createElement("div");
        pixel.setAttribute("class", "pixel");
        map.appendChild(pixel);
    }
    // Generating the snake body and food
    map.children[0].classList.add("snake-body");
    generateFood();
}
function generateFood() {
    // To prevent generating food over the snake
    while (map.children[food].classList.contains("snake-body")) {
        food = Math.floor(Math.random() * 100);
    }
    // Placing food on the map
    map.children[food].classList.add("food");
}
function startGame() {
    if (!isPlaying) {
        allowedToMove = true;
        play = setInterval(updatePosition, one_step_time / speed);
        document.getElementById("menu").style.display = "none";
        document.getElementById("map").style.display = "";
        isPlaying = true;
    }
}
function gameOver() {
    clearInterval(play);
    if(snakeBody.length - 1 > best_score){
        best_score = snakeBody.length - 1;
    }
    document.getElementById("menu-text").innerText =
    "Game Over\n" + "" + "\nYour best score: " + best_score + "\nYour Score: " + (snakeBody.length - 1) +"\nPress ENTER to restart";
    document.getElementById("menu").style.display = "";
    document.getElementById("map").style.display = "none";
    map.innerText = ""; // Clearing the map
    initializeGameState(map); // Re-generating the map
    current_score_counter.textContent = "Score: 0";
}
function updatePosition() {
    let newPosY;
    let newPosX;
    let head = snakeBody[snakeBody.length - 1];
    switch (direction) {
        case "Up":
            newPosY = head[0] - 1;
            newPosX = head[1];
            break;
        case "Down":
            newPosY = head[0] + 1;
            newPosX = head[1];
            break;
        case "Left":
            newPosY = head[0];
            newPosX = head[1] - 1;
            break;
        case "Right":
            newPosY = head[0];
            newPosX = head[1] + 1;
            break;
        default:
            break;
    }
    // Checking if snake hit the wall
    if (newPosY < 0 || newPosY > 9 || newPosX < 0 || newPosX > 9) {
        is_game_over = "true";
        gameOver();
    } else {
        snakeBody.push([newPosY, newPosX]);
        updateScreen();
        allowedToMove = true;
    }
}
function updateScreen() {
    let tailArray = snakeBody.shift();
    let tail = parseInt(tailArray[0] + "" + tailArray[1]);
    let headArray = snakeBody[snakeBody.length - 1];
    let head = parseInt(headArray[0] + "" + headArray[1]);
    // Checking if the snake bite its body
    if (map.children[head].classList.contains("snake-body")) {
        is_game_over = "true";
        gameOver();
    } else {
        // Adds the new head block
        map.children[head].classList.add("snake-body");
        // Removes the tail block
        map.children[tail].classList.remove("snake-body");
        // If snake eats the food
        if (head == food) {
            map.children[food].classList.remove("food");
            snakeBody.unshift(tailArray);
            // Checking if the snake reached its max size
            snakeBody.length == 100 && gameOver();
            generateFood();
            if(is_game_over == "false"){
            current_score++;
            }else if(is_game_over == "true"){
                current_score = 1;
                is_game_over = "false";
            }
            current_score_counter.textContent = "Score: " + current_score;
        }
    }
}
// CONTROLS //
document.addEventListener("keydown",function(event){
    event.preventDefault();
    event.code == "Enter" && startGame();
    if (allowedToMove) {
        allowedToMove = false;
        switch (event.code) {
            case "ArrowLeft":
                direction != "Right" && (direction = "Left")
                break;
            case "ArrowUp":
                direction != "Down" && (direction = "Up");
                break;
            case "ArrowRight":
                direction != "Left" && (direction = "Right");
                break;
            case "ArrowDown":
                direction != "Up" && (direction = "Down");
                break;
            default:
                allowedToMove = true;
                break;
        }
    }
})

initializeGameState();
