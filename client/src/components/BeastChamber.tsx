import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface BeastChamberProps {
  progression?: any
}

// ─── TRANSFORMATION STAGES ───────────────────────────────────────────────────
const TRANSFORMATIONS = [
  { level: 0,   name: 'Dormant Seed',     color: '#555',    glow: 'rgba(85,85,85,0.4)' },
  { level: 5,   name: 'First Awakening',  color: '#00e5a0', glow: 'rgba(0,229,160,0.5)' },
  { level: 15,  name: 'Soul Stirring',    color: '#00b4ff', glow: 'rgba(0,180,255,0.5)' },
  { level: 30,  name: 'Beast Rising',     color: '#ffd600', glow: 'rgba(255,214,0,0.5)' },
  { level: 50,  name: 'Power Unleashed',  color: '#ff6b00', glow: 'rgba(255,107,0,0.5)' },
  { level: 75,  name: 'Fully Awakened',   color: '#ff3d00', glow: 'rgba(255,61,0,0.5)' },
  { level: 100, name: 'Legendary Form',   color: '#dd00ff', glow: 'rgba(221,0,255,0.5)' },
  { level: 150, name: 'Divine Ascension', color: '#e8f0ff', glow: 'rgba(232,240,255,0.6)' },
  { level: 200, name: 'MAXIMUM POWER',    color: '#ffffff', glow: 'rgba(255,255,255,0.8)' },
]

function getCurrentTransform(level: number) {
  let current = TRANSFORMATIONS[0]
  for (const t of TRANSFORMATIONS) {
    if (level >= t.level) current = t
    else break
  }
  return current
}

function getNextTransform(level: number) {
  for (const t of TRANSFORMATIONS) {
    if (level < t.level) return t
  }
  return null
}

// ─── THREE.JS BEAST CANVAS ───────────────────────────────────────────────────
function BeastCanvas({ color, level }: { color: string; level: number }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth || 400
    const h = mount.clientHeight || 400

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Parse color to THREE.Color
    const threeColor = new THREE.Color(color)

    // Central orb
    const orbGeo = new THREE.SphereGeometry(0.8, 32, 32)
    const orbMat = new THREE.MeshPhongMaterial({
      color: threeColor,
      emissive: threeColor,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    })
    const orb = new THREE.Mesh(orbGeo, orbMat)
    scene.add(orb)

    // Wireframe sphere overlay
    const wireGeo = new THREE.SphereGeometry(0.82, 16, 16)
    const wireMat = new THREE.MeshBasicMaterial({
      color: threeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })
    const wire = new THREE.Mesh(wireGeo, wireMat)
    scene.add(wire)

    // Rotating rings
    const rings: THREE.Mesh[] = []
    const ringAngles = [0, Math.PI / 3, (2 * Math.PI) / 3]
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(1.4 + i * 0.3, 0.015, 8, 80)
      const ringMat = new THREE.MeshBasicMaterial({
        color: threeColor,
        transparent: true,
        opacity: 0.5 - i * 0.1,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = ringAngles[i]
      ring.rotation.y = ringAngles[(i + 1) % 3]
      scene.add(ring)
      rings.push(ring)
    }

    // Floating particles
    const particleCount = Math.min(60 + level * 2, 300)
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.8 + Math.random() * 1.5
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: threeColor,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(threeColor, 2, 10)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)

    // Animation
    let t = 0
    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      t += 0.01

      orb.rotation.y += 0.005
      orb.rotation.x += 0.002
      wire.rotation.y -= 0.003
      wire.rotation.z += 0.004

      rings[0].rotation.z += 0.008
      rings[1].rotation.x += 0.006
      rings[2].rotation.y += 0.007

      particles.rotation.y += 0.002
      particles.rotation.x += 0.001

      // Pulse orb scale
      const pulse = 1 + Math.sin(t * 2) * 0.05
      orb.scale.setScalar(pulse)

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!mount) return
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [color, level])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        aspectRatio: '1',
        maxHeight: 460,
        borderRadius: 20,
        border: '1px solid rgba(0,229,160,0.15)',
        background: 'radial-gradient(ellipse at center, #0a001a 0%, #000 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    />
  )
}

