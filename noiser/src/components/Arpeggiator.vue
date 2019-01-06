<template lang="pug">
  #arp





</template>

<script>

import { EventBus } from '../event-bus.js';
import vueSlider from 'vue-slider-component';

export default {
  name: 'arpeggiator',
  components: {
    vueSlider
  },
  props: [
    "audioCtx"
  ],
  data() {
    return {
      pressedNotes: {},
      arpped: false,
    }
  },
  methods: {
    getPressedNotes() {
      return this.pressedNotes
    },
    startArpeggiate() {
      var self = this
      
      
      for(let i=1;i<50;i++) {
        setTimeout(function() {
        
          let j = 1
          for(let n in self.pressedNotes) {
            
            if (self.pressedNotes.hasOwnProperty(n)) {
              setTimeout(function() {
                EventBus.$emit('arp-start', n)
              }, 100*j)
              setTimeout(function() {
                EventBus.$emit('arp-stop', n)
              }, 100*(j+1))
              j++
            }
          }
        }, 400*i)
      }

      

    },
    stopArpeggiate(note) {
      delete this.pressedNotes[note]
      EventBus.$emit('arp-stop', note)
    }
  },
  mounted() {
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
    this.gainNode.gain.value = 0;
    
    
    EventBus.$on('key-press', note => {
      
      this.pressedNotes[note] = note;

      if (!this.arpped && Object.keys(this.pressedNotes).length >= 4) {
        this.startArpeggiate();
        this.arpped = true;
      }
      
    });
    EventBus.$on('key-release', note => {
      this.stopArpeggiate(note);
    });
    
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>




</style>
