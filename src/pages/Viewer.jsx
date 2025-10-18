import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import StageInfo from "./StageInfo";

function AppleModel({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} scale={2} />;
}

export default function Viewer() {
  const [stage, setStage] = useState(0);
  const models = [
    "/models/apples0.glb",
    "/models/apples1.glb",
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-green-50">
      <h2 className="text-2xl font-semibold my-4 text-green-800">
        Disease Progression Stage {stage}
      </h2>

      <div className="w-full h-[400px] bg-white shadow-lg rounded-lg">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 3, 3]} />
          <Suspense fallback={null}>
            <AppleModel modelPath={models[stage]} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>

      <div className="flex gap-4 my-4">
        {models.map((_, i) => (
          <button
            key={i}
            onClick={() => setStage(i)}
            className={`px-4 py-2 rounded-lg ${
              stage === i ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Stage {i}
          </button>
        ))}
      </div>

      <StageInfo stage={stage} />
    </div>
  );
}
