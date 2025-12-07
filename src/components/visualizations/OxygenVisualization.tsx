"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function OxygenRing({ value }: { value: number }) {
  const ringGroupRef = useRef<THREE.Group>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = state.clock.elapsedTime * 0.5
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = -state.clock.elapsedTime * 0.7
    }
  })

  const percentage = value / 100
  const color = value >= 95 ? "#06b6d4" : value >= 90 ? "#f59e0b" : "#ef4444"

  return (
    <group>
      <group ref={ringGroupRef}>
        <mesh>
          <torusGeometry args={[2.5, 0.15, 16, 100, Math.PI * 2 * percentage]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.5, 0.05, 16, 100]} />
          <meshStandardMaterial color="#374151" transparent opacity={0.3} />
        </mesh>
      </group>
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.5, 0.1, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

export function OxygenVisualization({ value }: { value: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        <OxygenRing value={value} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
        <p className="text-sm text-muted-foreground">SpO₂: <span className="text-cyan-400 font-bold text-lg">{value}%</span></p>
      </div>
    </div>
  )
}
