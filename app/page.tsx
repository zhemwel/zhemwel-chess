"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic
import { OrbitControls } from "@react-three/drei";
import ChessGame from "@/components/chess-game";
import { Card } from "@/components/ui/card";

// Dynamically import Canvas with ssr: false
const DynamicCanvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-gray-200">
        <p>Loading 3D scene...</p>
      </div>
    ),
  }
);

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
}

export default function Home() {
  const [gameKey, setGameKey] = useState(0);

  const restartGame = () => {
    setGameKey((prev) => prev + 1);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-b from-blue-100 via-blue-200 to-blue-300">
      <div className="absolute top-4 left-4 z-10">
        <Card className="p-4 bg-white/80 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sky Chess</h1>
          <p className="text-sm text-gray-600 mb-2">
            Click white pieces to move. AI plays black.
          </p>
          <p className="text-xs text-gray-500">
            Capture the enemy king to win!
          </p>
        </Card>
      </div>

      <DynamicCanvas
        camera={{ position: [8, 8, 8], fov: 60 }}
        className="w-full h-full"
        gl={{ antialias: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Soft lighting for cloud environment */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.3}
            color="#87ceeb"
          />

          {/* Chess Game - Pass restartGame function and use key for full reset */}
          <ChessGame key={gameKey} onRestartGame={restartGame} />

          {/* Camera Controls - disable right-click panning */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={25}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </DynamicCanvas>
    </div>
  );
}
