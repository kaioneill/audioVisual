<template lang="pug">

  #audio

    .btn(@click="startAudio()") click


</template>

<script>

import { EventBus } from '../event-bus.js';
import Envelope from './Envelope.vue';

export default {
  name: 'audioBuffer',
  props: [
    "audioCtx"
  ],
  data() {
    return {
      gainNode: null,
      audioSource: null,
      bufferSource: null,
    }
  },
  methods: {
    startAudio() {
      
      var self = this
      

      self.bufferSource = self.audioCtx.createBufferSource();
      self.bufferSource.connect(self.gainNode);
      
      self.bufferSource.buffer = self.audioSource;
      self.bufferSource.start(0)
    }
  },
  mounted() {
    var audio = require('../sounds/bd01.wav');
    
  
    
    var self = this;
    
    
    self.gainNode = self.audioCtx.createGain();
    self.gainNode.connect(self.audioCtx.destination);
    self.gainNode.gain.value = 1;
    
    var reader = new FileReader();
    reader.onload = function(audio) {
      console.log(audio)

      
      self.audioCtx.decodeAudioData(audioData).then(function(decodedData) {
        self.audioSource = decodedData;
      });
    }
    reader.readAsArrayBuffer(audio);

    
    
    
    
    

    // load('../sounds/bd01.wav').then(function(buffer) {
    //   self.audioSource = buffer
    //   console.log(buffer)
    // })
    
    // EventBus.$on('arp-start', note => {
    //   this.startOsc(note);
    // });
    // EventBus.$on('arp-stop', note => {
    //   if(this.oscs[note] != null) {
    //     this.stopOsc(note);
    //   }
    // });
    
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
