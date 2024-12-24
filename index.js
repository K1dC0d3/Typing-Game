// DOM Elements
const ttT = document.getElementById('textToType');
const currentKey = document.getElementById('currentKey');
const typingSpeed = document.getElementById('typingSpeed');
const accuracy = document.getElementById('accuracy');
const timeTaken = document.getElementById('timeTaken');
const raceCanvas = document.getElementById('race');
raceCanvas.width = 700, raceCanvas.height = 350;

// Race Canvas Graphics
const raceCtx = raceCanvas.getContext('2d');

// Number of Bot Cars
let noOfBotCars = 3;

// Sprite
let spriteObject = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  color: 'black',
  bot: false,
  speed: 0
}

// The player's sprite
let player = Object.create(spriteObject);
player.width = 50;
player.height = 30;
player.y = 36;
player.color = 'blue';
let playerProgress = 0;

// Bot Race Cars
let bot = Object.create(spriteObject);
bot.bot = true;
bot.width = 50;
bot.height = 30;

// Sprites Array and The Sprites to be rendered
let sprites = [];
sprites.push(player);

for (let i = 0; i < noOfBotCars; i++) {
  let car = Object.create(bot);
  car.y = 86 * (i + 1);
  car.speed = 0.15 + Math.random() * 0.33;
  sprites.push(car);
}

// User values
let text = "";
let time = 0; // Time spent typing
let keyPressed = "";
let currentV = 0;
let errors = 0;

// Random number: determines the number of words in the text
let textLength = 30 + Math.floor(20 * Math.random());

// Timer
let timer;
let timeUsed = 0;

// Start The GAme
let start = false;

// Word Library
const wordLibrary = [
  "The", "Be", "To", "Of", "And", "A", "In", "That", "Have", "I",
  "It", "For", "Not", "On", "With", "He", "As", "You", "Do", "At",
  "This", "But", "His", "By", "From", "They", "We", "Say", "Her", "She",
  "Or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "am", "was", "were", "been", "being", "has", "had", "having",
  "does", "did", "doing", "don't", "won't", "can't", "should", "wouldn't", "shouldn't", "might",
  "must", "shall", "shalln't", "let", "please", "yes", "no", "oh", "hey", "hi",
  "hello", "goodbye", "thanks", "sorry", "excuse", "help", "love", "hate", "think", "believe",
  "sure", "wait", "stop", "start", "begin", "end", "finish", "open", "close", "read",
  "write", "speak", "listen", "hear", "see", "look", "touch", "feel", "taste", "smell",
  "buy", "sell", "pay", "cost", "find", "search", "lose", "keep", "send", "receive",
  "build", "break", "fix", "throw", "catch", "bring", "carry", "move", "stay", "stand",
  "sit", "walk", "run", "jump", "fly", "drive", "ride", "swim", "climb", "fall",
  "live", "die", "kill", "save", "hide", "show", "call", "text", "email", "meet",
  "talk", "ask", "answer", "laugh", "cry", "smile", "frown", "yawn", "sleep", "wake",
  "dream", "hope", "wish", "want", "need", "try", "work", "study", "learn", "teach",
  "grow", "shrink", "change", "stay", "remain", "become", "turn", "continue", "stop", "begin",
  "start", "end", "repeat", "happen", "occur", "exist", "appear", "disappear", "remain", "seem",
  "sound", "taste", "smell", "feel", "look", "believe", "think", "know", "understand", "realize",
  "remember", "forget", "imagine", "create", "build", "destroy", "fix", "break", "improve", "worsen",
  "add", "subtract", "multiply", "divide", "count", "calculate", "measure", "weigh", "balance", "solve",
  "win", "lose", "tie", "draw", "score", "play", "compete", "fight", "attack", "defend",
  "protect", "guard", "watch", "care", "share", "give", "receive", "take", "borrow", "lend",
  "buy", "sell", "trade", "exchange", "spend", "save", "invest", "earn", "pay", "owe",
  "plan", "prepare", "organize", "arrange", "schedule", "decide", "choose", "prefer", "want", "need",
  "ask", "answer", "tell", "say", "speak", "listen", "hear", "shout", "whisper", "laugh",
  "cry", "smile", "frown", "yawn", "sleep", "wake", "dream", "hope", "wish", "believe",
  "think", "know", "understand", "realize", "remember", "forget", "imagine", "create", "build", "destroy",
  "fix", "break", "improve", "worsen", "add", "subtract", "multiply", "divide", "count", "calculate",
  "measure", "weigh", "balance", "solve", "win", "lose", "tie", "draw", "score", "play",
  "compete", "fight", "attack", "defend", "protect", "guard", "watch", "care", "share", "give",
  "receive", "take", "borrow", "lend", "buy", "sell", "trade", "exchange", "spend", "save",
  "invest", "earn", "pay", "owe", "plan", "prepare", "organize", "arrange", "schedule", "decide",
  "choose", "prefer", "want", "need", "ask", "answer", "tell", "say", "speak", "listen",
  "hear", "shout", "whisper", "laugh", "cry", "smile", "frown", "yawn", "sleep", "wake",
  "dream", "hope", "wish", "believe", "think", "know", "understand", "realize", "remember", "forget",
  "imagine", "create", "build", "destroy", "fix", "break", "improve", "worsen", "add", "subtract",
  "multiply", "divide", "count", "calculate", "measure", "weigh", "balance", "solve", "win", "lose",
  "tie", "draw", "score", "play", "compete", "fight", "attack", "defend", "protect", "guard",
  "watch", "care", "share", "give", "receive", "take", "borrow", "lend", "buy", "sell"
];

