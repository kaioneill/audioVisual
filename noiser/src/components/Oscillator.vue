<template lang="pug">
  #osc
    .col-sm-12 
      p slider here

    .col-sm-4
      h5 osc1
    
    .col-sm-8
      input(type="number" step="1" class="counter" id="osc1Pitch" :value="this.$data.osc1Pitch" @change="pitchChange(1)" @click="pitchChange(1)" data-toggle="tooltip" data-placement="top" title="osc1 pitch")
      input(type="number" step="1" class="counter" id="osc1Detune" :value="this.$data.detune" @change="pitchChange(-1)" @click="pitchChange(-1)" data-toggle="tooltip" data-placement="top" title="osc1 detune")

    .col-sm-12

      input(type="radio" name="wave-shape1" value="sine" id="sine1" @click="waveChange('sine', 1)" checked="true")
      label(for="sine1")
        h4 sine
      input(type="radio" name="wave-shape1" value="square" id="square1" @click="waveChange('square', 1)")
      label(for="square1")
        h4 square
      input(type="radio" name="wave-shape1" value="saw" id="saw1" @click="waveChange('sawtooth', 1)")
      label(for="saw1")
        h4 saw
      input(type="radio" name="wave-shape1" value="randomWave" id="randomWave1" @click="waveChange('randomWave', 1)")
      label(for="randomWave1")
        h4 random

</template>

<script>
export default {
  name: 'oscillator',
  props: {
  
  },
  data() {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


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
}

/* input {
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
  z-index: 0;
} */

/* option {
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
  z-index: 0;
} */

h4 {
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 14px;
  z-index: 0;
}

h5 {
  font-family: 'Poppins', sans-serif;
  font-weight: 100;
  font-style: italic;
  font-size: 18px;
  z-index: 0;
}

.settings {
  float: left;
}


.main-panel {

  margin: auto;
  width: 500px;
  position: relative;
}

#controls {
  /* position: relative; */

  padding: 20px 0px 10px 30px;

}





input[type="radio"]{
    position:fixed;opacity:0
}


input[type="radio"]:checked+label{
  background-color: #ffbf00;
  border-radius: 5px;
  padding: 0 10px 0 10px;
  margin:  0 10px 0 10px;
}
input[type="radio"]+label{

  padding: 0 10px 0 10px;
  margin:  0 10px 0 10px;
}

.padding {
  padding: 10px;
}

.osc-sliders {
  max-width: 30%;
}

</style>
