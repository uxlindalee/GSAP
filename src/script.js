import "./style.css";
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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

// let mixer = null;
let model, model1, model2, model3, model4, model5, model6, model7, model8, model9, model10;
const mixers = [];

gltfLoader.load(
	"/models/human/human.gltf",
	gltf => {
		model = gltf.scene;
		model.traverse(function (object) {
			if (object.isMesh) object.castShadow = true;
		});

		model1 = SkeletonUtils.clone(model);
		model2 = SkeletonUtils.clone(model);
		model3 = SkeletonUtils.clone(model);
		model4 = SkeletonUtils.clone(model);
		model5 = SkeletonUtils.clone(model);
		model6 = SkeletonUtils.clone(model);
		model7 = SkeletonUtils.clone(model);
		model8 = SkeletonUtils.clone(model);
		model9 = SkeletonUtils.clone(model);
		model10 = SkeletonUtils.clone(model);

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

		model1.scale.set(0.07, 0.07, 0.07);
		model2.scale.set(0.07, 0.07, 0.07);
		model3.scale.set(0.07, 0.07, 0.07);
		model4.scale.set(0.07, 0.07, 0.07);
		model5.scale.set(0.07, 0.07, 0.07);
		model6.scale.set(0.07, 0.07, 0.07);
		model7.scale.set(0.07, 0.07, 0.07);
		model8.scale.set(0.07, 0.07, 0.07);
		model9.scale.set(0.07, 0.07, 0.07);
		model10.scale.set(0.07, 0.07, 0.07);

		model1.position.x = -2;
		model1.position.z = -0.5;

		model2.position.x = 0;

		model3.position.x = 2;
		model3.position.z = 0.5;

		model4.position.x = -1;
		model4.position.z = 0.7;

		model4.position.x = 3;
		model4.position.z = -0.2;

		model5.position.x = -5;
		model5.position.z = -0.5;

		model6.position.x = 5;
		model6.position.z = 0.5;

		model7.position.x = 7;
		model7.position.z = 1;

		model8.position.x = -6;
		model8.position.z = 3;

		model9.position.x = 5;
		model9.position.z = 0.5;

		model10.position.x = 5;
		model10.position.z = 0.9;

		model.castShadow = true;
		model.receiveShadow = true;
		scene.add(model1, model2, model3, model4, model5, model6, model7, model8, model9, model10);
		mixers.push(mixer1, mixer2, mixer3, mixer4, mixer5, mixer6, mixer7, mixer8, mixer9, mixer10);
	},

	progress => {
		console.log("progress");
		console.log(progress);
	},
	error => {
		console.log("error");
		console.log(error);
	}
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		// color: "#f4f2f1",
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

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 0.75, 0);
// controls.enableDamping = true;

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
		model4.position.x += 0.001;
		model5.position.x -= 0.007;
		model6.position.x += 0.007;
		model7.position.x -= 0.007;
		model8.position.x += 0.001;
		model9.position.x -= 0.002;
		model10.position.x += 0.007;
	}

	// Update controls
	// controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
