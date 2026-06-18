import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Rotating Earth with texture
function Earth() {
  const earthRef = useRef();
  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.002;
  });
  return (
    <Sphere ref={earthRef} args={[2, 64, 64]}>
      <meshStandardMaterial map={new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')} />
    </Sphere>
  );
}

// Floating CO₂ particles around the globe
function Particles({ footprintLevel }) {
  const particlesRef = useRef();
  const [particleCount] = useState(300);
  const positions = useRef(new Float32Array(particleCount * 3));

  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      // random sphere surface directions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 0.5;
      positions.current[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions.current[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions.current[i*3+2] = r * Math.cos(phi);
    }
    particlesRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions.current, 3));
  }, []);

  const color = footprintLevel > 500 ? '#ff4d4d' : footprintLevel > 200 ? '#ffaa33' : '#66ff66';
  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial color={color} size={0.05} transparent opacity={0.7} />
    </points>
  );
}

export default function Earth3D({ footprintTotal }) {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-green-400/30">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Earth />
        <Particles footprintLevel={footprintTotal} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm">
        🌍 Your CO₂: {footprintTotal} kg CO₂e
      </div>
    </div>
  );
}