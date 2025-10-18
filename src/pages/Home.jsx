import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-b from-green-100 to-white">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        Apple Disease Learning Portal
      </h1>
      <p className="text-lg mb-6 text-center max-w-xl">
        Understand how apple diseases progress visually — from healthy fruit to infected stages.
      </p>
      <Link to="/visualizer">
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
          Explore Disease Stages
        </button>
      </Link>
    </div>
  );
}
