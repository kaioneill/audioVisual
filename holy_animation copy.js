var globalVolume = .5;
var gainNode;
var delayNode = [];
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContext();

window.onload = function() {

  Vue.component('knob', {
    template: `<div class="knob">
              <div class="knob-handle" ></div>
              </div>`
  })

  Vue.component('pad', {
    template: '<div class="pad"></div>'
  })

  var app = new Vue({
    el: '#app',
    data: {
      mainName: 'sound_mkr',
      knobs: [
        {id: 0, name: 'volume'},
        {id: 1, name: 'filter'},
      ],
      pads: [
        {id: 0, name: 'C4', freq: '261.63'},
        {id: 1, name: 'D4', freq: '293.66'},
        {id: 2, name: 'E4', freq: '329.63'},
        {id: 3, name: 'F4', freq: '349.23'},
        {id: 4, name: 'G4', freq: '392.00'},
        {id: 5, name: 'A4', freq: '440.00'},
        {id: 6, name: 'B4', freq: '493.88'},
        {id: 7, name: 'C5', freq: '523.25'},
      ]
    }
  })









  gainNode = audioCtx.createGain();



  for(var i=0;i<4;i++) {
    delayNode.push(audioCtx.createDelay());
    delayNode[i].delayTime.setValueAtTime(parseFloat(.3*i), audioCtx.currentTime);
    delayNode[i].connect(audioCtx.destination);
  }


  for(var i=0;i<delayNode.length;i++) {
    gainNode.gain.setValueAtTime((1-((i*2)/10))-i/10, audioCtx.currentTime);
    gainNode.connect(delayNode[i]);
  }
  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
  gainNode.connect(audioCtx.destination);

  var sendTo = gainNode;



  var pressedKeys = [];
  keyAction(pressedKeys, sendTo, audioCtx);

  var pads = document.querySelectorAll('.pad');

  for (let p of pads) {
    padAction(p, sendTo, audioCtx);
  }

  var knobs = document.querySelectorAll('.knob');
  for (let k of knobs) {
    knobAction(k);
  }



}


keyAction = function(pressedKeys, sendTo, audioCtx) {

  var keyMap = {
    'a': 'C4',
    's': 'D4',
    'd': 'E4',
    'f': 'F4',
    'g': 'G4',
    'h': 'A4',
    'j': 'B4',
    'k': 'C5',
  }



  var holdFlag = {};
  var oscs = {};
  var gains = {};
  document.onkeydown = (e) => {


    if(!keyMap.hasOwnProperty(e.key)) return;
    e.preventDefault();
    if(pressedKeys.indexOf(e.key) != -1) return;
    pressedKeys.push(e.key);
    holdFlag[e.key] = true;
    // console.log(pressedKeys);

    pressedKeys.forEach(function(pressed) {
      // console.log(pressed);

      p = app.querySelector('#pad-' + keyMap[pressed]);

      if(holdFlag[pressed]) {
        if(!oscs[pressed]) {
          oscs[pressed] = audioCtx.createOscillator();
          oscs[pressed].type = 'sine';
          oscs[pressed].detune.value = 12;
          gains[pressed] = audioCtx.createGain();
          oscs[pressed].frequency.value = parseFloat(p.getAttribute('freq'));
          oscs[pressed].connect(gains[pressed]);
          gains[pressed].connect(sendTo);
          oscs[pressed].start(0);
          TweenLite.to(p, .1, {height: '60px', backgroundColor: '#9900cc'});
          holdFlag[pressed] = false;
        }
        document.onkeyup = (event) => {
          if(keyMap.hasOwnProperty(event.key)) {
            p = app.querySelector('#pad-' + keyMap[event.key]);
            gains[event.key].gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
            oscs[event.key].stop(audioCtx.currentTime + .1);
            oscs[event.key] = null;
            TweenLite.to(p, .2, {height: '50px', backgroundColor: '#cc0066'});
            holdFlag[event.key] = true;
            pressedKeys.splice(pressedKeys.indexOf(event.key));
          }
        }
      }
    });
  }
}



padAction = function(p, sendTo, audioCtx) {
  var o;
  p.onmousedown = (e) => {
    e.preventDefault();
    var o = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    o.frequency.value = parseFloat(p.getAttribute('freq'));
    o.connect(g);
    g.connect(sendTo);
    o.start(0);
    TweenLite.to(p, .1, {height: '60px', backgroundColor: '#9900cc'});
    window.onmouseup = () => {
      g.gain.setTargetAtTime(0, audioCtx.currentTime, 0.015);
      o.stop(audioCtx.currentTime + .1);
      TweenLite.to(p, .2, {height: '50px', backgroundColor: '#cc0066'});
    }
    // p.mouseleave = () => {
    //   o.stop(0);
    //   holdFlag = false;
    // }
  }
}

knobAction = function(k) {
  var holdFlag = false;
  k.onmousedown = (e) => {
    var oldY;
    e.preventDefault();
    holdFlag = true;
    document.onmousemove = (e) => {
      if(holdFlag) {
        oldY = e.pageY;


        setTimeout( function() {
          if(k.id == 'volume') globalVolume += (e.pageY-oldY)/400;
          TweenLite.to(k, .1, {rotation: "+=" + ((e.pageY-oldY)).toString()});
        }, 100);

        if(k.id == 'volume') {
          gainNode.gain.setValueAtTime(globalVolume, audioCtx.currentTime);
          console.log(globalVolume);
        }
      }
    }
    window.onmouseup = () => {
      holdFlag = false;
    }
  }
}

resetColors = function() {
  var pads = document.querySelectorAll('.pad');
  for (let p of pads) {
    p.style.backgroundColor = Math.floor(Math.random()*16777215).toString(16);
  }

}
