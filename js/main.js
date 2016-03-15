'use strict';

document.addEventListener('DOMContentLoaded', function () {

  var selectedColor = '';
  var seq = [];
  var seqLength = 1;
  var lightUpDuration = 400;
  var stepDuration = 1000;
  var state = 'paused';
  var strict = false;
  var currentStep = 0;
  var colors = ['green', 'red', 'yellow', 'blue'];
  var GAME_LENGTH = 2;
  var FREQ_GREEN = 440;
  var FREQ_RED = 349.23;
  var FREQ_BLUE = 220;
  var FREQ_YELLOW = 329.63;

  // Audio Set-Up - needs fix for iOs
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 220;
  var gain = audioCtx.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();

  // helper funcs
  function randomInt(num) {
    var rand = Math.floor(Math.random() * num);
    return rand;
  }

  function updateDisp(text) {
    var el = document.getElementById('disp-text');
    el.textContent = text;
  }

  function createSeq(length) {
    var arr = [];
    for (var i = 0; i < length; i++) {
      arr.push(colors[randomInt(4)]);
    }
    return arr;
  }

  // game play Functions
  function reset() {
    seq = createSeq(GAME_LENGTH);
    seqLength = 1;
    currentStep = 0;
    state = 'paused';
    updateDisp(seqLength);
  }

  function playSeq() {
    if (state === 'running') {
      (function () {
        var i = 0;
        var counter = void 0;
        counter = setInterval(function () {
          fireButton(seq[i], lightUpDuration);
          i++;
          if (i === seqLength) {
            clearInterval(counter);
          }
        }, stepDuration);
      })();
    }
  }

  function play() {

    // reset and notify!!! if game is won
    if (seqLength > GAME_LENGTH) {
      updateDisp(':)');
      setTimeout(reset, 1000);

      // default behaviour
    } else {
        playSeq();
        updateDisp(seqLength);
      }
  }

  function startGame() {
    if (state !== 'running') {
      reset();
      state = 'running';
      play();
    }
  }

  function handle(id, dur) {
    var el = void 0;
    el = document.getElementById(id).classList;
    el.add('activated-' + id);
    gain.gain.value = 1;
    setTimeout(function () {
      el.remove('activated-' + id);
    }, dur);
    setTimeout(function () {
      gain.gain.value = 0;
    }, dur);
  }

  function fireButton(buttonID, duration) {
    var id = buttonID;
    var dur = duration;
    switch (buttonID) {
      case 'blue':
        osc.frequency.value = FREQ_BLUE;
        handle(id, dur);
        break;
      case 'green':
        osc.frequency.value = FREQ_GREEN;
        handle(id, dur);
        break;
      case 'red':
        osc.frequency.value = FREQ_RED;
        handle(id, dur);
        break;
      default:
        osc.frequency.value = FREQ_YELLOW;
        handle(id, dur);
        break;
    }
  }

  function userInput() {
    selectedColor = this.id;
    fireButton(selectedColor, lightUpDuration);

    // handler in case of correct Input
    if (seq[currentStep] === selectedColor && state === 'running') {
      if (currentStep + 1 < seqLength) {
        currentStep++;
      } else {
        seqLength++;
        currentStep = 0;
        setTimeout(play, 1000);
      }

      // handler in case of wrong input
    } else if (seq[currentStep] !== selectedColor && state === 'running') {
        console.log('wrong input:' + currentStep);

        //if in strict mode reset seqLength to 1
        if (strict === true) {
          seqLength = 1;
        }
        currentStep = 0;
        updateDisp('!!');

        //play sound to indicate wrong input + display
        setTimeout(play, 1000);
      }
  }

  seq = createSeq(GAME_LENGTH);

  //
  var colorBtns = document.getElementsByClassName('leave');
  for (var i = 0; i < colorBtns.length; i++) {
    colorBtns[i].addEventListener('mousedown', userInput);
  }

  var resetBtn = document.getElementById('reset');
  resetBtn.addEventListener('click', reset);

  var playBtn = document.getElementById('play');
  playBtn.addEventListener('click', startGame);

  var strictBtn = document.getElementById('strict');
  strictBtn.addEventListener('click', function () {
    if (strict === false && state === 'paused') {
      strict = true;
      strictBtn.classList.add('activated-strict');
    } else if (strict === true && state === 'paused') {
      strict = false;
      strictBtn.classList.remove('activated-strict');
    }
  });
});