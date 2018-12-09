
window.onload = function() {

  Vue.component('knob', {
    template: `<div class="knob">
              <div class="knob-handle" ></div>
              </div>`
  })

  Vue.component('pad', {
    template: '<div class="pad"></div>'
  })

  Vue.component('slider', {
    template: '<input type="range" min="0" max="100" value="50" class="slider">'
  })

  var app = new Vue({
    el: '#app',
    data: {
      mainName: 'sound_mkr',

      globalVolume: 0.5,
      gainNode: null,
      delayNode: [],
      audioCtx: null,

      keyMap: {
        'a': 'C4',
        's': 'D4',
        'd': 'Eb4',
        'f': 'F4',
        'g': 'G4',
        'h': 'Ab4',
        'j': 'Bb4',
        'k': 'C5',
      },
      pressedKeys: [],
      holdFlag: {},
      oscs: {},
      gains: {},
      filters: {},

      ampAttack: .5,
      ampRelease: .25,
      filterDecay: 10,
      filterFreq: 5000,


      knobs: [
        {id: 0, name: 'volume'},
        {id: 1, name: 'filter'},
      ],
      sliders: [
        {id: 0, name: 'volume'},
        {id: 1, name: 'filter'},
        {id: 2, name: 'attack'},
        {id: 2, name: 'release'},
      ],
      pads: [
        {id: 0, name: 'C4', freq: '261.63'},
        {id: 1, name: 'D4', freq: '293.66'},
        {id: 2, name: 'Eb4', freq: '311.13'},
        {id: 3, name: 'F4', freq: '349.23'},
        {id: 4, name: 'G4', freq: '392.00'},
        {id: 5, name: 'Ab4', freq: '415.30'},
        {id: 6, name: 'Bb4', freq: '466.16'},
        {id: 7, name: 'C5', freq: '523.25'},
      ]
    },
    methods: {

      padPress: function(p, sendTo, audioCtx) {


        var swapped = {};
        for(var key in app.keyMap){
          swapped[app.keyMap[key]] = key;
        }
        var keyEvent = {
          key: swapped[p.name]
        }



        app.keyPress(keyEvent, sendTo, audioCtx)
      },
      keyPress: function(e, sendTo, audioCtx) {

        let self = this





        if(!self.keyMap.hasOwnProperty(e.key)) return
        // e.preventDefault()
        if(self.pressedKeys.indexOf(e.key) != -1) return
        self.pressedKeys.push(e.key)
        self.holdFlag[e.key] = true
        // console.log(pressedKeys);

        self.pressedKeys.forEach(function(pressed) {
          // console.log(pressed);

          p = document.querySelector('#' + self.keyMap[pressed])

          if(self.holdFlag[pressed]) {
            if(!self.oscs[pressed]) {
              self.oscs[pressed] = []
              self.oscs[pressed].push(app.audioCtx.createOscillator())
              self.oscs[pressed][0].type = 'sawtooth'
              self.oscs[pressed][0].detune.value = 0
              self.oscs[pressed].push(app.audioCtx.createOscillator())
              self.oscs[pressed][1].type = 'sawtooth'
              self.oscs[pressed][1].detune.value = 15
              self.oscs[pressed][0].frequency.value = parseFloat(p.getAttribute('freq'))
              self.oscs[pressed][1].frequency.value = parseFloat(p.getAttribute('freq'))


              self.gains[pressed] = app.audioCtx.createGain()
              self.gains[pressed].gain.value = 0;
              self.gains[pressed].gain.linearRampToValueAtTime(.5, audioCtx.currentTime + app.ampAttack);

              self.filters[pressed] = app.audioCtx.createBiquadFilter()
              self.filters[pressed].frequency.value = app.filterFreq;
              self.filters[pressed].frequency.linearRampToValueAtTime(0, audioCtx.currentTime + app.filterDecay + app.ampAttack);



              self.oscs[pressed][0].connect(self.gains[pressed])
              self.oscs[pressed][1].connect(self.gains[pressed])
              self.gains[pressed].connect(self.filters[pressed])
              self.filters[pressed].connect(sendTo)
              self.oscs[pressed][0].start(0)
              self.oscs[pressed][1].start(0)

              TweenLite.to(p, .1, {height: '60px', backgroundColor: '#9900cc'})
              self.holdFlag[pressed] = false
            }
            document.onkeyup = (event) => {
              if(self.keyMap.hasOwnProperty(event.key)) {
                p = document.querySelector('#' + self.keyMap[event.key])
                self.gains[event.key].gain.linearRampToValueAtTime(0, audioCtx.currentTime + app.ampRelease + app.ampAttack);
                self.oscs[event.key][0].stop(app.audioCtx.currentTime + .51)
                self.oscs[event.key][1].stop(app.audioCtx.currentTime + .51)
                self.oscs[event.key] = null
                TweenLite.to(p, .2, {height: '50px', backgroundColor: '#cc0066'});
                self.holdFlag[event.key] = true
                self.pressedKeys.splice(self.pressedKeys.indexOf(event.key))
              }
            }
            document.onmouseup = (event) => {
              var swapped = {};
              for(var key in app.keyMap){
                swapped[app.keyMap[key]] = key;
              }
              var keyEvent = {
                key: swapped[event.target.id]
              }
              event.key = keyEvent.key
              if(self.keyMap.hasOwnProperty(event.key)) {
                p = document.querySelector('#' + self.keyMap[event.key])
                self.gains[event.key].gain.linearRampToValueAtTime(0, audioCtx.currentTime + app.ampRelease + app.ampAttack);
                self.oscs[event.key][0].stop(app.audioCtx.currentTime + .51)
                self.oscs[event.key][1].stop(app.audioCtx.currentTime + .51)
                self.oscs[event.key] = null
                TweenLite.to(p, .2, {height: '50px', backgroundColor: '#cc0066'});
                self.holdFlag[event.key] = true
                self.pressedKeys.splice(self.pressedKeys.indexOf(event.key))
              }
            }
          }
        });
      },
      sliderMove: function(slider) {

        sliderElement = document.querySelector('#' + slider.name)

        // var holdFlag = false;

        document.onmousemove = (e) => {

          if(slider.name == 'volume') {
            app.globalVolume = sliderElement.value/100
            app.gainNode.gain.linearRampToValueAtTime(app.globalVolume, .01);

          }
          if(slider.name == 'filter') {
            app.filterFreq = sliderElement.value*100
            Object.keys(app.filters).forEach(v => app.filters[v].frequency.linearRampToValueAtTime(app.filterFreq, .01));

          }
          if(slider.name == 'attack') {
            app.ampAttack = sliderElement.value/50
          }
          if(slider.name == 'release') {
            app.ampRelease = sliderElement.value/25
          }

        }


      }
    },
    mounted() {
      let self = this;

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      const audioCtx = new AudioContext();
      self.audioCtx = audioCtx;

      var gainNode = audioCtx.createGain();

      self.gainNode = gainNode;
      self.gainNode.gain.setValueAtTime(.5, self.audioCtx.currentTime);
      self.gainNode.connect(self.audioCtx.destination);

      var delayGainNode = audioCtx.createGain();


      delayGainNode.gain.setValueAtTime(.1, self.audioCtx.currentTime);
      delayGainNode.connect(self.audioCtx.destination);

      var delayNode = [];
      for(var i=0;i<0;i++) {
        delayNode.push(self.audioCtx.createDelay());
        delayNode[i].delayTime.setValueAtTime(parseFloat(.3*i), self.audioCtx.currentTime);
        self.gainNode.connect(delayNode[i])
      }


      for(var i=0;i<delayNode.length;i++) {
        // self.gainNode.gain.setValueAtTime((1-((i*2)/10))-i/10, self.audioCtx.currentTime);
        delayNode[i].connect(delayGainNode)
      }

      delayGainNode.gain.linearRampToValueAtTime(.2, 2)

      var sendTo = self.gainNode;

      window.addEventListener('keydown', function(e) {
        self.keyPress(e, self.gainNode, self.audioCtx); // declared in your component methods

        // var filterAmount = -5000;
        // setInterval(function(){
        //   Object.keys(self.filters).forEach(v => self.filters[v].frequency.linearRampToValueAtTime(self.filterFreq + filterAmount, self.audioCtx.currentTime + .4));
        //   filterAmount = -filterAmount;
        // }, 400);
      });



    }
  })
}