// ─── BEAST CHAMBER ───────────────────────────────────────────────────────────
export default function BeastChamber({ progression }: BeastChamberProps) {
  const prog = progression || {}
  const level = prog.currentLevel || 1
  const totalXP = prog.totalXP || 0
  const xpToNext = prog.xpToNextLevel || 1000
  const currentStreak = prog.currentStreak || 0
  const tierRank = prog.tierRank || 'BUILDING'
  const powerScore = prog.powerScore || 0
  const faithScore = prog.faithScore || 0
  const hustleScore = prog.hustleScore || 0

  const currentTransform = getCurrentTransform(level)
  const nextTransform = getNextTransform(level)
  const xpPercent = Math.min((totalXP % xpToNext) / xpToNext * 100, 100)

  // Tier color mapping
  const tierColors: Record<string, string> = {
    'BUILDING': '#00e5a0',
    'GRINDING': '#00b4ff',
    'HUSTLING': '#ffd600',
    'CERTIFIED': '#ff6b00',
    'LEGENDARY': '#dd00ff',
    'DIVINE': '#ffffff',
  }
  const tierColor = tierColors[tierRank] || '#00e5a0'

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 20,
        alignItems: 'start',
      }}
      className="beast-layout"
    >
      <style>{`
        @media (max-width: 800px) {
          .beast-layout { grid-template-columns: 1fr !important; }
        }
        @keyframes auraRotate { to { transform: rotate(360deg); } }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes xpFill { from { width: 0% } }
      `}</style>

      {/* Left: Three.js Canvas with aura ring */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
        {/* Aura ring */}
        <div
          style={{
            position: 'absolute',
            inset: -20,
            borderRadius: '50%',
            border: '2px solid transparent',
            background: `linear-gradient(#000005, #000005) padding-box, linear-gradient(45deg, ${currentTransform.color}, transparent, ${currentTransform.color}) border-box`,
            animation: 'auraRotate 4s linear infinite',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        <BeastCanvas color={currentTransform.color} level={level} />
      </div>

      {/* Right: Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Power Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(10,0,30,0.9), rgba(0,5,20,0.9))',
            border: '1px solid rgba(255,214,0,0.3)',
            borderRadius: 16,
            padding: 20,
            boxShadow: '0 0 30px rgba(255,214,0,0.05)',
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: '0.7em',
              letterSpacing: 3,
              color: '#ffd600',
              marginBottom: 12,
            }}
          >
            POWER SCORE
          </div>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '2.2em',
              fontWeight: 700,
              color: '#ffd600',
              textShadow: '0 0 20px rgba(255,214,0,0.5)',
              marginBottom: 6,
            }}
          >
            {powerScore.toLocaleString()}
          </div>

          {/* Tier badge */}
          <div
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: 20,
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.85em',
              fontWeight: 700,
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${tierColor}`,
              color: tierColor,
              textShadow: `0 0 10px ${tierColor}`,
              boxShadow: `0 0 15px rgba(0,0,0,0.3)`,
              marginBottom: 12,
            }}
          >
            {tierRank}
          </div>

          {/* Stat rows */}
          {[
            { label: 'LEVEL', value: level },
            { label: 'STREAK', value: `${currentStreak}d 🔥` },
            { label: 'FAITH', value: `${faithScore}%` },
            { label: 'HUSTLE', value: `${hustleScore}%` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                margin: '4px 0',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.5)', fontFamily: "'Share Tech Mono', monospace" }}>
                {label}
              </span>
              <span style={{ fontSize: '1.1em', color: '#00e5a0', fontFamily: "'Share Tech Mono', monospace", fontWeight: 700 }}>
                {value}
              </span>
            </div>
          ))}

          {/* XP Bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', color: 'rgba(255,255,255,0.5)', fontFamily: "'Share Tech Mono', monospace", marginBottom: 6 }}>
              <span>XP PROGRESS</span>
              <span>{totalXP.toLocaleString()} XP</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: 10,
                  background: 'linear-gradient(90deg, #00e5a0, #ffd600)',
                  width: `${xpPercent}%`,
                  boxShadow: '0 0 10px #00e5a0',
                  transition: 'width 0.6s cubic-bezier(.34,1.56,.64,1)',
                  animation: 'xpFill 1s ease-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Transformation Card */}
        <div
          style={{
            background: 'rgba(5,0,15,0.9)',
            border: '1px solid rgba(221,0,255,0.2)',
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel Decorative', cursive",
              fontSize: '0.65em',
              letterSpacing: 3,
              color: '#dd00ff',
              marginBottom: 12,
            }}
          >
            TRANSFORMATION PATH
          </div>
          {TRANSFORMATIONS.map((t) => {
            const isUnlocked = level >= t.level
            const isCurrent = t === currentTransform
            return (
              <div
                key={t.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  borderRadius: 6,
                  margin: '4px 0',
                  fontSize: '0.85em',
                  fontFamily: "'Share Tech Mono', monospace",
                  opacity: isUnlocked ? 1 : 0.35,
                  background: isCurrent ? 'rgba(221,0,255,0.1)' : 'transparent',
                  border: isCurrent ? '1px solid rgba(221,0,255,0.3)' : '1px solid transparent',
                  color: isCurrent ? '#dd00ff' : isUnlocked ? '#ffd600' : 'rgba(255,255,255,0.4)',
                }}
              >
                <span>{t.name}</span>
                <span style={{ fontSize: '0.75em', opacity: 0.7 }}>Lv.{t.level}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
