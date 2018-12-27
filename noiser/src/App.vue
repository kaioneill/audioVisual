<template lang="pug">
  #app
    synth-thing(v-if="this.contentLoaded" :audioCtx="this.audioCtx")
  
</template>

<script>

import SynthThing from './components/SynthThing.vue'

export default {
  name: 'app',
  components: {
    "synth-thing": SynthThing,
  },
  data() {
    return {
      contentLoaded: false,
      globalVolume: 0.05,
      gainNode: null,
      audioCtx: null,
      midiAccess: null,
      delayNodes: [],
    }
  },
  methods: {
    init() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;

      this.audioCtx = new AudioContext();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 1;
      this.contentLoaded = true;
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style>

#app {
  min-width: 100%;
  min-height: 100%;

}



</style>
