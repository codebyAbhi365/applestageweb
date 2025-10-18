export default function AppleAR() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-green-50 py-6 px-3 gap-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        🍎 Apple AR Viewer
      </h1>

      <model-viewer
        src="/models/apples0.glb"
        alt="3D Apple"
        ar
        ar-modes="scene-viewer quick-look webxr"
        camera-controls
        auto-rotate
        style={{ width: "100%", maxWidth: "500px", height: "400px", borderRadius: "12px" }}
      ></model-viewer>

      <p className="text-center max-w-md text-gray-700">
        Point your mobile camera to place the apple in the real world.
      </p>
    </div>
  );
}
