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
      renderer: null,
      blob: null,
      scene: null,
      camera: null,
      morphX: 0,
      
    }
  },
  methods: {
    init(THREE) {
      var container = document.querySelector('#container')
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 40, container.offsetHeight / container.offsetWidth, 0.01, 1000 );
   
      var radius = 40;
      var segments = 10;
      var rings = 10;

      var geometry = new THREE.SphereGeometry(radius, segments, rings);
      var material = new THREE.MeshStandardMaterial({
        color: 0x777777,
        wireframe: false
      });


      this.blob = new THREE.Mesh(geometry, material);
      this.scene.add(this.blob);
      
      // var geo = new THREE.EdgesGeometry( this.blob.geometry ); // or WireframeGeometry
      // var mat = new THREE.LineBasicMaterial( { color: 0xBBBBBB, linewidth: 1 } );
      // var wireframe = new THREE.LineSegments( geo, mat );
      // this.blob.add( wireframe );
      
      
      var light = new THREE.PointLight( 0x777777, 1, 50 );
      light.position.set( 500, 500, 500 );
      this.scene.add( light );
      
      var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
      this.scene.add( ambientLight )

      this.camera.position.z = 150;
      
      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      this.renderer.setSize( container.offsetHeight, container.offsetWidth );
      container.appendChild( this.renderer.domElement );
      
      // this.renderer.render( this.scene, this.camera );
    },
    
  },
  mounted() {
    var THREE = require('three')
    
    EventBus.$on('freq-on', freq => {
      console.log(freq)
      self.blob.geometry.vertices.forEach(function(element) {
        self.morphX = freq;
      }); 
    });
    EventBus.$on('freq-off', freq => {
    });
    
    this.init(THREE);
    
    var self = this;
    
    var animate = function () {
			requestAnimationFrame( animate );
    
    
    
			self.blob.geometry.vertices.forEach(function(element) {
        element.x += Math.sin(element.y)*10;
        element.y += Math.cos(element.x)*10;
        
      });
			// self.blob.rotation.y += 0.01;
      // self.blob.rotation.x += 0.01;
    
			self.renderer.render( self.scene, self.camera );
		};
    animate();
    
    
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
