//API VARIABLES
let faceapi;
let detections = [];
//MAIN VARIABLES
let video;
let canvas;
let fontinha;
//QUESTIONS VARIABLES
let questions = [
  "Hello, I see you!",
  "Let's chat a bit!",
  "But before, let me ask you something",
  "Can you smile for me?",
  "You have such a nice smile!",
  "Now frown!",
  "Act surprised! :o",
  "Good job!",
  "Now answer the questions with your expressions!",
  "Make a face that represents your day",
  "Do you feel like smiling right now?",
  "Do you feel peaceful at this moment?",
  "Your favorite song is playing! How do you feel?",
  "34 didn't show up, how do you feel?",
  "Are you excited about tomorrow?",
  "How do you feel when you think about the future?",
  "How do you feel when the weather is gloomy?",
  "",
];
let questionSelected = 0;
let happyResponses = [
  "You're glowing!",
  "Your smile is contagious!",
  "I am so glad you feel that way!",
  "Your energy is awesome!",
  "I can feel the positivity from here!",
  "Seeing you like this is amazing!",
];
let sadResponses = [
  "Everything will be okay!",
  "I'm here for you!",
  "Sending you virtual hugs!",
  "Take a deep breath!",
  "Better days are coming.",
  "I'm holding space for you!",
];
let surprisedResponses = [
  "Wow! Didn't see that coming?",
  "What a surprise!",
  "Unexpected, right?",
  "Wait... seriously?",
  "Now that's a shocker!",
  "That's mind-blowing!",
];
let showAnswer = false;
let answer = "";
let timeCounter = 0;
//EMOTIONS VARIABLES
let seeFace = false;
let happyCounter = 0;
let surprisedCounter = 0;
let sadCounter = 0;
let emotionColor
let bgColor;
let happyState = false;
let sadState = false;
let surprisedState = false;

function preload() {
  fontinha = loadFont("Ubuntu-Bold.ttf");
}

function setup() {
  canvas = createCanvas(displayWidth, displayHeight);
  canvas.id("canvas");
  video = createCapture(VIDEO);
  video.id("video");
  video.size(500, 500);
  video.hide();
  emotionColor = color(150, 150, 150);
  bgColor = color(150, 150, 150);
  textAlign(CENTER);
  textFont(fontinha);
  noStroke();
  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true, //idk what this does
    minConfidence: 0.3,
  };
  faceapi = ml5.faceApi(video, faceOptions, faceReady); //Inicializar faceAPI com video selecionado, settings selecionadas, funcao de inicializacao selecionada
}

function draw() {
  clear();
  textSize(50);
  fill(255);
  bgColor = lerpColor(bgColor, emotionColor, 0.05);
  background(bgColor);
  image(video, displayWidth / 2 - 250, displayHeight / 2 - 250); //Mostrar captura da camera
  if (seeFace == false) return;
  text(questions[questionSelected], displayWidth / 2, displayHeight / 2 - 300); //Mostrar questao
  if (timeCounter == 0) timeCounter = millis();
  switch (questionSelected) {
    case 0:
      if (millis() - timeCounter > 3000) {
        questionSelected = 1;
        timeCounter = millis();
      }
      break;
    case 1:
      if (millis() - timeCounter > 3000) {
        questionSelected = 2;
        timeCounter = millis();
      }
      break;
    case 2:
      if (millis() - timeCounter > 3000){
        questionSelected = 3;
        happyCounter = 0;
      }
      break;
    case 3:
      if (happyCounter >= 10) {
        questionSelected = 4;
        timeCounter = millis();
      }
      break;
    case 4:
      if (millis() - timeCounter > 3000){
        questionSelected = 5;
        sadCounter = 0;
      }
      break;
    case 5:
      if (sadCounter >= 10) questionSelected = 6;
      break;
    case 6:
      if (surprisedCounter >= 10) {
        questionSelected = 7;
        timeCounter = millis();
      }
      break;
    case 7:
      if (millis() - timeCounter > 3000){
        questionSelected = 8;
        timeCounter = millis();
      }
      break;
    case 8:
      if (millis() - timeCounter > 3000) {
        resetCounters();
        questionSelected = 9;
      }
      break;
    default:
      if (showAnswer) {
        textSize(30);
        fill(255);
        text(answer, displayWidth / 2, displayHeight / 2 + 200);
        happyCounter = 0;
        sadCounter = 0;
        surprisedCounter = 0;
        if (millis()- timeCounter > 5000) {
          questionSelected++;
          showAnswer = false;
          answer = ""; // Apagar a resposta quando a pergunta mudar
          emotionColor = color(175,175,175); //Default color
        }
      } else {
        if (happyCounter >= 10) {
          happyCounter = 0;
          emotionColor = color(255,255,50); //Happy color
          answer = random(happyResponses);
          showAnswer = true;
          timeCounter = millis();
        } else if (sadCounter >= 10) {
          sadCounter = 0;
          emotionColor = color(50,70,255); //Sad color
          answer = random(sadResponses);
          showAnswer = true;
          timeCounter = millis();
        } else if (surprisedCounter >= 10) {
          surprisedCounter = 0;
          emotionColor = color(218,50,135); //Surprised Color
          answer = random(surprisedResponses);
          showAnswer = true;
          timeCounter = millis();
        }
      }
  }
}

//Funcao para dizer qual emocao esta ativa
function whatExpression(detections) {
  if (detections.length != 0) {
    seeFace = true;
    let expressions = detections[0].expressions;
    let { neutral, happy, sad, surprised } = expressions;
    arr = [neutral * 0.8, happy, sad, surprised];
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[maxIndex]) {
        maxIndex = i;
      }
    }
    switch (maxIndex) {
      case 0:
        if (neutral > 0.5) {
        } else {
          for (let i = 1; i < arr.length; i++) {
            if (arr[i] > arr[maxIndex]) {
              maxIndex = i;
            }
          }
          switch (maxIndex) {
            case 1:
              increaseCounters(0);
              break;
            case 2:
              increaseCounters(1);
              break;
            case 3:
              increaseCounters(2);
              break;
          }
        }
        break;
      case 1:
        increaseCounters(0);
        break;
      case 2:
        increaseCounters(1);
        break;
      case 3:
        increaseCounters(2);
        break;
    }
  }
}

function increaseCounters(emotion) {
  switch (emotion) {
    case 0: //happy
      happyCounter++;
      sadCounter = 0;
      surprisedCounter = 0;
      break;
    case 1: //sad
      happyCounter = 0;
      sadCounter++;
      surprisedCounter = 0;
      break;
    case 2: //surprised
      happyCounter = 0;
      sadCounter = 0;
      surprisedCounter++;
      break;
  }
}

function resetCounters(){
  happyCounter = 0;
  sadCounter = 0;
  surprisedCounter = 0;
}

//API FUNCTIONS
function faceReady() {
  faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  detections = result;
  clear();
  whatExpression(detections);
  faceapi.detect(gotFaces); //Loop
}
