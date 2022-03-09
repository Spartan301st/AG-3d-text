import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
// for font loader
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { MeshBasicMaterial, Mesh, AxesHelper, MeshMatcapMaterial } from "three";

// one way of importing local fonts - not ideal
// import font from "three/examples/fonts/helvetiker_regular.typeface.json";
// console.log(font);

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// axes helper
// const axesHelper = new AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// matcap texture for textGeometry
const matcapTexture1 = textureLoader.load("/textures/matcaps/9_new.png");
// const matcapTexture2 = textureLoader.load("/textures/matcaps/10_new.png");

/**
 * Fonts
 */
// instantiating one fontloader for multiple fonts (like we did for texture loader)
// const fontLoader = new THREE.FontLoader();
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // console.log("font loaded");
  // GEOMETRY
  // for creating text geometry
  const textGeometry = new TextGeometry("<A.G. Welcomes You!/>", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  // LONG WAY TO CENTER THE TEXTGEOMETRY
  // // to calculate the boxbounding
  // textGeometry.computeBoundingBox();
  // // console.log(textGeometry.boundingBox);
  // // to center the text
  // textGeometry.translate(
  //   (textGeometry.boundingBox.max.x - 0.02) * -0.5,
  //   (textGeometry.boundingBox.max.y - 0.02) * -0.5,
  //   (textGeometry.boundingBox.max.z - 0.03) * -0.5
  //   // -textGeometry.boundingBox.max.x * 0.5,
  //   // -textGeometry.boundingBox.max.y * 0.5,
  //   // -textGeometry.boundingBox.max.z * 0.5
  // );
  // // to recalculate the boxbounding
  // textGeometry.computeBoundingBox();
  // console.log(textGeometry.boundingBox);
  // SHORT WAY TO CENTER THE TEXTGEOMETRY
  textGeometry.center();

  // MATERIAL
  // for creating text material (meshbasic)
  // const textMaterial = new MeshBasicMaterial({ wireframe: true });
  // for creating text material (matcap)
  // way1
  // const textMaterial = new MeshMatcapMaterial({ matcap: matcapTexture1 });
  // way2
  // const textMaterial = new MeshMatcapMaterial();
  // textMaterial.matcap = matcapTexture1;
  // // MESH
  // const textMesh = new Mesh(textGeometry, textMaterial);
  // material for both text and donuts
  const material = new MeshMatcapMaterial();
  material.matcap = matcapTexture1;
  // MESH
  const textMesh = new Mesh(textGeometry, material);
  // add to the scene
  scene.add(textMesh);

  // start tracking donut rendering time
  // console.time("donuts");

  // adding multiple random donuts(toruses)
  // we only create geometry and material once to optimize the rendering time
  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64);
  // no need as we've defined it above for both text and donuts
  // const donutMaterial = new THREE.MeshMatcapMaterial({
  //   matcap: matcapTexture1,
  // });
  for (let i = 0; i < 200; i++) {
    // now we only need to create a new mesh and not geometry nor material on each rendering
    // const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);
    const donutMesh = new THREE.Mesh(donutGeometry, material);
    // position donuts randomly
    donutMesh.position.x = (Math.random() - 0.5) * 10;
    donutMesh.position.y = (Math.random() - 0.5) * 10;
    donutMesh.position.z = (Math.random() - 0.5) * 10;

    // rotate donuts randomly
    donutMesh.rotation.x = Math.random() * Math.PI;
    donutMesh.rotation.y = Math.random() * Math.PI;

    // scale donuts randomly
    const randomScale = Math.random();
    // donutMesh.scale.x = randomScale;
    // donutMesh.scale.y = randomScale;
    // donutMesh.scale.z = randomScale;
    donutMesh.scale.set(randomScale, randomScale, randomScale);

    scene.add(donutMesh);
  }
  // stop tracking donut rendering time
  // console.timeEnd("donuts");
});

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );

// scene.add(cube);

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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// create fonts dir in static dir and import fonts there
// bevels determine how rounded would the edges of rendered text be
// the steps involved in creating a 3d text:
// 1. create an instance of FontLoader
// 2. use that instance's load() method passing the path for the font, and a callback function that would return an actual font
// 3. Create ageometry using TextGeometry with some details for text rendering
// 4. then create a material with  MeshBasicMaterial for that font
// 5. next create a mesh using Mesh
// 6. finally add it to the scene

// bounding is an info assoc with the geometry that tells what space is taken by that geometry (can be a box or shpere)
// frustum culling - whether to render or not meshes on the given viewport
// by def three.js is using the sphere bounding
// we can use boxbounding by first calculating it using <textGeometry>.computeBoundingBox() method on the given mesh
// now we have access to <textGeometry>.boundingBox property which is a Box3 object containing max and min coordinates for x,y,z coordinates
// Note: because of te added bevels min values are less than the origin x,y,z
// Long way:
// to center the text we have to translate boundingBox of textGeometry for x,y,z by multiplying its
// (max xyz vals minus bevelThickness & bevelSize) by -0.5
// Short way:
// just use center method of textGeometry to center it

// for deployment we can use vercel
// it has a continuous integration, is dev friendly, easy to setup
// alternatives: Netlify, Github Pages
// run "npm run deploy" each time you make changes
