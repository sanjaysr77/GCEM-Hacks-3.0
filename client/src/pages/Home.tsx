import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function GlowingDNAHelixWithShield() {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  const { helixA, helixB, rungs } = useMemo(() => {
    const radius = 0.6;
    const pitch = 0.35; // vertical distance per 2π
    const turns = 6; // number of turns in the helix
    const tubularSegments = 600;
    const strandRadius = 0.06;
    const radialSegments = 16;

    const makeHelixCurve = (phase: number) => {
      const points: THREE.Vector3[] = [];
      const steps = turns * 200;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * (turns * Math.PI * 2);
        const x = radius * Math.cos(t + phase);
        const z = radius * Math.sin(t + phase);
        const y = (t / (Math.PI * 2) - turns / 2) * pitch * 2;
        points.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      return new THREE.TubeGeometry(curve, tubularSegments, strandRadius, radialSegments, false);
    };

    const rungPairs: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    const rungCount = turns * 16;
    for (let i = 0; i <= rungCount; i++) {
      const t = (i / rungCount) * (turns * Math.PI * 2);
      const y = (t / (Math.PI * 2) - turns / 2) * pitch * 2;
      const a = new THREE.Vector3(
        radius * Math.cos(t),
        y,
        radius * Math.sin(t)
      );
      const b = new THREE.Vector3(
        radius * Math.cos(t + Math.PI),
        y,
        radius * Math.sin(t + Math.PI)
      );
      rungPairs.push({ start: a, end: b });
    }

    return {
      helixA: makeHelixCurve(0),
      helixB: makeHelixCurve(Math.PI),
      rungs: rungPairs,
    };
  }, []);

  const strandMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#22d3ee'),
        emissive: new THREE.Color('#0ea5b7'),
        emissiveIntensity: 1.5,
        metalness: 0.2,
        roughness: 0.3,
      }),
    []
  );

  const rungMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#60a5fa'),
        emissive: new THREE.Color('#3b82f6'),
        emissiveIntensity: 1.2,
        metalness: 0.1,
        roughness: 0.4,
      }),
    []
  );

  const shieldMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#93c5fd'),
        transmission: 0.9, // glass-like transparency
        thickness: 0.5,
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.6,
      }),
    []
  );

  return (
    <group ref={groupRef}>
      {/* DNA strands */}
      <mesh geometry={helixA} material={strandMaterial} />
      <mesh geometry={helixB} material={strandMaterial} />

      {/* Base-pair rungs */}
      {rungs.map(({ start, end }, idx) => {
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const axis = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(axis, dir.clone().normalize());
        return (
          <mesh key={idx} position={mid} quaternion={quat} material={rungMaterial}>
            <cylinderGeometry args={[0.025, 0.025, len, 12]} />
          </mesh>
        );
      })}

      {/* Shield (glass sphere) */}
      <mesh material={shieldMaterial}>
        <sphereGeometry args={[1.25, 64, 64]} />
      </mesh>

      {/* Accent point light for glow */}
      <pointLight position={[0, 0, 0]} intensity={1.2} color={'#a5f3fc'} distance={6} />
    </group>
  );
}

function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Leverages Generative AI and the Hedera Hashgraph blockchain to ensure secure, transparent, and intelligent management of medical records.
Hospitals can upload encrypted clinical reports using secure patient identifiers, while Generative AI provides meaningful insights and summaries for improved understanding.
Each report is verified through a cryptographic hash recorded on the blockchain, guaranteeing authenticity, immutability, and traceability—without ever exposing personal health information.</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Home</h1>
          <p className="text-slate-700">Welcome.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded border overflow-hidden">
            <Canvas camera={{ position: [2, 2, 3] }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 3, 3]} intensity={0.8} />
              <GlowingDNAHelixWithShield />
              <OrbitControls enablePan={false} />
            </Canvas>
          </div>
        </CardContent>
      </Card>
      <AboutSection />
    </div>
  );
}


