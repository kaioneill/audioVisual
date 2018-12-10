
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
      mainName: 'the_garden',

      midiInput: null,

      globalVolume: 0.5,
      gainNode: null,
      audioCtx: null,
      midiAccess: null,
      delayNodes: [],


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
      compressors: {},

      ampAttack: .1,
      ampRelease: .5,
      filterDecay: 1,
      filterFreq: 5000,
      filterAmount: 5000,
      osc0Pitch: 0,
      osc1Pitch: 0,
      detune: 0,
      osc0Shape: 'sine',
      osc1Shape: 'sine',
      Q: 10,
      delayTime: .25,


      knobs: [
        {id: 0, name: 'volume'},
        {id: 1, name: 'filter'},
      ],
      sliders: [
        {id: 0, name: 'volume'},
        {id: 1, name: 'filter'},
        {id: 2, name: 'attack'},
        {id: 3, name: 'release'},
        {id: 4, name: 'decay'},
        {id: 5, name: 'delay'},
        {id: 6, name: 'amount'},
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
      ],
      noteFreqs: {
         "C0":   16.35,
        "C#0":   17.32,
        "Db0":   17.32,
         "D0":   18.35,
        "D#0":   19.45,
        "Eb0":   19.45,
         "E0":   20.60,
         "F0":   21.83,
        "F#0":   23.12,
        "Gb0":   23.12,
         "G0":   24.50,
        "G#0":   25.96,
        "Ab0":   25.96,
         "A0":   27.50,
        "A#0":   29.14,
        "Bb0":   29.14,
         "B0":   30.87,
         "C1":   32.70,
        "C#1":   34.65,
        "Db1":   34.65,
         "D1":   36.71,
        "D#1":   38.89,
        "Eb1":   38.89,
         "E1":   41.20,
         "F1":   43.65,
        "F#1":   46.25,
        "Gb1":   46.25,
         "G1":   49.00,
        "G#1":   51.91,
        "Ab1":   51.91,
         "A1":   55.00,
        "A#1":   58.27,
        "Bb1":   58.27,
         "B1":   61.74,
         "C2":   65.41,
        "C#2":   69.30,
        "Db2":   69.30,
         "D2":   73.42,
        "D#2":   77.78,
        "Eb2":   77.78,
         "E2":   82.41,
         "F2":   87.31,
        "F#2":   92.50,
        "Gb2":   92.50,
         "G2":   98.00,
        "G#2":  103.83,
        "Ab2":  103.83,
         "A2":  110.00,
        "A#2":  116.54,
        "Bb2":  116.54,
         "B2":  123.47,
         "C3":  130.81,
        "C#3":  138.59,
        "Db3":  138.59,
         "D3":  146.83,
        "D#3":  155.56,
        "Eb3":  155.56,
         "E3":  164.81,
         "F3":  174.61,
        "F#3":  185.00,
        "Gb3":  185.00,
         "G3":  196.00,
        "G#3":  207.65,
        "Ab3":  207.65,
         "A3":  220.00,
        "A#3":  233.08,
        "Bb3":  233.08,
         "B3":  246.94,
         "C4":  261.63,
        "C#4":  277.18,
        "Db4":  277.18,
         "D4":  293.66,
        "D#4":  311.13,
        "Eb4":  311.13,
         "E4":  329.63,
         "F4":  349.23,
        "F#4":  369.99,
        "Gb4":  369.99,
         "G4":  392.00,
        "G#4":  415.30,
        "Ab4":  415.30,
         "A4":  440.00,
        "A#4":  466.16,
        "Bb4":  466.16,
         "B4":  493.88,
         "C5":  523.25,
        "C#5":  554.37,
        "Db5":  554.37,
         "D5":  587.33,
        "D#5":  622.25,
        "Eb5":  622.25,
         "E5":  659.26,
         "F5":  698.46,
        "F#5":  739.99,
        "Gb5":  739.99,
         "G5":  783.99,
        "G#5":  830.61,
        "Ab5":  830.61,
         "A5":  880.00,
        "A#5":  932.33,
        "Bb5":  932.33,
         "B5":  987.77,
         "C6": 1046.50,
        "C#6": 1108.73,
        "Db6": 1108.73,
         "D6": 1174.66,
        "D#6": 1244.51,
        "Eb6": 1244.51,
         "E6": 1318.51,
         "F6": 1396.91,
        "F#6": 1479.98,
        "Gb6": 1479.98,
         "G6": 1567.98,
        "G#6": 1661.22,
        "Ab6": 1661.22,
         "A6": 1760.00,
        "A#6": 1864.66,
        "Bb6": 1864.66,
         "B6": 1975.53,
         "C7": 2093.00,
        "C#7": 2217.46,
        "Db7": 2217.46,
         "D7": 2349.32,
        "D#7": 2489.02,
        "Eb7": 2489.02,
         "E7": 2637.02,
         "F7": 2793.83,
        "F#7": 2959.96,
        "Gb7": 2959.96,
         "G7": 3135.96,
        "G#7": 3322.44,
        "Ab7": 3322.44,
         "A7": 3520.00,
        "A#7": 3729.31,
        "Bb7": 3729.31,
         "B7": 3951.07,
         "C8": 4186.01,
        "C#8": 4434.92,
        "Db8": 4434.92,
         "D8": 4698.64,
        "D#8": 4978.03,
        "Eb8": 4978.03
      }
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



        app.keyPress(keyEvent, sendTo, audioCtx, false)
      },
      keyPress: function(e, sendTo, audioCtx, midi) {

        let self = this



        if(!midi) {

          if(!self.keyMap.hasOwnProperty(e.key)) return
          // e.preventDefault()
          if(self.pressedKeys.indexOf(e.key) != -1) return
          self.pressedKeys.push(e.key)
          self.holdFlag[e.key] = true
          // console.log(pressedKeys);

        } else {

          e = {key: app.noteFreqs[e.note.name + e.note.octave]}

          self.pressedKeys.push(e.key)
          self.holdFlag[e.key] = true

        }

        self.pressedKeys.forEach(function(pressed) {
          // console.log(pressed);

          if(!midi) {
            p = document.querySelector('#' + self.keyMap[pressed])
          }

          if(self.holdFlag[pressed]) {
            if(!self.oscs[pressed]) {
              self.oscs[pressed] = []
              self.oscs[pressed][0] = (app.audioCtx.createOscillator())
              self.oscs[pressed][0].type = app.osc0Shape
              self.oscs[pressed][0].detune.value = 100 * app.osc0Pitch
              self.oscs[pressed][1] = (app.audioCtx.createOscillator())
              self.oscs[pressed][1].type = app.osc1Shape
              self.oscs[pressed][1].detune.value = 100 * app.osc1Pitch + app.detune

              if(!midi) {
                self.oscs[pressed][0].frequency.value = parseFloat(p.getAttribute('freq'))
                self.oscs[pressed][1].frequency.value = parseFloat(p.getAttribute('freq'))
              } else {
                self.oscs[pressed][0].frequency.value = e.key
                self.oscs[pressed][1].frequency.value = e.key
              }


              self.gains[pressed] = app.audioCtx.createGain()
              self.gains[pressed].gain.value = 0;
              self.gains[pressed].gain.linearRampToValueAtTime(.5, audioCtx.currentTime + app.ampAttack);

              self.filters[pressed] = app.audioCtx.createBiquadFilter()
              self.filters[pressed].frequency.value = app.filterFreq
              self.filters[pressed].Q.value = app.Q
              self.filters[pressed].frequency.linearRampToValueAtTime(app.filterAmount, audioCtx.currentTime + app.filterDecay + app.ampAttack);


              self.compressors[pressed] = audioCtx.createDynamicsCompressor();
              self.compressors[pressed].threshold.setValueAtTime(-50, audioCtx.currentTime);
              self.compressors[pressed].knee.setValueAtTime(40, audioCtx.currentTime);
              self.compressors[pressed].ratio.setValueAtTime(12, audioCtx.currentTime);
              self.compressors[pressed].attack.setValueAtTime(0, audioCtx.currentTime);
              self.compressors[pressed].release.setValueAtTime(0.25, audioCtx.currentTime);


              // var real = [1.4, 0, 1, 0, 3];
              // var imag = [1.4, 5, -11, .2, 3];
              //
              //
              // var wave = audioCtx.createPeriodicWave(real, imag, {disableNormalization: true});
              //
              // self.oscs[pressed][0].setPeriodicWave(wave);
              // self.oscs[pressed][1].setPeriodicWave(wave);


              self.oscs[pressed][0].connect(self.gains[pressed])
              self.oscs[pressed][1].connect(self.gains[pressed])
              self.gains[pressed].connect(self.filters[pressed])
              self.filters[pressed].connect(self.compressors[pressed])
              self.compressors[pressed].connect(sendTo)
              self.oscs[pressed][0].start(0)
              self.oscs[pressed][1].start(0)

              if(!midi) {
                TweenLite.to(p, .1, {height: '60px', backgroundColor: '#9900cc'})
              }

              self.holdFlag[pressed] = false
            }
            document.onkeyup = (event) => {
              if(self.keyMap.hasOwnProperty(event.key)) {
                p = document.querySelector('#' + self.keyMap[event.key])
                self.gains[event.key].gain.linearRampToValueAtTime(0, audioCtx.currentTime + app.ampRelease)
                self.oscs[event.key][0].stop(app.audioCtx.currentTime + 5)
                self.oscs[event.key][1].stop(app.audioCtx.currentTime + 5)
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
                self.gains[event.key].gain.linearRampToValueAtTime(0, audioCtx.currentTime + app.ampRelease);
                self.oscs[event.key][0].stop(app.audioCtx.currentTime + 5)
                self.oscs[event.key][1].stop(app.audioCtx.currentTime + 5)
                self.oscs[event.key] = null
                TweenLite.to(p, .2, {height: '50px', backgroundColor: '#cc0066'});
                self.holdFlag[event.key] = true
                self.pressedKeys.splice(self.pressedKeys.indexOf(event.key))
              }
            }
            self.midiInput.addListener('noteoff', "all",
              function (event) {
                event = {key: app.noteFreqs[event.note.name + event.note.octave]}

                console.log(event.key)
                self.gains[event.key].gain.linearRampToValueAtTime(0, audioCtx.currentTime + app.ampRelease)
                console.log(self.oscs[event.key])
                if(self.oscs[event.key] != null) {
                  self.oscs[event.key][0].stop(app.audioCtx.currentTime + 5)
                  self.oscs[event.key][1].stop(app.audioCtx.currentTime + 5)
                }
                self.oscs[event.key] = null

                if(!midi) {
                  TweenLite.to(p, .2, {height: '50px', backgroundColor: '#cc0066'});
                }
                TweenLite.to(document.querySelector('.main-name'), .2, {color: '#000'});


                self.holdFlag[event.key] = true
                self.pressedKeys.splice(self.pressedKeys.indexOf(event.key))

              }
            );
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
            // Object.keys(app.filters).forEach(v => app.filters[v].frequency.linearRampToValueAtTime(app.filterFreq, .01))

          }
          if(slider.name == 'amount') {
            app.filterAmount = sliderElement.value*100
            Object.keys(app.filters).forEach(v => app.filters[v].frequency.linearRampToValueAtTime(app.filterAmount, .01))
            // Object.keys(app.filters).forEach(v => app.filters[v].frequency.linearRampToValueAtTime(app.filterFreq, .01))

          }
          if(slider.name == 'attack') {
            app.ampAttack = sliderElement.value/50
          }
          if(slider.name == 'release') {
            app.ampRelease = sliderElement.value/200
          }
          if(slider.name == 'decay') {
            app.filterDecay = sliderElement.value/50
          }
          if(slider.name == 'delay') {
            app.delayTime = sliderElement.value/400
            Object.keys(app.delayNodes).forEach(v => app.delayNodes[v].delayTime.linearRampToValueAtTime(app.delayTime*v, .01))
          }

        }


      },
      waveChange: function(waveShape, oscNum) {
        if(oscNum == 0) {
          app.osc0Shape = waveShape
        }
        if(oscNum == 1) {
          app.osc1Shape = waveShape
        }
      },
      octaveChange: function(direction) {
        if(direction == 'up') {
          app.osc0Pitch += 12
          app.osc1Pitch += 12
        }
        if(direction == 'down') {
          app.osc0Pitch -= 12
          app.osc1Pitch -= 12
        }
      },
      pitchChange: function(oscNum) {
        if(oscNum == 0) {
          app.osc0Pitch = parseInt(document.querySelector("#osc0Pitch").value)
        }
        if(oscNum == 1) {
          app.osc1Pitch = parseInt(document.querySelector("#osc1Pitch").value)
        }
        if(oscNum == -1) {
          app.detune = parseInt(document.querySelector("#osc1Detune").value)
        }

      }
    },
    mounted() {
      $('[data-toggle="tooltip"]').tooltip();
      let self = this;

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      const audioCtx = new AudioContext();
      self.audioCtx = audioCtx;





      var gainNode = audioCtx.createGain();
      var compressorNode = audioCtx.createDynamicsCompressor();

      self.gainNode = gainNode;
      self.gainNode.gain.setValueAtTime(.5, self.audioCtx.currentTime);
      self.gainNode.connect(compressorNode);



      compressorNode.threshold.setValueAtTime(-20, self.audioCtx.currentTime);
      compressorNode.knee.setValueAtTime(40, self.audioCtx.currentTime);
      compressorNode.ratio.setValueAtTime(4, self.audioCtx.currentTime);
      compressorNode.attack.setValueAtTime(0, self.audioCtx.currentTime);
      compressorNode.release.setValueAtTime(0.25, self.audioCtx.currentTime);
      compressorNode.connect(self.audioCtx.destination)


      var delayGainNode = audioCtx.createGain();


      delayGainNode.gain.setValueAtTime(.1, self.audioCtx.currentTime);
      delayGainNode.connect(self.audioCtx.destination);

      var delayNodes = [];
      self.delayNodes = delayNodes;
      for(var i=0;i<4;i++) {
        self.delayNodes.push(self.audioCtx.createDelay());
        self.delayNodes[i].delayTime.setValueAtTime(parseFloat(self.delayTime*i), self.audioCtx.currentTime);
        compressorNode.connect(self.delayNodes[i])
      }


      for(var i=0;i<self.delayNodes.length;i++) {
        // self.gainNode.gain.setValueAtTime((1-((i*2)/10))-i/10, self.audioCtx.currentTime);
        self.delayNodes[i].connect(delayGainNode)
      }

      delayGainNode.gain.linearRampToValueAtTime(.2, 2)

      var sendTo = self.gainNode;

      window.addEventListener('keydown', function(e) {
        self.keyPress(e, self.gainNode, self.audioCtx, false); // declared in your component methods


        // console.log(self.oscs);

        // var filterAmount = 5000;
        // setInterval(function(){
        //   Object.keys(self.filters).forEach(v => self.filters[v].frequency.linearRampToValueAtTime(self.filterFreq, self.audioCtx.currentTime + .01));
        //   Object.keys(self.filters).forEach(v => self.filters[v].frequency.linearRampToValueAtTime(self.filterFreq - filterAmount, self.audioCtx.currentTime + .4));
        //
        //
        //   setTimeout(function(){
        //     Object.keys(self.filters).forEach(v => self.filters[v].frequency.linearRampToValueAtTime(self.filterFreq + filterAmount, self.audioCtx.currentTime + .4));
        //
        //   }, 420);
        //
        // }, 940);


      });

      WebMidi.enable(function (err) {
        // console.log(WebMidi.inputs);
        // console.log(WebMidi.outputs);


        var midiInput = WebMidi.getInputById("-1404796906");
        self.midiInput = midiInput;
        // console.log(midiInput);

        self.midiInput.addListener('noteon', "all",
          function (e) {
            // console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
            // console.log(self.noteFreqs[e.note.name + e.note.octave]);
            TweenLite.to(document.querySelector('.main-name'), .2, {color: '#ffff00'});
            self.keyPress(e, self.gainNode, self.audioCtx, true);
          }
        );


      });



    }
  })
}
