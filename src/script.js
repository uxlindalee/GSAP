import "./style.css";
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
// let modelClone;
let model1, model2, model3, model4, model5, model6, model7, model8, model9, model10;
const mixers = [];

gltfLoader.load(
	"/models/human/human.gltf",
	gltf => {
		model = gltf.scene;
		model.traverse(function (object) {
			if (object.isMesh) {
				object.castShadow = true;
				object.receiveShadow = true;
				object.geometry.computeVertexNormals();
			}
		});
		mixer = new THREE.AnimationMixer(model);
		mixer.clipAction(gltf.animations[0]).play();
		model.position.set(0, 0, 0);
		model.scale.set(0.07, 0.07, 0.07);
		model.castShadow = true;
		model.receiveShadow = true;
		// scene.add(model);

		model1 = clone(model);
		model2 = clone(model);
		model3 = clone(model);
		model4 = clone(model);
		model5 = clone(model);
		model6 = clone(model);
		model7 = clone(model);
		model8 = clone(model);
		model9 = clone(model);
		model10 = clone(model);

		model1.position.set(0, 0, 0);
		model2.position.set(-2, 0, 0.5);
		model3.position.set(2, 0, 0.5);
		model4.position.set(-1, 0, 0.7);
		model5.position.set(-2.5, 0, -0.5);
		model6.position.set(5, 0, 0.5);
		model7.position.set(7, 0, 1);
		model8.position.set(-6, 0, 3);
		model9.position.set(5, 0, 0.5);
		model10.position.set(5, 0, 0.9);

		const mixer1 = new THREE.AnimationMixer(model1);
		const mixer2 = new THREE.AnimationMixer(model2);
		const mixer3 = new THREE.AnimationMixer(model3);
		const mixer4 = new THREE.AnimationMixer(model4);
		const mixer5 = new THREE.AnimationMixer(model5);
		const mixer6 = new THREE.AnimationMixer(model6);
		const mixer7 = new THREE.AnimationMixer(model7);
		const mixer8 = new THREE.AnimationMixer(model8);
		const mixer9 = new THREE.AnimationMixer(model9);
		const mixer10 = new THREE.AnimationMixer(model10);

		mixer1.clipAction(gltf.animations[0]).play();
		mixer2.clipAction(gltf.animations[0]).play();
		mixer3.clipAction(gltf.animations[0]).play();
		mixer4.clipAction(gltf.animations[0]).play();
		mixer5.clipAction(gltf.animations[0]).play();
		mixer6.clipAction(gltf.animations[0]).play();
		mixer7.clipAction(gltf.animations[0]).play();
		mixer8.clipAction(gltf.animations[0]).play();
		mixer9.clipAction(gltf.animations[0]).play();
		mixer10.clipAction(gltf.animations[0]).play();

		scene.add(model1, model2, model3, model4, model5, model6, model7, model8, model9, model10);
		mixers.push(mixer, mixer1, mixer2, mixer3, mixer4, mixer5, mixer6, mixer7, mixer8, mixer9, mixer10);
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
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.001);
const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight, lightHelper);

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
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
const $wrap = document.getElementById("wrap");
const $canvasSection = $wrap.querySelector(".section-intro");
// window.addEventListener("scroll", () => {
// 	scrollY = canvasSection.scrollY;
// 	console.log(scrollY);
// });

// gsap.fromTo(
// 	canvas.scene,
// 	{ scale: 50, fill: "#2db400" },
// 	{
// 		scale: 0.5,
// 		fill: "#ffffff",
// 		ease: "expo.easeOut",
// 		scrollTrigger: {
// 			trigger: canvasSection,
// 			start: "top top",
// 			end: "bottom bottom",
// 			scrub: true,
// 		},
// 	}
// );

// Animation
// function createAnimation(mixer1, action) {
// 	let proxy = {
// 		get time() {
// 			return mixer1.time;
// 		},

// 		set time(value) {
// 			action.paused = false;

// 			mixer1.setTime(value);

// 			action.paused = true;
// 		},
// 	};

// 	let scrollingTL = gsap
// 		.timeline({
// 			scrollTrigger: {
// 				trigger: $canvasSection,

// 				start: "top top",

// 				end: "+=500%",

// 				pin: true,

// 				scrub: true,

// 				onUpdate: function () {},
// 			},
// 		})

// 		.to(proxy, {
// 			time: position.x * 0.01,
// 		});
// }

// let scrollY = window.scrollY;
// let currentSection = 0;

// window.addEventListener("scroll", () => {
// 	scrollY = window.scrollY;

// 	const newSection = Math.round(scrollY / sizes.height);

// 	if (newSection != currentSection) {
// 		currentSection = newSection;

// 		// console.log(sectionMeshes)
// 		gsap.to(sectionMeshes[currentSection].rotation, {
// 			duration: 1.5,
// 			ease: "power2.inOut",
// 			x: "+=6",
// 			y: "+=3",
// 			z: "+=1.5",
// 		});
// 	}
// });

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	//Update mixer
	for (const mixer of mixers) mixer.update(deltaTime);

	if (model) {
		model1.position.x += 0.005;
		model2.position.x += 0.003;
		model3.position.x -= 0.007;
		model4.position.x += 0.009;
		model5.position.x -= 0.002;
		model6.position.x += 0.004;
		model7.position.x -= 0.007;
		model8.position.x += 0.009;
		model9.position.x -= 0.002;
		model10.position.x += 0.007;
	}

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
	// cancelAnimationFrame(requestID);
};

// tick();

gsap.registerPlugin(ScrollTrigger);
const $sectionIntro = $wrap.querySelector(".section-intro");

console.log("is this here working?");
ScrollTrigger.create({
	trigger: $sectionIntro,
	start: "top center",
	end: "bottom bottom",
	onEnter: () => tick(),
	onLeaveBack: () => tick(),
});
