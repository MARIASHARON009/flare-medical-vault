// Real-time ECG waveform visualization component
// Displays a continuously animating heartbeat waveform using canvas
"use client"

import { useEffect, useRef } from "react"

interface RealtimeWaveformProps {
  bpm: number
}

export function RealtimeWaveform({ bpm }: RealtimeWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const dataPointsRef = useRef<number[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // ECG waveform pattern (simplified QRS complex)
    const ecgPattern = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // baseline
      0, 0.05, 0.1, 0.05, 0, // P wave
      0, 0, 0, 0, 0, // PR segment
      0, -0.15, 0, 0.8, 0, -0.2, 0, // QRS complex
      0, 0, 0, 0, 0, // ST segment
      0, 0.25, 0.3, 0.25, 0.15, 0, // T wave
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 // baseline
    ]

    // Calculate timing based on BPM
    const beatInterval = (60 / bpm) * 1000 // ms per beat
    const samplesPerBeat = ecgPattern.length
    const sampleInterval = beatInterval / samplesPerBeat
    
    let lastSampleTime = Date.now()
    let patternIndex = 0
    const maxDataPoints = 200

    // Initialize data points
    dataPointsRef.current = Array(maxDataPoints).fill(0)

    const animate = () => {
      const now = Date.now()
      const elapsed = now - lastSampleTime

      // Add new data point based on sample interval
      if (elapsed >= sampleInterval) {
        const newPoint = ecgPattern[patternIndex]
        dataPointsRef.current.push(newPoint)
        if (dataPointsRef.current.length > maxDataPoints) {
          dataPointsRef.current.shift()
        }

        patternIndex = (patternIndex + 1) % ecgPattern.length
        lastSampleTime = now
      }

      // Clear canvas
      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)
      ctx.fillStyle = "rgba(15, 23, 42, 0.3)"
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = "rgba(100, 100, 100, 0.2)"
      ctx.lineWidth = 1
      
      // Vertical grid lines
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw waveform
      ctx.strokeStyle = "#ef4444" // red-500
      ctx.lineWidth = 2
      ctx.shadowBlur = 10
      ctx.shadowColor = "#ef4444"
      ctx.beginPath()

      const centerY = height / 2
      const scaleY = height * 0.3

      dataPointsRef.current.forEach((point, i) => {
        const x = (i / maxDataPoints) * width
        const y = centerY - point * scaleY

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
      ctx.shadowBlur = 0

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [bpm])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-24 rounded-lg"
      style={{ imageRendering: "crisp-edges" }}
    />
  )
}
