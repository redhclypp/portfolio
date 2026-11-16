// @ts-nocheck
/* eslint-disable */
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

const GLTF_PATH = '/assets/kartu.glb'
const BAND_TEXTURE_PATH = '/assets/bandd.png'
useGLTF.preload(GLTF_PATH)
useTexture.preload(BAND_TEXTURE_PATH)

export default function LanyardScene({ photoSrc }: { photoSrc: string }) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 27 }} gl={{ alpha: true }} dpr={[1, 2]}>
      <ambientLight intensity={Math.PI} />
      <Physics key={isMobile ? 'mobile' : 'desktop'} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band photoSrc={photoSrc} isMobile={isMobile} />
      </Physics>
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  )
}

function Band({ maxSpeed = 50, minSpeed = 10, photoSrc, isMobile }) {
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef()
  const lastDragPosition = useRef(new THREE.Vector3())
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3()
  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 4, linearDamping: 4 }
  const { nodes, materials } = useGLTF(GLTF_PATH)
  const bandTexture = useTexture(BAND_TEXTURE_PATH)
  const photoTexture = useTexture(photoSrc)
  const { width, height } = useThree((state) => state.size)
  const [dragged, drag] = useState(false)
  const [hovered, hover] = useState(false)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]))

  photoTexture.colorSpace = THREE.SRGBColorSpace
  photoTexture.minFilter = THREE.LinearFilter
  photoTexture.magFilter = THREE.LinearFilter
  photoTexture.generateMipmaps = true

  const cardGeo = useMemo(() => {
    const geo = nodes.card.geometry.clone()
    geo.computeBoundingBox()
    geo.computeVertexNormals()
    const bb = geo.boundingBox
    const pos = geo.attributes.position
    const norm = geo.attributes.normal
    const uv = new Float32Array(pos.count * 2)
    for (let i = 0; i < pos.count; i++) {
      const x = (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x)
      const y = (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y)
      uv[i * 2] = norm.getZ(i) < -0.1 ? 1 - x : x
      uv[i * 2 + 1] = y
    }
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    return geo
  }, [nodes.card.geometry])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => { document.body.style.cursor = 'auto' }
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      const nextPosition = vec.clone().sub(dragged)
      const movement = nextPosition.clone().sub(lastDragPosition.current)
      card.current?.setNextKinematicTranslation({ x: nextPosition.x, y: nextPosition.y, z: nextPosition.z })
      card.current?.setAngvel({ x: movement.y * 8, y: movement.x * 8, z: -movement.x * 5 })
      lastDragPosition.current.copy(nextPosition)
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const distance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + distance * (maxSpeed - minSpeed)))
      })
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped)
      curve.points[2].copy(j1.current.lerped)
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'
  bandTexture.wrapS = bandTexture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[isMobile ? 0 : 1, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.9, 1.125, 0.01]} />
          <group scale={2.25} position={[0, -1.2, -0.05]} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)} onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))} onPointerDown={(e) => { e.target.setPointerCapture(e.pointerId); lastDragPosition.current.copy(card.current.translation()); drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))) }}>
            <mesh geometry={cardGeo} scale={[1.125, 1, 1]}>
              <meshPhysicalMaterial map={photoTexture} map-anisotropy={16} clearcoat={1} clearcoatRoughness={0.15} roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial color="white" depthTest={false} resolution={[width, height]} useMap map={bandTexture} repeat={[-4, 1]} lineWidth={1} />
      </mesh>
    </>
  )
}
