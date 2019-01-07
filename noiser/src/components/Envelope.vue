<template lang="pug">
  #env
    #env-pad
      #drag

  

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
        
      padX: 0.0,
      padY: 0.0,
      
      envs: {},
      
      decay: .5,
      sustain: 1,
    }
  },
  computed: {
    attack: function() {
      return parseFloat(this.padX / 100)
    },
    release: function() {
      return parseFloat(this.padY / 100)
    },
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
      self.envs[note].gain.linearRampToValueAtTime(.5, self.audioCtx.currentTime + self.attack)

      

    },
    stopEnv (obj) {
      
      var self = this
      
      var note = obj['note']
      var osc = obj['osc']
      
      self.envs[note].gain.cancelAndHoldAtTime(self.audioCtx.currentTime)
      self.envs[note].gain.linearRampToValueAtTime(0, self.audioCtx.currentTime + self.release)

      
    },
  },
  mounted() {
    EventBus.$on('env-start', obj => {
      this.startEnv(obj);
    });
    EventBus.$on('env-stop', obj => {
      this.stopEnv(obj);
    });
    
    var self = this
    
    var drag = document.querySelector("#drag")
    var dragRect = drag.getBoundingClientRect()
    var envPad = document.querySelector("#env-pad")
    var envPadRect = envPad.getBoundingClientRect()
    drag.onmousedown = function (e) {
      drag.style.top = (e.clientY - parseInt((dragRect.top + dragRect.bottom)/2)) + 'px';
      drag.style.left = (e.clientX - parseInt((dragRect.right + dragRect.left)/2)) + 'px';
      envPad.onmousemove = function (e) {
        e.preventDefault();
        var centerY = parseInt((dragRect.top + dragRect.bottom)/2)
        var centerX = parseInt((dragRect.right + dragRect.left)/2)
        if(e.clientY > envPadRect.top + 10 && e.clientY < envPadRect.bottom - 10) {
          drag.style.top = (e.clientY - centerY) + 'px';
        }
        if(e.clientX > envPadRect.left + 10 && e.clientX < envPadRect.right - 10) {
          drag.style.left = (e.clientX - centerX) + 'px';
        }
        document.onmouseup = function () {
          envPad.onmousemove = null
        }
        self.padX = parseInt(drag.style.left) + 10
        self.padY = parseInt(drag.style.top) + 10
        
        
      }
    }
    
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #env-pad {
    background-color: #fff;
    height: 200px;
    width: 200px;
    border-radius: 10px;
  }
  
  #drag {
    position: relative;
    /* top: 90px; */
    /* left: 90px; */
    background-color: #000;
    height: 20px;
    width: 20px;
    border-radius: 10px;
  }


</style>
