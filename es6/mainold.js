document.addEventListener('DOMContentLoaded', function() {

  let selectedColor;
  let colors = ['green', 'red', 'yellow', 'blue'];



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


  // game object with state, seq, currentStep,

  function Game() {

    //game behaviour fields
    this.gameLength = 5;
    this.lightUpDuration = 400;
    this.stepDuration = 1000;

    //fields
    this.state = 'running';
    this.currentStep = 0;
    this.createSeq = function(length) {
      let arr = [];
      for (let i = 0; i < length; i++) {
        arr.push(colors[randomInt(4)]);
      }
      return arr;
    };
    this.seq = this.createSeq(this.gameLength);
    this.seqLength = 1;
    this.checkCorrectInput = function(){
      if(this.seq[this.currentStep] === this.userInputColorcolor){
        return true;
      } else {
        return false;
      }
    };
    this.correctStep = this.checkCorrectInput();
    this.userInputColor = '';

    // methods

    // reset game after win or button press
    this.reset = function() {
      this.seq = this.createSeq(this.gameLength);
      this.seqLength = 1;
      updateDisp(this.seqLength);
      this.state = 'paused';
    };

    // play sequence if game is currently running
    this.playSeq = function() {
      if (this.state === 'running') {
        let i = 0;
        let counter;
        counter = setInterval(function() {
          lightButton(this.seq[i], this.lightUpDuration);
          i++;
          if (i === this.seqLength) {
            clearInterval(counter);
          }
        }, this.stepDuration);
      }
    };

    this.play = function() {
      // this.playSeq();
      updateDisp(this.seqLength);
    };
  }

  // logic for buttons
  function lightButton(buttonID, duration) {
    let el;
    switch (buttonID) {
      case 'blue':
        el = document.getElementById('blue').classList;
        el.add('activated-blue');
        osc.frequency.value = 220;
        gain.gain.value = 1;
        setTimeout(function() {
          el.remove('activated-blue');
        }, duration);
        setTimeout(function() {
          gain.gain.value = 0;
        }, duration);
        break;
      case 'green':
        el = document.getElementById('green').classList;
        el.add('activated-green');
        osc.frequency.value = 440;
        gain.gain.value = 1;
        setTimeout(function() {
          el.remove('activated-green');
        }, duration);
        setTimeout(function() {
          gain.gain.value = 0;
        }, duration);
        break;
      case 'red':
        el = document.getElementById('red').classList;
        el.add('activated-red');
        osc.frequency.value = 300;
        gain.gain.value = 1;
        setTimeout(function() {
          el.remove('activated-red');
        }, duration);
        setTimeout(function() {
          gain.gain.value = 0;
        }, duration);
        break;
      default:
        el = document.getElementById('yellow').classList;
        el.add('activated-yellow');
        osc.frequency.value = 350;
        gain.gain.value = 1;
        setTimeout(function() {
          el.remove('activated-yellow');
        }, duration);
        setTimeout(function() {
          gain.gain.value = 0;
        }, duration);
        break;
    }
  }

  // handle user round
  function userInput(obj) {
    lightButton(selectedColor, 400);

    // handler in case of correct Input
    if (obj.seq[obj.currentStep] === selectedColor) {
      if (obj.currentStep + 1 < obj.seqLength) {
        obj.currentStep++;
      } else {
        obj.seqLength++;
        obj.currentStep = 0;
        setTimeout(obj.play, 1000);
      }

    // handler in case of wrong input
  } else if (obj.seq[obj.currentStep] !== selectedColor) {
      console.log('wrong input:' + obj.currentStep);

      //if in strict mode reset seqLength to 1
      obj.currentStep = 0;
      updateDisp('!!');

      //play sound to indicate wrong input + display
      setTimeout(obj.play, 1000);
    }

    // reset and notify!!! if game is won
    if (obj.seqLength > obj.seq.length) {
      obj.reset();
    }
  }

  function userInputWrapper(){
    selectedColor = this.id;
    console.log(this.id);
    userInput(game);
  }

  let game = new Game();
  console.log(game);

  /**************************************************/
  // SET UP EVENTS
  /**************************************************/

  let colorBtns = document.getElementsByClassName('leave');
  for (let i = 0; i < colorBtns.length; i++) {
    colorBtns[i].addEventListener('mousedown', userInputWrapper);
  }

  let resetBtn = document.getElementById('reset');
  resetBtn.addEventListener('click', game.reset);

  let playBtn = document.getElementById('play');
  playBtn.addEventListener('click', game.play);

});
