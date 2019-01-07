<template lang="pug">
  #app
    .main-panel.col-center
      .main-name.row
        #main-name {{this.mainName}}
      .col-center
        .row
          .col-sm-2.margin
            oscillator(ref="oscillator" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
            arpeggiator(ref="arpeggiator" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
          .pads.col-sm-3.margin
            envelope(ref="envelope" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
  


</template>

<script>

import { EventBus } from './event-bus.js';
import Oscillator from './components/Oscillator.vue';
import Envelope from './components/Envelope.vue';
import Arpeggiator from './components/Arpeggiator.vue';

export default {
  name: 'app',
  components: {
    "oscillator": Oscillator,
    "envelope": Envelope,
    "arpeggiator": Arpeggiator,
  },
  data() {
    return {
      mainName: 'the_noise',
      contentLoaded: false,
      globalVolume: 0.05,
      gainNode: null,
      audioCtx: null,
      midiAccess: null,
      pressedKeys: {},




      keyMap: {
        'a': 'C4',
        'w': 'C#4',
        's': 'D4',
        'e': 'D#4',
        'd': 'E4',
        'f': 'F4',
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
  }
}
</script>

<style>



#app {
  min-width: 100%;
  min-height: 100%;
}



.main-name {
  /* padding: 0px 10px 0px 0px; */
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-style: italic;
  font-size: 48px;
}

.main-panel {
  width: 1000px;
  position: relative;
}

.margin {
  margin: 10px;
}

.col-center {
  float: none;
  margin: 0 auto;
}



</style>
