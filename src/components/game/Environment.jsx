import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create an infinite-scrolling ground
export default function Environment({ speed }) {
  const groundRef = useRef();
  const trackSegments = useRef([]);
  const SEGMENT_LENGTH = 20;
  const VISIBLE_SEGMENTS = 6;
  
  // Initialize track segments
  if (trackSegments.current.length === 0) {
    for (let i = 0; i < VISIBLE_SEGMENTS; i++) {
      trackSegments.current.push({
        position: new THREE.Vector3(0, 0, -SEGMENT_LENGTH * i),
        index: i
      });
    }
  }
  
  useFrame((state, delta) => {
    // Move all segments forward
    trackSegments.current.forEach(segment => {
      segment.position.z += speed * delta;
      
      // If segment is now behind the camera, move it to the back of the queue
      if (segment.position.z > SEGMENT_LENGTH) {
        segment.position.z = -SEGMENT_LENGTH * (VISIBLE_SEGMENTS - 1);
        segment.index = (segment.index + VISIBLE_SEGMENTS - 1) % VISIBLE_SEGMENTS;
      }
    });
  });
  
  return (
    <group ref={groundRef}>
      {trackSegments.current.map((segment, index) => (
        <mesh 
          key={index} 
          position={[0, -0.5, segment.position.z]} 
          receiveShadow
        >
          <boxGeometry args={[10, 1, SEGMENT_LENGTH]} />
          <meshStandardMaterial color="#333333" />
          
          {/* Lane dividers */}
          <mesh position={[-2, 0.01, 0]}>
            <boxGeometry args={[0.1, 0.02, SEGMENT_LENGTH]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[2, 0.01, 0]}>
            <boxGeometry args={[0.1, 0.02, SEGMENT_LENGTH]} />
            <meshStandardMaterial color="white" />
          </mesh>
          
          {/* Sides of the track */}
          <mesh position={[-5, 1, 0]}>
            <boxGeometry args={[0.5, 2, SEGMENT_LENGTH]} />
            <meshStandardMaterial color="gray" />
          </mesh>
          <mesh position={[5, 1, 0]}>
            <boxGeometry args={[0.5, 2, SEGMENT_LENGTH]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        </mesh>
      ))}
      
      {/* Background buildings */}
      <BackgroundBuildings />
    </group>
  );
}

// Simple background buildings
function BackgroundBuildings() {
  const buildings = [];
  const BUILDING_COUNT = 40;
  
  for (let i = 0; i < BUILDING_COUNT; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const distance = 10 + Math.random() * 10;
    const height = 3 + Math.random() * 10;
    const width = 2 + Math.random() * 5;
    const depth = 2 + Math.random() * 5;
    const posZ = -100 + i * 10;
    
    buildings.push(
      <mesh key={i} position={[side * distance, height / 2 - 0.5, posZ]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={`rgb(${50 + Math.random() * 100}, ${50 + Math.random() * 100}, ${50 + Math.random() * 100})`} />
      </mesh>
    );
  }
  
  return <group>{buildings}</group>;
}