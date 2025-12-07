"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

function PulsingHeart({ bpm }: { bpm: number }) {
  const heartRef = useRef<THREE.Group>(null)
  const pulseSpeed = 60 / bpm // seconds per beat

  useFrame((state) => {
    if (heartRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * (1 / pulseSpeed) * Math.PI * 2) * 0.15
      heartRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={heartRef}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.6, 0.9, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.6, 0.9, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.4, 1.4, 1]} />
        <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export function HeartRateVisualization({ bpm }: { bpm: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#dc2626" />
        <PulsingHeart bpm={bpm} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
      <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
        <p className="text-sm text-muted-foreground">BPM: <span className="text-red-400 font-bold text-lg">{bpm}</span></p>
      </div>
    </div>
  )
}
