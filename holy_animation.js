

window.onload = function() {
  // var source;
  // source = audioStuff();

  Vue.component('knob', {
    template: '<div class="knob"></div>'
  })

  Vue.component('pad', {
    template: '<div class="pad"></div>'
  })

  var app = new Vue({
    el: '#app',
    data: {
      knobs: [
        {id: 0, name: 'volume'},
        {id: 1, name: 'filter'}
      ],
      pads: [
        {id: 0, name: '1'},
        {id: 1, name: '2'},
        {id: 0, name: '3'},
        {id: 0, name: '4'},
        {id: 0, name: '5'},
        {id: 0, name: '6'},
      ]
    }
  })




  animateStuff();






}


animateStuff = function() {

  var pads = app.querySelectorAll('.pad');



  for (let p of pads) {
    // p.style.backgroundColor = Math.floor(Math.random()*16777215).toString(16);
    p.onmousedown = () => {
      // source.start();

      TweenLite.to(p, .1, {height: '60px', width: '60px'});
    }
    p.onmouseup = () => {

      TweenLite.to(p, .2, {height: '50px', width: '50px'});
    }
  }


  // var sham = document.querySelector('#sham');
  // sham.onclick = () => {
  //   resetColors();
  // }



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

  var thing = document.querySelector('#thing');
  var myBuffer;

  AudioDrop({

  // the web audio context (required)
  context: audioCtx,

  // a DOM Element or an array of DOM Elements (required)
  elements: thing,

  // the callback to handle each file (required)
  drop: function(buffer, file) {
    myBuffer = buffer;
    console.log('Added the buffer ' + file.name + ' to the window.');
  },

  // DOM Events

  // called when there is a file being dragged into the dropzone
  dragEnter: function(e) { },

  // called repeatedly while a file is being dragged on the dropzone
  dragOver: function(e) { },

  // called when there is a file being dragged out of the dropzone
  dragLeave: function(e) { },
  })

  source = audioCtx.createBufferSource();
  source.buffer = myBuffer;
  source.connect(audioCtx.destination);
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return source;
}
