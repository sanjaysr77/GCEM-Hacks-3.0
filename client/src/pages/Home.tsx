import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function SpinningBox() {
  const ref = useRef<any>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.8;
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#60a5fa" />
    </mesh>
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
        <div className="flex gap-2">
          <Button asChild variant="secondary"><Link to="/reports">View Reports</Link></Button>
          <Button asChild><Link to="/upload">Upload Report</Link></Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>3D Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded border overflow-hidden">
            <Canvas camera={{ position: [2, 2, 3] }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[3, 3, 3]} intensity={0.8} />
              <SpinningBox />
              <OrbitControls enablePan={false} />
            </Canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


