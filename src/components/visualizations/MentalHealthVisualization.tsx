"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function MoodSpectrum({ score }: { score: number }) {
  const brainRef = useRef<THREE.Mesh>(null)
  const orbsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (orbsRef.current) {
      orbsRef.current.rotation.y = -state.clock.elapsedTime * 0.2
    }
  })

  // Color based on score
  const getColor = () => {
    if (score >= 80) return "#a855f7" // Excellent - Purple
    if (score >= 60) return "#8b5cf6" // Good - Violet
    if (score >= 40) return "#6366f1" // Fair - Indigo
    return "#3b82f6" // Needs attention - Blue
  }

  const color = getColor()
  const distort = (100 - score) / 200 // More distortion for lower scores

  return (
    <group>
      {/* Central Brain */}
      <mesh ref={brainRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          distort={distort}
          speed={2}
          roughness={0.4}
        />
      </mesh>

      {/* Orbiting mood particles */}
      <group ref={orbsRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const radius = 3
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.5,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

export function MentalHealthVisualization({ score }: { score: number }) {
  const getMoodLabel = () => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Attention"
  }

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <MoodSpectrum score={score} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Mental Health: <span className="text-purple-400 font-bold text-lg">{score}/100</span>
          <span className="ml-2 text-xs">({getMoodLabel()})</span>
        </p>
      </div>
    </div>
  )
}
