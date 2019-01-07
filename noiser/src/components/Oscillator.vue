<template lang="pug">

  #osc

    .row.center
      .col-sm-3
        h5 osc1
      .col-sm
        input.counter(type="number" step="1" v-model="oscPitchShift" @input="pitchChange()" data-toggle="tooltip" data-placement="top" title="osc pitch")
        input.counter(type="number" step="1" v-model="oscDetune" @input="detuneChange()" data-toggle="tooltip" data-placement="top" title="osc detune")
    .row
      .col-sm
        vue-slider.osc-vol(v-model="oscVol" @input="volChange()" v-bind="this.options")




    .row
      .col-sm
        input(type="radio" name="wave-shape1" value="sine" id="sine1" @click="waveChange('sine')" checked="true")
        label(for="sine1")
          h4 sine
        input(type="radio" name="wave-shape1" value="square" id="square1" @click="waveChange('square')")
        label(for="square1")
          h4 square
        input(type="radio" name="wave-shape1" value="saw" id="saw1" @click="waveChange('sawtooth')")
        label(for="saw1")
          h4 saw
        input(type="radio" name="wave-shape1" value="randomWave" id="randomWave1" @click="waveChange('randomWave')")
        label(for="randomWave1")
          h4 random

</template>

<script>

import { EventBus } from '../event-bus.js';
import vueSlider from 'vue-slider-component';
import Envelope from './Envelope.vue';

export default {
  name: 'oscillator',
  components: {
    vueSlider
  },
  props: [
    "audioCtx"
  ],
  data() {
    return {
      
      color: [204,255,255],
      
      gains: {},
      oscs: {},
      oscVol: 0.50,
      oscPitchShift: 0,
      oscDetune: 0,
      oscType: 'sine',
      randomWave: false,
      randomWaveShape: null,
      gainNode: null,
      pressedNotes: {},
      options: {
        tooltip: "hover",
        min: 0,
        max: 1.0,
        interval: 0.01,
        tooltipStyle: {
          "backgroundColor": "#ffbf00",
          "borderColor": "#ffbf00",
          "color": "#000",
          "fontFamily": "'Poppins', sans-serif",
          "fontWeight": "100",
          "fontStyle": "italic",
          "fontSize": "14px",
        },
        processStyle: {
          "backgroundColor": "#ffbf00",
        }
      },
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
    }
  },
  methods: {
    startOsc (note) {
      var self = this
      
      

      if(self.pressedNotes[note] == null) {
        
        
        self.color[0] = Math.abs(parseInt(Math.sin(self.noteFreqs[note]) * 255))
        self.color[1] = Math.abs(parseInt(Math.cos(self.noteFreqs[note]) * 255))
        self.color[2] = Math.abs(parseInt(Math.tan(self.noteFreqs[note]) * 255))
        
        
        self.pressedNotes[note] = self.noteFreqs[note]

        self.oscs[note] = self.audioCtx.createOscillator()
        self.gains[note] = self.audioCtx.createGain()

        self.oscs[note].type = self.oscType
        if(self.randomWave == true) {
          self.oscs[note].setPeriodicWave(self.randomWaveShape)
        }

        self.oscs[note].frequency.value = self.noteFreqs[note]
        self.oscs[note].detune.value = (100 * self.oscPitchShift) + self.oscDetune

        self.oscs[note].connect(self.gains[note])
        self.gains[note].gain.value = self.oscVol
        self.oscs[note].start(0)
        
        EventBus.$emit('env-start', {'note': note, 'osc': self.gains[note]})
      }

    },
    stopOsc (note) {
      var self = this
      EventBus.$emit('env-stop', {'note': note, 'osc': self.oscs[note]})
      
      self.color = [204,255,255]
      
      
      delete self.pressedNotes[note]
      self.oscs[note].stop(self.audioCtx.currentTime + 2.1)
    },
    volChange() {
      
      Object.keys(this.gains).forEach(v => this.gains[v].gain.linearRampToValueAtTime(this.oscVol, this.audioCtx.currentTime + .01))
      
      // this.gainNode.gain.linearRampToValueAtTime(parseFloat(this.oscVol), this.audioCtx.currentTime + .01)
    },
    pitchChange() {
    },
    detuneChange() {
      
    },
    waveChange(waveShape) {
      if(waveShape == "randomWave") {
        var waveLength = parseInt(Math.random() * 15)
        var real = new Array(waveLength).fill(0).map(function(n) {
          return Math.random() * 2.5
        });
        var imag = new Array(waveLength).fill(0).map(function(n) {
          return Math.random() * 1.6
        });
        this.randomWaveShape = this.audioCtx.createPeriodicWave(real, imag, {disableNormalization: true})
        this.randomWave = true
      } else {
        this.randomWave = false
        this.oscType = waveShape
      }
    }
  },
  mounted() {
    
    var self = this
    
    
    this.gainNode = this.audioCtx.createGain();
    // this.gainNode.connect(this.audioCtx.destination);
    this.gainNode.gain.value = 0;
    
    
    EventBus.$on('arp-start', note => {
      this.startOsc(note);
      console.log(self.color)
      // var newColor = 'rgb(' + parseInt(Math.cos(self.color) * 255) + ',' + parseInt(Math.sin(self.color) * 255) + ',' + parseInt(Math.tan(self.color) * 255) + ')'
      
      var newColor = 'rgb(' + self.color[0] + ',' + self.color[1] + ',' + self.color[2] + ')'
      // document.querySelector('#background').style.backgroundColor = newColor
      TweenLite.to(document.querySelector('#background'), .5, {backgroundColor: newColor});
    });
    EventBus.$on('arp-stop', note => {
      if(this.oscs[note] != null) {
        this.stopOsc(note);
        
        var newColor = 'rgb(' + self.color[0] + ',' + self.color[1] + ',' + self.color[2] + ')'
        
        TweenLite.to(document.querySelector('#background'), .5, {backgroundColor: newColor});
      }
    });
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


#osc {
  width: 170px;
}

.center {
  margin: auto;
}


.btn {
  background-color: #ffbf00;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
}

.tooltip {

  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 10px;

}

.counter {
  width: 40px;
  border-radius: 5px;
  border-style: solid;
  border-width: 1px;
  border-color: #cccccc;
  margin: 2px;

  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
  text-align: center;
}



h4 {
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
}

h5 {
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 18px;
}




input[type="radio"]{
    position:fixed;opacity:0
}


input[type="radio"]:checked+label{
  background-color: #ffbf00;
  border-radius: 5px;
  padding: 8px 10px 0 10px;
  margin:  0 10px 0 10px;
}
input[type="radio"]+label{

  padding: 8px 10px 0 10px;
  margin:  0 10px 0 10px;
}

.color-change {
  color: rgb(0,0,0);
}

</style>
