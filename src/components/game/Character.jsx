import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Character({ position, isJumping, isSliding }) {
  const group = useRef();
  const targetPosition = useRef(new THREE.Vector3(position.lane * 2, position.y, position.z));
  
  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Update target position based on lane, jumping, and sliding
    targetPosition.current.x = position.lane * 2; // 2 units between lanes
    
    if (isJumping) {
      // Simple jump animation using sine curve
      const jumpProgress = (position.jumpTime / position.jumpDuration);
      targetPosition.current.y = Math.sin(jumpProgress * Math.PI) * 2 + 1; // Max height of 3 units
    } else {
      targetPosition.current.y = isSliding ? 0.5 : 1; // Lower when sliding
    }
    
    // Smoothly interpolate to target position
    group.current.position.lerp(targetPosition.current, delta * 10);
    
    // Tilt the character when changing lanes or sliding
    const targetRotation = new THREE.Euler(
      isSliding ? -Math.PI / 6 : 0, // Tilt forward when sliding
      0,
      (position.lane - position.previousLane) * -0.5 // Tilt when changing lanes
    );
    
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotation.x,
      delta * 10
    );
    
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      targetRotation.z,
      delta * 10
    );
  });
  
  return (
    <group ref={group} position={[position.lane * 2, position.y, position.z]}>
      {/* Character body */}
      <mesh castShadow>
        <boxGeometry args={[1, isSliding ? 0.5 : 1.5, 0.5]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      
      {/* Character head (only visible when not sliding) */}
      {!isSliding && (
        <mesh castShadow position={[0, 1, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>
      )}
    </group>
  );
}