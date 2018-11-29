

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
        {id: 0, name: '1'},
        {id: 1, name: '2'},
        {id: 2, name: '3'},
        {id: 3, name: '4'},
        {id: 4, name: '5'},
        {id: 5, name: '6'},
      ]
    }
  })




  animateStuff();
  audioStuff();






}


animateStuff = function() {

  var pads = app.querySelectorAll('.pad');
  var knobs = app.querySelectorAll('.knob');
  var holdFlag = false;

  for (let p of pads) {
    p.onmousedown = (e) => {
      e.preventDefault();
      TweenLite.to(p, .1, {height: '60px'});
      window.onmouseup = () => {
        TweenLite.to(p, .2, {height: '50px'});
      }
    }
  }

  for (let k of knobs) {
    k.onmousedown = (e) => {
      e.preventDefault();
      holdFlag = true;
      document.onmousemove = (e) => {
        if(holdFlag) {
          TweenLite.to(k, .1, {rotation: -e.pageY});
        }
      }
      window.onmouseup = () => {
        TweenLite.to(k, .1, {rotation: '+=0'});
        holdFlag = false;
      }
    }
  }



}

resetColors = function() {
  var pads = document.querySelectorAll('.pad');
  for (let p of pads) {
    p.style.backgroundColor = Math.floor(Math.random()*16777215).toString(16);
  }

}


audioStuff = function() {

  const AudioContext = window.AudioContext || window.webkitAudioContext;

  const audioCtx = new AudioContext();

  var o = audioCtx.createOscillator();
  o.connect(audioCtx.destination);
  o.frequency.value = 261.63;

  var key = app.querySelector('#pad-1');


  key.onmousedown = (e) => {
    e.preventDefault();
    holdFlag = true;
    o.start(0);
    key.mouseleave = () => {
      o.stop(0);
      holdFlag = false;
    }
    key.onmouseup = () => {
      o.stop(0);
      holdFlag = false;
    }
  }



}
