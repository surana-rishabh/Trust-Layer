import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function PhoenixBird3D({ modelUrl = '/models/phoenix_bird.glb' }) {
  const containerRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.5, 4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xff7700, 4.0);
    mainLight.position.set(5, 8, 5);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.0);
    rimLight.position.set(-5, -3, -2);
    scene.add(rimLight);

    let mixer;
    let model;
    let fallbackMesh;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let targetPosX = 0;
    let targetPosY = 0;

    const createProceduralPhoenixMesh = () => {
      const group = new THREE.Group();

      // Glowing core body
      const bodyGeo = new THREE.ConeGeometry(0.5, 1.6, 8);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xff6b00,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.5,
        wireframe: true
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.z = Math.PI;
      group.add(body);

      // Wings
      const wingGeo = new THREE.BufferGeometry();
      const wingVertices = new Float32Array([
        0, 0.2, 0,
        -1.8, 0.8, -0.4,
        -0.8, -0.6, 0,

        0, 0.2, 0,
        1.8, 0.8, -0.4,
        0.8, -0.6, 0
      ]);
      wingGeo.setAttribute('position', new THREE.BufferAttribute(wingVertices, 3));
      const wingMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        side: THREE.DoubleSide,
        wireframe: true
      });
      const wings = new THREE.Mesh(wingGeo, wingMat);
      group.add(wings);

      group.position.set(0, 0, 0);
      return group;
    };

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;

        // Auto-center & fit bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / (maxDim || 1);

        model.scale.set(scale, scale, scale);
        model.position.sub(center.multiplyScalar(scale));

        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }
      },
      undefined,
      () => {
        setHasError(true);
        fallbackMesh = createProceduralPhoenixMesh();
        scene.add(fallbackMesh);
      }
    );

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.7;
      targetRotationX = -y * 0.4;
      targetPosX = x * 0.3;
      targetPosY = y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      const activeObject = model || fallbackMesh;

      if (activeObject) {
        const time = clock.getElapsedTime();
        activeObject.position.y = Math.sin(time * 2.5) * 0.12 + targetPosY;
        activeObject.position.x += (targetPosX - activeObject.position.x) * 0.06;

        activeObject.rotation.y += (targetRotationY - activeObject.rotation.y) * 0.06;
        activeObject.rotation.x += (targetRotationX - activeObject.rotation.x) * 0.06;
        activeObject.rotation.z = Math.sin(time * 3.5) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '350px',
        position: 'relative',
        cursor: 'grab'
      }}
    />
  );
}
