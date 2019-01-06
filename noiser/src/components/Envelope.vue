<template lang="pug">
  #env

  

</template>

<script>

import { EventBus } from '../event-bus.js';


export default {
  name: 'envelope',

  props: [
    "audioCtx"
  ],
  data() {
    return {
      envs: {},
    }
  },
  methods: {
    startEnv (obj) {
      var self = this
      
      var note = obj['note']
      var osc = obj['osc']


      self.envs[note] = self.audioCtx.createGain()
      self.envs[note].gain.value = 0
      
      osc.connect(self.envs[note])
      
      self.envs[note].connect(self.audioCtx.destination)
      self.envs[note].gain.linearRampToValueAtTime(.5, self.audioCtx.currentTime + .01)

      

    },
    stopEnv (obj) {
      var self = this
      
      var note = obj['note']
      var osc = obj['osc']
      

      self.envs[note].gain.linearRampToValueAtTime(0, self.audioCtx.currentTime + .01)

      
    },
  },
  mounted() {
    EventBus.$on('env-start', obj => {
      this.startEnv(obj);
    });
    EventBus.$on('env-stop', obj => {
      this.stopEnv(obj);
    });
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
