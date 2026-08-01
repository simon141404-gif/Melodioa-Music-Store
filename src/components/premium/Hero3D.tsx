'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingNoteProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
}

function FloatingNote({ position, rotation, color = '#1DB954' }: FloatingNoteProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <torusGeometry args={[0.3, 0.1, 8, 12]} />
        <MeshDistortMaterial color={color} distort={0.3} speed={2} />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={300}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#1DB954" transparent opacity={0.6} />
    </points>
  );
}

function AudioWaves() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.5;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {[0, 0.5, 1, 1.5, 2].map((x, i) => (
        <mesh key={i} position={[x - 1, 0, 0]}>
          <boxGeometry args={[0.1, 1 + i * 0.2, 0.1]} />
          <meshStandardMaterial color="#1DB954" transparent opacity={0.5 - i * 0.08} />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingNote position={[-1.5, 0.5, 0]} rotation={[0, 0, 0]} color="#1DB954" />
        <FloatingNote position={[1.5, 0, 0]} rotation={[0, Math.PI / 4, 0]} color="#1ED760" />
        <FloatingNote position={[0, 1, -1]} rotation={[Math.PI / 4, 0, 0]} color="#FFFFFF" />
        <ParticleField />
        <AudioWaves />
      </Canvas>
    </div>
  );
}
