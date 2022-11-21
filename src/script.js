import "./css/style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let model;
let mixer;
const mixers = [];
const models = [];
const radians = [];
const speed = [];

const COUNTER = 30;

gltfLoader.load(
	"/models/human/human.gltf",
	gltf => {
		model = gltf.scene;
		model.traverse(function (object) {
			if (object.isMesh) {
				object.castShadow = true;
				object.receiveShadow = true;
				// object.geometry.computeVertexNormals();
			}
    });
    
		mixer = new THREE.AnimationMixer(model);
		const action = mixer.clipAction(gltf.animations[0]);
		createAnimation(mixer, action, gltf.animations[0]);
		action.play();

		model.scale.set(0.07, 0.07, 0.07);
		model.castShadow = true;
		model.receiveShadow = true;

    for (let i = 0; i < COUNTER; i++) {
      models.push(clone(model))
      radians.push(2 * Math.PI * Math.random())
      speed.push(Math.random() * 2 + 10)
      mixers.push(new THREE.AnimationMixer(models[i]))
      mixers[i].clipAction(gltf.animations[0]).play()

      scene.add(models[i]);
    }
	},

	progress => {
		console.log("progress", progress);
	},
	error => {
		console.log("error", error);
	}
);
/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#ffffff",
    metalness: 0,
    roughness: 0.5,
	})
);

floor.receiveShadow = true;
floor.castShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

const light = new THREE.DirectionalLight( 0xffffff, 1);
light.position.set( 10, 10, 0 );
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024; 
light.shadow.camera.near = 0.1; 
light.shadow.camera.far = 100;
scene.add(light);


/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight *2;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 0); //make canvas transparent
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1,100);
// const cameraHelper = new THREE.CameraHelper(camera);
camera.position.z = 0;
camera.position.y = 3;
camera.lookAt(0, Math.PI * -2, 0);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

/**
 * gsap
 */
gsap.registerPlugin(ScrollTrigger);
const wrap = document.getElementById("wrap");
const sectionIntro = wrap.querySelector(".section-intro");

function createAnimation(mixer, action, clip) {
	let proxy = {
		get time() {
			return mixer.time;
		},

		set time(value) {
			action.paused = false;
			mixer.setTime(value);
			action.paused = true;
		},
	};

	let scrollingTL = gsap.timeline({
		scrollTrigger: {
			trigger: sectionIntro,
			start: "top top",
			end: "+=500%",
      scrub: true,
      onUpdate: (self) => {
        renderer.render(scene, camera);
        
        for (let i = 0; i < models.length; i++){
          mixers[i].setTime(self.progress * 10);
          models[i].position.x = Math.cos((radians[i] / models.length) * i) * speed[i] * self.progress/2 ;
          models[i].position.z = Math.sin((radians[i] / models.length)* i)  * speed[i] * self.progress/2 ;

        }
      }
		},
  });
  
  scrollingTL.to(proxy, {
    time: clip.duration,
    repeat: 20,
  });
}


let raf;
const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;
	//Update mixer
	for (const mixer of mixers) mixer.update(deltaTime);
	// if (mixer) mixer.update(deltaTime);
	raf = window.requestAnimationFrame(tick);
};


const io = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
      // tick()
		} else {
      cancelAnimationFrame(raf)
		}
	});
});

io.observe(sectionIntro);