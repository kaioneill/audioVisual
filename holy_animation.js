

window.onload = function() {

  Vue.component('knob', {
    template: `<div class="knob">
              <div class="knob-handle"></div>
              </div>`
  })

  Vue.component('pad', {
    template: '<div class="pad"></div>'
  })

  var app = new Vue({
    el: '#app',
    data: {
      mainName: 'Sounder',
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
      ]
    }
  })







  const AudioContext = window.AudioContext || window.webkitAudioContext;

  const audioCtx = new AudioContext();




  var pressedKeys = [];
  keyAction(pressedKeys, audioCtx);

  var pads = document.querySelectorAll('.pad');

  for (let p of pads) {
    padAction(p, audioCtx);
  }

  var knobs = document.querySelectorAll('.knob');
  for (let k of knobs) {
    knobAction(k);
  }



}


keyAction = function(pressedKeys, audioCtx) {

  var keyMap = {
    'a': 'C4',
    's': 'D4',
    'd': 'E4',
    'f': 'F4',
    'g': 'G4',
    'h': 'A4'
  }



  var holdFlag = {};
  var oscs = {};
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
          oscs[pressed].frequency.value = parseFloat(p.getAttribute('freq'));
          oscs[pressed].connect(audioCtx.destination);
          oscs[pressed].start(0);
          TweenLite.to(p, .1, {height: '60px'});
          holdFlag[pressed] = false;
        }
        document.onkeyup = (event) => {
          if(keyMap.hasOwnProperty(event.key)) {
            p = app.querySelector('#pad-' + keyMap[event.key]);
            oscs[event.key].stop(0);
            oscs[event.key] = null;
            TweenLite.to(p, .2, {height: '50px'});
            holdFlag[event.key] = true;
            pressedKeys.splice(pressedKeys.indexOf(event.key));
          }
        }
      }
    });
  }
}



padAction = function(p, audioCtx) {
  var o;
  p.onmousedown = (e) => {
    e.preventDefault();
    var o = audioCtx.createOscillator();
    o.frequency.value = parseFloat(p.getAttribute('freq'));
    o.connect(audioCtx.destination);
    o.start(0);
    TweenLite.to(p, .1, {height: '60px'});
    window.onmouseup = () => {
      o.stop(0);
      TweenLite.to(p, .2, {height: '50px'});
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
          TweenLite.to(k, .1, {rotation: "+=" + ((e.pageY-oldY)).toString()});
        }, 100);
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
