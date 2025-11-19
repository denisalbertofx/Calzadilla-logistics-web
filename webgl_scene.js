import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const canvas = document.querySelector('#webgl-canvas');

// Scene Setup
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02020a, 0.015);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

// --- HOLOGRAPHIC GLOBE ---
const globeGroup = new THREE.Group();
scene.add(globeGroup);

// 1. SOLID CORE (Black sphere to occlude back side)
const coreGeometry = new THREE.SphereGeometry(4.9, 32, 32);
const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.95
});
const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
globeGroup.add(coreSphere);

// 2. DOT SPHERE
const sphereGeometry = new THREE.IcosahedronGeometry(5, 4);
const sphereMaterial = new THREE.PointsMaterial({
    color: 0x0066ff,
    size: 0.08,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
});
const spherePoints = new THREE.Points(sphereGeometry, sphereMaterial);
globeGroup.add(spherePoints);

// 3. WIREFRAME
const wireframeGeometry = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(5, 2));
const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.12
});
const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
globeGroup.add(wireframe);

// 4. ATMOSPHERIC GLOW (Custom Shader)
const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
void main() {
    float intensity = pow(0.4 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(0.0, 0.95, 1.0, 0.4) * intensity;
}
`;

const atmosphereGeometry = new THREE.SphereGeometry(5.2, 32, 32);
const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
globeGroup.add(atmosphere);

// 5. SHIPPING ROUTES (Store curves for traffic)
function createArc(startLat, startLng, endLat, endLng) {
    const phiStart = (90 - startLat) * (Math.PI / 180);
    const thetaStart = (startLng + 180) * (Math.PI / 180);
    const start = new THREE.Vector3(
        -(5 * Math.sin(phiStart) * Math.cos(thetaStart)),
        5 * Math.cos(phiStart),
        5 * Math.sin(phiStart) * Math.sin(thetaStart)
    );

    const phiEnd = (90 - endLat) * (Math.PI / 180);
    const thetaEnd = (endLng + 180) * (Math.PI / 180);
    const end = new THREE.Vector3(
        -(5 * Math.sin(phiEnd) * Math.cos(thetaEnd)),
        5 * Math.cos(phiEnd),
        5 * Math.sin(phiEnd) * Math.sin(thetaEnd)
    );

    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(7);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    const line = new THREE.Line(geometry, material);

    return { line, curve };
}

const routes = [];
routes.push(createArc(25, -80, 40, -74));  // Miami -> NY
routes.push(createArc(25, -80, 34, -118)); // Miami -> LA
routes.push(createArc(25, -80, 51, 0));    // Miami -> London
routes.push(createArc(34, -118, 35, 139)); // LA -> Tokyo
routes.push(createArc(40, -74, 51, 0));    // NY -> London

const routesGroup = new THREE.Group();
routes.forEach(r => routesGroup.add(r.line));
globeGroup.add(routesGroup);

// 6. TRAFFIC SYSTEM (Particles following curves)
class TrafficParticle {
    constructor(curve) {
        this.curve = curve;
        this.progress = Math.random(); // Start at random point
        this.speed = 0.002 + Math.random() * 0.001; // 4x faster
        this.position = new THREE.Vector3();
    }

    update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress = 0;
        this.position.copy(this.curve.getPointAt(this.progress));
    }
}

const trafficParticles = [];
routes.forEach(route => {
    for (let i = 0; i < 4; i++) { // 4 particles per route
        trafficParticles.push(new TrafficParticle(route.curve));
    }
});

const trafficGeometry = new THREE.BufferGeometry();
const trafficPositions = new Float32Array(trafficParticles.length * 3);
trafficGeometry.setAttribute('position', new THREE.BufferAttribute(trafficPositions, 3));

const trafficMaterial = new THREE.PointsMaterial({
    color: 0x00f3ff,
    size: 0.25,
    transparent: true,
    opacity: 1,
    sizeAttenuation: true
});
const trafficPoints = new THREE.Points(trafficGeometry, trafficMaterial);
globeGroup.add(trafficPoints);

// 7. BACKGROUND DATA DUST
const dustGeometry = new THREE.BufferGeometry();
const dustCount = 100; // Reduced from 200 for better performance
const dustPositions = new Float32Array(dustCount * 3);

for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 50;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20; // Behind globe
}

dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dustMaterial = new THREE.PointsMaterial({
    color: 0x0066ff,
    size: 0.05,
    transparent: true,
    opacity: 0.3
});
const dust = new THREE.Points(dustGeometry, dustMaterial);
scene.add(dust);

// --- POST PROCESSING ---
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2),
    1.2,  // strength
    0.4,  // radius
    0.85  // threshold
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// --- SCROLL & ANIMATION ---
let scrollY = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Globe rotation (faster)
    globeGroup.rotation.y = elapsedTime * 0.1 + (scrollY * 0.0008);

    // Camera scrollytelling (smoother and more responsive)
    const targetZ = 18 - (scrollY * 0.008);
    const targetY = (scrollY * 0.003);
    camera.position.z += (Math.max(8, targetZ) - camera.position.z) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.lookAt(0, 0, 0);

    // Update traffic particles
    trafficParticles.forEach((particle, i) => {
        particle.update();
        trafficPositions[i * 3] = particle.position.x;
        trafficPositions[i * 3 + 1] = particle.position.y;
        trafficPositions[i * 3 + 2] = particle.position.z;
    });
    trafficGeometry.attributes.position.needsUpdate = true;

    // Dust drift
    const dustPos = dustGeometry.attributes.position.array;
    for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.001;
    }
    dustGeometry.attributes.position.needsUpdate = true;

    composer.render();
    requestAnimationFrame(animate);
}

animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