// Create random text
for (let i = 0; i < textLength; i++) {
  let rand = Math.ceil(20 * Math.random());
  let newWord = wordLibrary[Math.floor(wordLibrary.length * Math.random())];
  if (i == textLength - 1) {
    text += (newWord.toLowerCase() == "i" ? "I" : newWord.toLowerCase());
    break;
  } else if (i === 1) {
    text += newWord + ' ';
  }
  if (rand == 1) {
    text += (newWord.toLowerCase() == "i" ? "I" : newWord.toLowerCase()) + ', ';
  } else {
    text += (newWord.toLowerCase() == "i" ? "I" : newWord.toLowerCase()) + ' ';
  }
}

// Initial data
ttT.innerHTML = text;
currentKey.innerHTML = text[currentV];

window.addEventListener('keydown', function (e) {
  if (!start) {
    timer = window.setInterval(timeUser, 10);
    start = true;
  }
  keyPressed = e.key;
  if (start) {
    if (keyPressed == text[currentV] && currentV !== text.length) {
      currentKey.style.backgroundColor = "#0C0";
      currentV++;
      if (text[currentV] != undefined)
        currentKey.innerHTML = text[currentV];
      else {
        currentKey.innerHTML = "Done";
        currentKey.style.width = "140px";
      }
    } else if (keyPressed != text[currentV] && keyPressed != 'Shift') {
      currentKey.style.backgroundColor = "#F00";
      errors++;
    }
  }
  if (keyPressed == "Enter") {
    restart();
  }
});

// Function counting the amount of time spent by the user on the text given
function timeUser() {
  timeUsed += 0.01;
  if (currentV === text.length) {
    clearInterval(timer);
    start = false;
    typingSpeed.innerHTML = "Typing Speed: " + Math.floor((textLength / timeUsed) * 60) + "WPM";
    accuracy.innerHTML = "Accuracy: " + Math.floor((text.length / (errors + text.length)) * 100) + "%";
    timeTaken.innerHTML = "Time Taken: " + Math.floor(timeUsed) + " seconds";
  }
}

function restart() {
  window.open(window.location, '_self');
}

function raceUpdate() {
  playerProgress = (currentV / text.length) * (raceCanvas.width - player.width);
  player.x = playerProgress;

  if (start)
    for (let i = 0; i < sprites.length; i++) {
      if (sprites[i].bot == true) {
        sprites[i].x += sprites[i].speed;
      }
    }

  renderRace();

  requestAnimationFrame(raceUpdate);
}

function renderRace() {
  raceCtx.clearRect(0, 0, raceCanvas.width, raceCanvas.height);

  for (let i = 0; i < sprites.length; i++) {
    raceCtx.fillStyle = sprites[i].color;
    raceCtx.fillRect(sprites[i].x, sprites[i].y, sprites[i].width, sprites[i].height);
  }
  /*raceCtx.fillStyle = racetrack.color;
  raceCtx.fillRect(racetrack.x, racetrack.y, racetrack.width, racetrack.height);
  raceCtx.fillStyle = player.color;
  raceCtx.fillRect(player.x, player.y, player.width, player.height);*/
}

raceUpdate();