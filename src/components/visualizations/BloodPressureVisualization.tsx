"use client"

import { useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

function PressureWaveform({ systolic, diastolic }: { systolic: number; diastolic: number }) {
  const lineRef = useRef<THREE.Line>(null)
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (lineRef.current) {
      timeRef.current += delta
      const geometry = lineRef.current.geometry as THREE.BufferGeometry
      const positions = geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length / 3; i++) {
        const x = (i / (positions.length / 3)) * 10 - 5
        const wave = Math.sin(x + timeRef.current * 2) * 1.5
        positions[i * 3 + 1] = wave
      }

      geometry.attributes.position.needsUpdate = true
    }
  })

  const points = []
  for (let i = 0; i < 100; i++) {
    const x = (i / 100) * 10 - 5
    const y = Math.sin(x) * 1.5
    points.push(new THREE.Vector3(x, y, 0))
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <>
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color="#3b82f6" linewidth={2} />
      </line>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 5, 32]} />
        <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.3} transparent opacity={0.3} />
      </mesh>
    </>
  )
}

export function BloodPressureVisualization({ systolic, diastolic }: { systolic: number; diastolic: number }) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <PressureWaveform systolic={systolic} diastolic={diastolic} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
        <p className="text-sm text-muted-foreground">
          BP: <span className="text-blue-400 font-bold text-lg">{systolic}/{diastolic}</span> mmHg
        </p>
      </div>
    </div>
  )
}
