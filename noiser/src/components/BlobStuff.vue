<template lang="pug">
  #blob
    #canvas





</template>

<script>

import { EventBus } from '../event-bus.js';

export default {
  name: 'blobStuff',

  data() {
    return {
      noise: null,
      Three: null,
      pressedNotes: {},
      renderer: null,
      scene: null,
      camera: null,
      
      sphere: null,
      sphereGeometry: null,
      material: null,
      
      morph: 0,
      filterFreq: 15000,
      
    }
  },
  methods: {
    init() {
      
      // var self.Three = this.Three
      
      var self = this
      
      var container = document.querySelector('#canvas')
      
      self.renderer = new self.Three.WebGLRenderer({antialias:true});
      container.appendChild( self.renderer.domElement );
      // default bg canvas color //
      self.renderer.setClearColor(0xccffff);
      //  use device aspect ratio //
      self.renderer.setPixelRatio(window.devicePixelRatio);
      // set size of canvas within window //
      self.renderer.setSize(container.offsetWidth, container.offsetHeight);




      self.scene = new self.Three.Scene();
      self.camera = new self.Three.PerspectiveCamera( 45, container.offsetWidth/container.offsetHeight, 0.1, 1000 );
      self.camera.position.z = 5;


      self.sphereGeometry = new self.Three.SphereGeometry(1, 30, 30);
      self.material = new self.Three.MeshLambertMaterial();
      var light = new self.Three.SpotLight( 0x808080 ); // soft white light
      light.position.set(-40, 30, 10);
      self.scene.add( light );

      self.sphere = new self.Three.Mesh(self.sphereGeometry, self.material);
      self.old = new self.Three.Mesh(self.sphereGeometry, self.material);
      self.scene.add(self.sphere);

      self.old = []
      
      for (var i = 0; i < self.sphere.geometry.vertices.length; i++) {
          self.old.push(self.sphere.geometry.vertices[i]);
      }

    },
    update() {
      
      
      // var self.Three = this.Three
      
      var self = this
      Object.keys(self.pressedNotes).forEach(v => {
        this.morph += self.pressedNotes[v]
      })

      // change '0.003' for more aggressive animation
      // var time = performance.now() * 0.001;
      var time = self.morph * .00005;
      //console.log(time)

      //go through vertices here and reposition them
      
      // change 'k' value for more spikes
      var k = self.filterFreq/8000
      if(Object.keys(self.pressedNotes).length) {
      // if(true) {
        for (var i = 0; i < self.sphere.geometry.vertices.length; i++) {
            var p = self.sphere.geometry.vertices[i];
            p.normalize().multiplyScalar(1 + self.filterFreq/30000 * this.noise.noise.perlin3(p.x * k + time, p.y * k, p.z * k));
        }
      } else {
        for (var i = 0; i < self.sphere.geometry.vertices.length; i++) {
          self.sphere.geometry.vertices[i].x = (self.old[i].x + self.sphere.geometry.vertices[i].x) / 2
          self.sphere.geometry.vertices[i].y = (self.old[i].y + self.sphere.geometry.vertices[i].y) / 2
          self.sphere.geometry.vertices[i].z = (self.old[i].z + self.sphere.geometry.vertices[i].z) / 2
          self.sphere.geometry.vertices[i]
        }
      }
      self.sphere.geometry.computeVertexNormals();
      self.sphere.geometry.normalsNeedUpdate = true;
      self.sphere.geometry.verticesNeedUpdate = true;
    },
  },
  mounted() {
    this.Three = require('three')
    this.noise = require('../assets/perlin')
    
    var self = this;
    
    
    EventBus.$on('freq-on', freq => {
      self.pressedNotes[freq] = freq
      // requestAnimationFrame(animate);
      // this.morph += freq
    });
    EventBus.$on('freq-off', freq => {
      delete self.pressedNotes[freq]
      // this.morph -= freq
    });
    
    
    EventBus.$on('filter-change', filterFreq => {
      self.filterFreq = filterFreq
    });
    
    self.init();
    
    
    
    

    function animate() {
      //sphere.rotation.x += 0.01;
      //sphere.rotation.y += 0.01;
    
      self.update();
      /* render scene and camera */
      self.renderer.render(self.scene,self.camera);
      requestAnimationFrame(animate);
      
      // if(!Object.keys(self.pressedNotes).length) {
      //   self.sphere.geometry.vertices = self.old
      //   self.sphere.geometry.computeVertexNormals();
      //   self.sphere.geometry.normalsNeedUpdate = true;
      //   self.sphere.geometry.verticesNeedUpdate = true;
      // }
    
    }
    
    
    requestAnimationFrame(animate);
    
    
    
    
    
    
    
    
    // var self = this;
    // 
    // 
    // this.oldGeo = this.blob.geometry
    // 
    // 
    // var animate = function () {
		// 	requestAnimationFrame( animate );
    // 
    // 
    //   if(self.morph != 0) {
  	// 		self.blob.geometry.vertices.forEach(function(vector) {
    //       vector.x += Math.sin(self.morph/(vector.z/100));
    //       vector.y += Math.sin(self.morph/(vector.x/100));
    //       vector.z += Math.sin(self.morph/(vector.y/100));
    //       // if(vector.x >= 50) vector.x -= 100;
    //       // if(vector.y >= 50) vector.y -= 100;
    //       // if(vector.z >= 50) vector.z -= 100;
    //     });
    //   } 
    //     self.blob.geometry = self.oldGeo
    // 
    // 
    //   self.blob.geometry.verticesNeedUpdate = true;
		// 	// self.blob.rotation.y += 0.01;
    //   // self.blob.rotation.x += 0.01;
    // 
		// 	self.renderer.render( self.scene, self.camera );
		// };
    // animate();
    // 
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#blob {
  height: 200px;
  width: 200px;
}

#canvas {
  width: 100%;
  height: 100%;
}


</style>
