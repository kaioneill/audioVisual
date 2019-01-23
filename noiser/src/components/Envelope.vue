<template lang="pug">
  #env
    .row
      .pad-container
        h4 amp control
        #amp-pad.pad
          h4.gray.no-select attack
          h4.vertical-text.gray.no-select release
          #amp-drag.drag
      .pad-container
        h4 filter control
        #filter-pad.pad
          h4.gray.no-select freq
          h4.vertical-text.gray.no-select Q
          #filter-drag.drag

  

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
        
      ampPadX: 0.0,
      ampPadY: 0.0,
      
      filterPadX: 0.0,
      filterPadY: 0.0,
      
      ampEnvs: {},
      filterEnvs: {},
      
      decay: .5,
      sustain: 1,
    }
  },
  computed: {
    ampAttack: function() {
      return parseFloat(this.ampPadX / 100)
    },
    ampRelease: function() {
      return parseFloat(this.ampPadY / 50)
    },
    filterAttack: function() {
      return parseFloat(this.ampPadX / 100)
    },
    filterRelease: function() {
      return parseFloat(this.ampPadY / 50)
    },
    filterFreq: function() {
      return parseFloat(this.filterPadX * 200)
    },
    filterQ: function() {
      return parseFloat(this.filterPadY / 2)
    },
  },
  methods: {
    startEnv (obj) {
      var self = this
      
      var note = obj['note']
      var osc = obj['osc']


      self.ampEnvs[note] = self.audioCtx.createGain()
      self.ampEnvs[note].gain.value = 0
      
      self.filterEnvs[note] = self.audioCtx.createBiquadFilter()
      self.filterEnvs[note].frequency.value = 0
      self.filterEnvs[note].Q.value = self.filterQ
      
      osc.connect(self.ampEnvs[note])
      self.ampEnvs[note].connect(self.filterEnvs[note])
      
      self.ampEnvs[note].gain.linearRampToValueAtTime(.5, self.audioCtx.currentTime + self.ampAttack)
      self.filterEnvs[note].frequency.linearRampToValueAtTime(self.filterFreq, self.audioCtx.currentTime + self.filterAttack)
      
      self.filterEnvs[note].connect(self.audioCtx.destination)

      

    },
    stopEnv (obj) {
      
      var self = this
      
      var note = obj['note']
      var osc = obj['osc']
      
      self.ampEnvs[note].gain.cancelAndHoldAtTime(self.audioCtx.currentTime)
      self.ampEnvs[note].gain.linearRampToValueAtTime(0, self.audioCtx.currentTime + self.ampRelease + .01)
      
      self.filterEnvs[note].frequency.cancelAndHoldAtTime(self.audioCtx.currentTime)
      self.filterEnvs[note].frequency.linearRampToValueAtTime(0, self.audioCtx.currentTime + self.filterRelease + .01)

      
    },
  },
  mounted() {
    var self = this
    
  
    EventBus.$on('env-start', obj => {
      self.startEnv(obj);
    });
    EventBus.$on('env-stop', obj => {
      self.stopEnv(obj);
    });
    
    
    
    var ampDrag = document.querySelector("#amp-drag")
    var ampDragRect = ampDrag.getBoundingClientRect()
    var ampPad = document.querySelector("#amp-pad")
    var ampPadRect = ampPad.getBoundingClientRect()
    
    ampDrag.style.left = 0 + ampDrag.style.marginLeft
    ampDrag.style.top = 0 + ampDrag.style.marginTop
    
    self.ampPadX = parseInt(ampDrag.style.left) + 10
    self.ampPadY = parseInt(ampDrag.style.top) + 10
    
    
    // ampPad.onmousedown = function (e) {
    //   ampDrag.style.top = (e.clientY - parseInt((ampDragRect.top + ampDragRect.bottom)/2)) + 'px';
    //   ampDrag.style.left = (e.clientX - parseInt((ampDragRect.right + ampDragRect.left)/2)) + 'px';
    // }
    ampDrag.onmousedown = function (e) {
      ampDrag.style.top = (e.clientY - parseInt((ampDragRect.top + ampDragRect.bottom)/2)) + 'px';
      ampDrag.style.left = (e.clientX - parseInt((ampDragRect.right + ampDragRect.left)/2)) + 'px';
      ampPad.onmousemove = function (e) {
        e.preventDefault();
        var centerY = parseInt((ampDragRect.top + ampDragRect.bottom)/2)
        var centerX = parseInt((ampDragRect.right + ampDragRect.left)/2)
        if(e.clientY > ampPadRect.top + 10 && e.clientY < ampPadRect.bottom - 10) {
          ampDrag.style.top = (e.clientY - centerY) + 'px';
        }
        if(e.clientX > ampPadRect.left + 10 && e.clientX < ampPadRect.right - 10) {
          ampDrag.style.left = (e.clientX - centerX) + 'px';
        }
        document.onmouseup = function () {
          ampPad.onmousemove = null
        }
        self.ampPadX = parseInt(ampDrag.style.left) + 10
        self.ampPadY = parseInt(ampDrag.style.top) + 10
      }
    }
    
    
    var filterDrag = document.querySelector("#filter-drag")
    var filterDragRect = filterDrag.getBoundingClientRect()
    var filterPad = document.querySelector("#filter-pad")
    var filterPadRect = filterPad.getBoundingClientRect()
    
    
    filterDrag.style.left = '80px'
    filterDrag.style.top = 0
    
    self.filterPadX = parseInt(80) + 10
    self.filterPadY = parseInt(filterDrag.style.top) + 10
    
    
    
    
    // filterPad.onmousedown = function (e) {
    //   filterDrag.style.top = (e.clientY - parseInt((filterDragRect.top + filterDragRect.bottom)/2)) + 'px';
    //   filterDrag.style.left = (e.clientX - parseInt((filterDragRect.right + filterDragRect.left)/2)) + 'px';
    // }
    filterDrag.onmousedown = function (e) {
      filterDrag.style.top = (e.clientY - parseInt((filterDragRect.top + filterDragRect.bottom)/2)) + 'px';
      filterDrag.style.left = (e.clientX - parseInt((filterDragRect.right + filterDragRect.left)/2)) + 'px';
      filterPad.onmousemove = function (e) {
        e.preventDefault();
        var centerY = parseInt((filterDragRect.top + filterDragRect.bottom)/2)
        var centerX = parseInt((filterDragRect.right + filterDragRect.left)/2)
        if(e.clientY > filterPadRect.top + 10 && e.clientY < filterPadRect.bottom - 10) {
          filterDrag.style.top = (e.clientY - centerY) + 'px';
        }
        if(e.clientX > filterPadRect.left + 10 && e.clientX < filterPadRect.right - 10) {
          filterDrag.style.left = (e.clientX - centerX) + 'px';
        }
        document.onmouseup = function () {
          filterPad.onmousemove = null
          // TweenLite.to(document.querySelector('#background'), .5, {backgroundColor: 'rgb(rgb(204, 255, 255)'});
        }
        self.filterPadX = parseInt(filterDrag.style.left) + 10
        self.filterPadY = parseInt(filterDrag.style.top) + 10
        
        // var oldColor = window.getComputedStyle(document.querySelector('#background')).getPropertyValue('background-color')
        // 
        // var color = oldColor.substring(oldColor.indexOf('(')+1, oldColor.length-1).split(',').map(Number)
        // 
        // color[0] = parseInt(Math.cos(self.filterFreq/(color[0]*100) + self.filterQ/(color[0]*10)) * 255)
        // color[1] = parseInt(Math.sin(self.filterFreq/(color[1]*100) + self.filterQ/(color[1]*10)) * 255)
        // color[2] = parseInt(Math.tan(self.filterFreq/(color[2]*100) + self.filterQ/(color[2]*10)) * 255)
        // 
        // var newColor = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')'
        // TweenLite.to(document.querySelector('#background'), .5, {backgroundColor: newColor});
        
        if(self.filterEnvs) {
          Object.keys(self.filterEnvs).forEach(v => {
            // self.filterEnvs[v].frequency.cancelAndHoldAtTime(self.audioCtx.currentTime)
            self.filterEnvs[v].frequency.linearRampToValueAtTime(self.filterFreq, self.audioCtx.currentTime + .05)
            self.filterEnvs[v].Q.linearRampToValueAtTime(self.filterQ, self.audioCtx.currentTime + .05)
          })
        }
      }
    }  
    
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#env {
  width: 100%;
}

.pad-container {
  text-align: center;
  width: 120px;
  padding: 0 10px 0 10px;
}

.pad {
  background-color: #fff;
  height: 100px;
  width: 100px;
  border-radius: 10px;
  float: left;
}

.drag {
  position: relative;
  /* top: 90px; */
  /* left: 90px; */
  background-color: #000;
  height: 20px;
  width: 20px;
  border-radius: 10px;
}

h4 {
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
}

.gray {
  color: #777;
}

.vertical-text {
  position: relative;
  transform: rotate(270deg);
  right: 42px;
  top: 20px;
}
  
  
.no-select {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}

  


</style>
