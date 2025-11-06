import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, Shield, Brain, Lock, TrendingUp } from 'lucide-react';

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
  const features = [
    {
      icon: Brain,
      title: 'Generative AI',
      description: 'Intelligent insights and summaries from medical reports',
      color: 'text-purple-600',
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Hedera Hashgraph ensures immutability and verification',
      color: 'text-blue-600',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Cryptographic hashing without exposing personal data',
      color: 'text-green-600',
    },
    {
      icon: TrendingUp,
      title: 'Traceability',
      description: 'Complete audit trail for all medical records',
      color: 'text-orange-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="border-2 border-blue-200/50 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden card-hover">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-blue-200/30">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-7 w-7 text-blue-600" />
            </motion.div>
            <span className="gradient-text">Platform Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-700 leading-relaxed text-lg"
          >
            Leverages <strong className="text-blue-600">Generative AI</strong> and the <strong className="text-purple-600">Hedera Hashgraph blockchain</strong> to ensure secure, transparent, and intelligent management of medical records.
            Hospitals can upload encrypted clinical reports using secure patient identifiers, while Generative AI provides meaningful insights and summaries for improved understanding.
            Each report is verified through a cryptographic hash recorded on the blockchain, guaranteeing authenticity, immutability, and traceability—without ever exposing personal health information.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="group relative flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                    className={`relative z-10 p-3 rounded-xl ${
                      feature.color === 'text-purple-600' 
                        ? 'bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg shadow-purple-200/50' 
                        : feature.color === 'text-blue-600' 
                        ? 'bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg shadow-blue-200/50'
                        : feature.color === 'text-green-600' 
                        ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-lg shadow-green-200/50'
                        : 'bg-gradient-to-br from-orange-100 to-orange-200 shadow-lg shadow-orange-200/50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </motion.div>
                  <div className="relative z-10 flex-1">
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="grid gap-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-4"
      >
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold gradient-text leading-tight"
          >
            Clinical Registry Secure
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-600 font-medium"
          >
            Secure, AI-powered medical records management with blockchain verification
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="flex gap-3 mt-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-2 w-2 rounded-full bg-blue-600"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-2 w-2 rounded-full bg-purple-600"
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-2 w-2 rounded-full bg-pink-600"
          />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        whileHover={{ scale: 1.01 }}
        className="card-hover"
      >
        <Card className="border-2 border-blue-200/50 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm glow-effect">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-b border-blue-200/30">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-blue-600" />
              </motion.div>
              <span className="gradient-text">A 3D DNA Helix Visualization</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative">
            <div className="h-96 rounded-b-lg overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/50 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
              <Canvas camera={{ position: [2, 2, 3] }} className="w-full h-full">
                <ambientLight intensity={0.6} />
                <directionalLight position={[3, 3, 3]} intensity={0.8} />
                <GlowingDNAHelixWithShield />
                <OrbitControls enablePan={false} />
              </Canvas>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <AboutSection />
    </div>
  );
}


