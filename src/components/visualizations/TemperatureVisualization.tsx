"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function TemperatureWaves({ temp }: { temp: number }) {
  const waveRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (waveRef.current) {
      waveRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  const particles = new THREE.BufferGeometry()
  const positions = []
  for (let i = 0; i < 1000; i++) {
    positions.push(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    )
  }
  particles.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))

  const tempColor = temp > 37.5 ? "#f97316" : temp < 36 ? "#3b82f6" : "#10b981"

  return (
    <>
      <group ref={waveRef}>
        <mesh>
          <torusGeometry args={[2, 0.2, 16, 100]} />
          <meshStandardMaterial color={tempColor} emissive={tempColor} emissiveIntensity={0.5} wireframe />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.2, 16, 100]} />
          <meshStandardMaterial color={tempColor} emissive={tempColor} emissiveIntensity={0.5} wireframe />
        </mesh>
      </group>
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial size={0.05} color={tempColor} transparent opacity={0.6} />
      </points>
    </>
  )
}

export function TemperatureVisualization({ temp }: { temp: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <TemperatureWaves temp={temp} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
      <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
        <p className="text-sm text-muted-foreground">Temperature: <span className="text-orange-400 font-bold text-lg">{temp}°C</span></p>
      </div>
    </div>
  )
}
