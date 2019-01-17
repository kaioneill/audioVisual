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
      morph: 0,
      oldGeo: null,
      
    }
  },
  methods: {
    init(THREE) {
      var container = document.querySelector('#container')
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 40, container.offsetHeight / container.offsetWidth, 0.01, 1000 );
   
      var radius = 30;
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
      
      
      var light = new THREE.SpotLight( 0x7777BB, 2, 50 );
      light.position.set( 500, 1500, 500 );
      this.scene.add( light );
      
      // var light1 = new THREE.SpotLight( 0x7777AA, 2, 50 );
      // light1.position.set( -2000, -500, -500 );
      // this.scene.add( light1 );
      
      var ambientLight = new THREE.AmbientLight( 0xBBBBBB ); // soft white light
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
        self.morph = freq;
      }); 
    });
    EventBus.$on('freq-off', freq => {
      self.morph = 0;
    });
    
    this.init(THREE);
    
    var self = this;
    
    this.oldGeo = this.blob.geometry
    
    var animate = function () {
			requestAnimationFrame( animate );
    
  
      if(self.morph != 0) {
  			self.blob.geometry.vertices.forEach(function(vector) {
          vector.x += Math.sin(self.morph/(vector.z/100));
          vector.y += Math.sin(self.morph/(vector.x/100));
          vector.z += Math.sin(self.morph/(vector.y/100));
          // if(vector.x >= 50) vector.x -= 100;
          // if(vector.y >= 50) vector.y -= 100;
          // if(vector.z >= 50) vector.z -= 100;
        });
      } else {
        self.blob.geometry = self.oldGeo
      }
      
      self.blob.geometry.verticesNeedUpdate = true;
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
