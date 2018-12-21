<template lang="pug">
  #app
    synth-thing
  
</template>

<script>
import SynthThing from './components/SynthThing.vue'

export default {
  name: 'app',
  components: {
    "synth-thing": SynthThing,
  },
}
</script>

<style>
#app {
  min-width: 100%;
  min-height: 100%;

}



</style>
