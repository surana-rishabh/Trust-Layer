import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function PhoenixBird3D({ modelUrl = '/models/phoenix_bird.glb' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffaa00, 3);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 4, 20);
    blueLight.position.set(-5, -2, 3);
    scene.add(blueLight);

    let mixer;
    let model;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let targetPosX = 0;
    let targetPosY = 0;

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.005, 0.005, 0.005);
        model.position.set(0, -0.5, 0);
        scene.add(model);

        // Play animations if present
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }
      },
      undefined,
      (err) => {
        // Fallback procedure if model fails loading
        console.warn('GLTF Load fallback:', err);
      }
    );

    // Smooth Mouse / Pointer Tracking
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotationY = x * 0.8;
      targetRotationX = -y * 0.5;
      targetPosX = x * 0.4;
      targetPosY = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      if (model) {
        // Flying bobbing effect
        const time = clock.getElapsedTime();
        model.position.y = -0.5 + Math.sin(time * 2) * 0.15 + targetPosY * 0.5;
        model.position.x += (targetPosX - model.position.x) * 0.05;

        // Smooth rotation interpolation
        model.rotation.y += (targetRotationY - model.rotation.y) * 0.05;
        model.rotation.x += (targetRotationX - model.rotation.x) * 0.05;
        model.rotation.z = Math.sin(time * 3) * 0.05;
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
