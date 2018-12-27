<template lang="pug">
  .main-panel
    .main-name.col-sm-7#main-name {{this.mainName}}
    
    oscillator(v-if="this.contentLoaded" :audioCtx="this.audioCtx")

    

</template>

<script>
import Oscillator from './Oscillator.vue'

export default {
  name: 'synth-thing',
  components: {
    "oscillator": Oscillator
    
  },
  props: [
    "audioCtx"
  ],
  data() {
    return {
      mainName: 'the_noise',
      contentLoaded: false,
    }
  },
  methods: {
    init() {
      this.contentLoaded = true;
    }
  },
  mounted() {
    this.init()
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

.vertical-labels {
  padding-top: 40px;
  padding-right: 80px;
  transform: rotate(90deg);
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

#controls {
  /* position: relative; */

  padding: 20px 0px 10px 30px;

}

.aligned-sliders {
  display: inline-block;
  width: 20px;

}

.vertical-sliders {
  -webkit-appearance: slider-vertical;
  writing-mode: bt-lr;
  height: 50px;
  width: 10px;
  position: relative;
  float: left;
  z-index: 1;
}


.knob {
  transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  border-radius: 2em;
  margin: 2px;
  position: relative;
  float: left;
  top: 0px;
  left: 0px;
  height: 30px;
  width: 30px;
  background-color: #0066ff;

}
.knob-handle {
  border-radius: 2em;
  margin: 2px;
  position: relative;
  float: left;
  top: 4px;
  left: 4px;
  height: 5px;
  width: 5px;
  background-color:#fff;
}

.pad {
  margin: 2px;
  position: relative;
  float: left;
  top: 0px;
  left: 0px;
  height: 50px;
  width: 50px;
  background-color: #cc0066;
}

#pads {

  padding: 10px;
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
