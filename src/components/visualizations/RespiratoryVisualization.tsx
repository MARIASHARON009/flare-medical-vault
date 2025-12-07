"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function ExpandingLungs({ rate }: { rate: number }) {
  const leftLungRef = useRef<THREE.Mesh>(null)
  const rightLungRef = useRef<THREE.Mesh>(null)
  const breathSpeed = 60 / rate // seconds per breath

  useFrame((state) => {
    const expansion = Math.sin(state.clock.elapsedTime * (1 / breathSpeed) * Math.PI) * 0.3 + 1
    
    if (leftLungRef.current) {
      leftLungRef.current.scale.set(1, expansion, 1)
    }
    if (rightLungRef.current) {
      rightLungRef.current.scale.set(1, expansion, 1)
    }
  })

  return (
    <group>
      {/* Left Lung */}
      <mesh ref={leftLungRef} position={[-1.2, 0, 0]}>
        <capsuleGeometry args={[0.8, 2, 16, 32]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
      
      {/* Right Lung */}
      <mesh ref={rightLungRef} position={[1.2, 0, 0]}>
        <capsuleGeometry args={[0.8, 2, 16, 32]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>

      {/* Trachea */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
      </mesh>

      {/* Bronchi */}
      <mesh position={[-0.6, 0.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.6, 0.5, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

export function RespiratoryVisualization({ rate }: { rate: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10b981" />
        <ExpandingLungs rate={rate} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
      <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
        <p className="text-sm text-muted-foreground">Respiratory Rate: <span className="text-green-400 font-bold text-lg">{rate}</span> brpm</p>
      </div>
    </div>
  )
}
