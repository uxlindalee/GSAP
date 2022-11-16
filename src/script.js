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
const models = []
const COUNTER = 10;

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
		metalness: 0,
		roughness: 1,
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

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.001);
// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.camera.left = -7;
// directionalLight.shadow.camera.top = 7;
// directionalLight.shadow.camera.right = 7;
// directionalLight.shadow.camera.bottom = -7;
// directionalLight.position.set(0, 5, 0);
// scene.add(directionalLight, lightHelper);
const light = new THREE.DirectionalLight( 0xffffff, 0.5, 1000 );
light.position.set( 0, 100, 0 );
light.castShadow = true;
light.shadow.camera.near = 1;
scene.add( light );

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
	sizes.height = window.innerHeight;

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

  let radian = 2 * Math.PI;

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
          models[i].position.x = Math.cos((radian / models.length) * i) * 5 * self.progress;
          models[i].position.z = Math.sin((radian / models.length)* i)  * 5 * self.progress;
          //Math.random()
        }
      }
		},
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

	// Call tick again on the next frame
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