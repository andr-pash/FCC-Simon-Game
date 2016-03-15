document.addEventListener('DOMContentLoaded', function() {

  let selectedColor = '';
  let seq = [];
  let seqLength = 1;
  let lightUpDuration = 400;
  let stepDuration = 1000;
  let state = 'paused';
  let strict = false;
  let currentStep = 0;
  let colors = ['green', 'red', 'yellow', 'blue'];
  const GAME_LENGTH = 2;
  const FREQ_GREEN = 440;
  const FREQ_RED = 349.23;
  const FREQ_BLUE = 220;
  const FREQ_YELLOW = 329.63;

  // Audio Set-Up - needs fix for iOs
  let audioCtx = new(window.AudioContext || window.webkitAudioContext)();
  let osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 220;
  let gain = audioCtx.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();

  // helper funcs
  function randomInt(num) {
    let rand = Math.floor(Math.random() * num);
    return rand;
  }

  function updateDisp(text) {
    let el = document.getElementById('disp-text');
    el.textContent = text;
  }

  function createSeq(length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
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
      let i = 0;
      let counter;
      counter = setInterval(function() {
        fireButton(seq[i], lightUpDuration);
        i++;
        if (i === seqLength) {
          clearInterval(counter);
        }
      }, stepDuration);
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
    let el;
    el = document.getElementById(id).classList;
    el.add('activated-' + id);
    gain.gain.value = 1;
    setTimeout(function() {
      el.remove('activated-' + id);
    }, dur);
    setTimeout(function() {
      gain.gain.value = 0;
    }, dur);
  }

  function fireButton(buttonID, duration) {
    let id = buttonID;
    let dur = duration;
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
  let colorBtns = document.getElementsByClassName('leave');
  for (let i = 0; i < colorBtns.length; i++) {
    colorBtns[i].addEventListener('mousedown', userInput);
  }

  let resetBtn = document.getElementById('reset');
  resetBtn.addEventListener('click', reset);

  let playBtn = document.getElementById('play');
  playBtn.addEventListener('click', startGame);

  let strictBtn = document.getElementById('strict');
  strictBtn.addEventListener('click', function() {
    if (strict === false && state === 'paused') {
      strict = true;
      strictBtn.classList.add('activated-strict');
    } else if (strict === true && state === 'paused') {
      strict = false;
      strictBtn.classList.remove('activated-strict');
    }
  });









});
