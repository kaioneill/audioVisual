<template lang="pug">
  #app
    .main-panel
      .main-name.col-sm-7#main-name {{this.mainName}}
      oscillator(ref="oscillator" v-if="this.contentLoaded" :audioCtx="this.audioCtx")
  
</template>

<script>

import Oscillator from './components/Oscillator.vue'

export default {
  name: 'app',
  components: {
    "oscillator": Oscillator
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
        'd': 'Eb4',
        'f': 'F4',
        'g': 'G4',
        'y': 'G#4',
        'h': 'Ab4',
        'u': 'A#4',
        'j': 'Bb4',
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
      var note = this.keyMap[e.key]
      this.$refs.oscillator.startOsc(note)
    },
    keyRelease(e) {
      var note = this.keyMap[e.key]
      this.$refs.oscillator.stopOsc(note)
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
  padding: 0px 10px 0px 0px;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-style: italic;
  font-size: 48px;
}

.main-panel {

  margin: auto;
  width: 500px;
  position: relative;
}



</style>
