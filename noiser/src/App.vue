<template lang="pug">
  #app
    .row.main-panel
      .col-sm-4
        .row
          .col-sm-7
            .col-sm-11
              #main-name.title {{this.mainName}}
          .col-sm-4#midi-select
            select(id="midiSelect" @change="midiSourceChange")
              option(value="" disabled selected) no midi devices...
        .row
          .col-sm-5
            oscillator(ref="oscillator" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
            arpeggiator(ref="arpeggiator" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
            
          .col-sm-7
            envelope(ref="envelope" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
      .col-sm-2
        blobStuff(ref="bloblStuff" v-if="this.contentLoaded")
          //.row.margin
            audioBuffer(ref="audioBuffer" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
        
    
          
  


</template>

<script>

import { EventBus } from './event-bus.js';
import Oscillator from './components/Oscillator.vue';
import Envelope from './components/Envelope.vue';
import Arpeggiator from './components/Arpeggiator.vue';
import BlobStuff from './components/BlobStuff.vue'
// import AudioBuffer from './components/AudioBuffer.vue';


export default {
  name: 'app',
  components: {
    "oscillator": Oscillator,
    "envelope": Envelope,
    "arpeggiator": Arpeggiator,
    // "audioBuffer": AudioBuffer,
    "blobStuff": BlobStuff,
  },
  data() {
    return {
      mainName: 'the_noise',
      contentLoaded: false,
      globalVolume: 0.05,
      gainNode: null,
      audioCtx: null,
      webMidi: null,
      pressedKeys: {},




      keyMap: {
        'a': 'C4',
        'w': 'C#4',
        's': 'D4',
        'e': 'D#4',
        'd': 'E4',
        'f': 'F4',
        't': 'F#4',
        'g': 'G4',
        'y': 'G#4',
        'h': 'A4',
        'u': 'A#4',
        'j': 'B4',
        'k': 'C5',
      },

    }
  },
  methods: {
    init() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;


      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 1;
      this.contentLoaded = true;
    },
    keyPress(e) {
      var note
      
      if((note = this.keyMap[e.key]) != null) {
        // EventBus.$emit('key-press', note)
        EventBus.$emit('arp-start', note)
      }
    },
    keyRelease(e) {
      var note
      if((note = this.keyMap[e.key]) != null) {
        // EventBus.$emit('key-release', note)
        EventBus.$emit('arp-stop', note)
        
      }
    },
    midiSourceChange() {
      var midiSelect = document.getElementById("midi-select")

      var midiInputId = midiSelect.value

      var midiInput = this.webMidi.getInputById(midiInputId)
      this.midiInput = midiInput;

      // console.log(midiInputId)

    
    }
  },
  mounted() {
    var self = this;
    self.init();
    window.addEventListener('keydown', function(e) {
      self.keyPress(e);
    });
    window.addEventListener('keyup', function(e) {
      self.keyRelease(e);
    });
    
    
    var WebMidi = require('webmidi')
    self.webMidi = WebMidi
    self.webMidi.enable(function (err) {
      // console.log(WebMidi.inputs);
      // console.log(WebMidi.outputs);



      var options = WebMidi.inputs;

      for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt._midiInput.name;
        el.value = opt._midiInput.id;
        midiSelect.appendChild(el);
      }

      console.log(options)
      
      if(options.length > 0) {
        var midiInput = WebMidi.getInputById(options[0].id);
        document.querySelector("#midiSelect").selectedIndex = 1;

        midiInput.addListener('noteon', "all",
          function (e) {
            
            // console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
            // console.log(self.noteFreqs[e.note.name + e.note.octave]);
            EventBus.$emit('arp-start', e.note.name + e.note.octave)
          }
        );
        midiInput.addListener('noteoff', "all",
          function (e) {
            
            // console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
            // console.log(self.noteFreqs[e.note.name + e.note.octave]);
            EventBus.$emit('arp-stop', e.note.name + e.note.octave)
          }
        );
      }



    });
    
  }
}
</script>

<style>



#app {
  width: 100%;
  height: 100%;
  /* background-color: #ccffff; */
  text-align: center;
}



.title {
  /* padding: 0px 10px 0px 0px; */
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-style: italic;
  font-size: 48px;
}

.main-panel {
  left: 23%;
  /* right: auto; */
  /* width: 1000px; */
  position: relative;
}

.margin {
  margin-right: 0px;
}

.col-center {
  float: none;
  margin: 0 auto;
}

#midi-select{
  margin-left: 10px;
  margin-top: 35px;
  height: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
}





</style>
