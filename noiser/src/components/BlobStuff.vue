<template lang="pug">
  #blob
    #container





</template>

<script>

import { EventBus } from '../event-bus.js';

export default {
  name: 'blobStuff',

  data() {
    return {
      pressedNotes: {},
    }
  },
  methods: {
    
  },
  mounted() {
    var THREE = require('three')
    
    EventBus.$on('key-press', note => {      
    });
    EventBus.$on('key-release', note => {
    });
    
    
    var container = document.querySelector('#container')
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 40, container.offsetHeight / container.offsetWidth, 0.01, 1000 );
 
    var radius = 40;
    var segments = 10;
    var rings = 10;

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = new THREE.MeshStandardMaterial({
      color: 0x777777,
      wireframe: false
    });


    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    var geo = new THREE.EdgesGeometry( cube.geometry ); // or WireframeGeometry
    var mat = new THREE.LineBasicMaterial( { color: 0xBBBBBB, linewidth: 1 } );
    var wireframe = new THREE.LineSegments( geo, mat );
    cube.add( wireframe );
    
    
    var light = new THREE.PointLight( 0x777777, 1, 50 );
    light.position.set( 500, 500, 500 );
    scene.add( light );
    
    var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add( ambientLight )

    camera.position.z = 150;
    
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( container.offsetHeight, container.offsetWidth );
    container.appendChild( renderer.domElement );
    
    renderer.render( scene, camera );
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#blob {
  height: 400px;
  width: 400px;
}

#container {
  width: 100%;
  height: 100%;
}


</style>
