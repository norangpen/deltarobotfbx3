// Import necessary modules from Three.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, clock;
let mixer;
const animations = [];
let controls;

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(100, 50, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color('grey'));  // Set renderer background color to grey
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    setupLighting();

    loadStaticModel();
    loadAnimationModel();

    document.getElementById('playButton').addEventListener('click', () => {
        animations.forEach((anim) => {
            anim.stop();
            anim.play();
        });
    });
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(-300, 150, 300);
    scene.add(directionalLight);
}

function loadStaticModel() {
    const loader = new FBXLoader();
    loader.load('models/StaticModel.fbx', (fbx) => {
        scene.add(fbx);  // Add the FBX model to the scene
        console.log('Static model loaded.');
    }, undefined, function (error) {
        console.error('Error loading the static model:', error);
    });
}

function loadAnimationModel() {
    const loader = new FBXLoader();
    loader.load('models/Animations.fbx', (fbx) => {
        mixer = new THREE.AnimationMixer(fbx); // Create an AnimationMixer for the fbx object
        fbx.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            animations.push(action); // Store the action for later use
        });
        console.log('Animation file loaded and mixer initialized.');
    }, undefined, function (error) {
        console.error('Error loading the animation file:', error);
    });
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }

    controls.update();

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
});

init();
animate();


