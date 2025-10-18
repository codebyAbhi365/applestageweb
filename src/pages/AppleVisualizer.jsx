import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, ShieldAlert, Biohazard, Skull, HeartPulse } from "lucide-react";

// Updated stages array with icons, new subtitles, and consistent color classes
const stages = [
  { id: 0, name: "Stage 0", subtitle: "Healthy Apple", Icon: HeartPulse, color: "text-green-500", bgColor: "bg-green-500" },
  { id: 1, name: "Stage 1", subtitle: "Early Infection", Icon: CheckCircle2, color: "text-yellow-500", bgColor: "bg-yellow-500" },
  { id: 2, name: "Stage 2", subtitle: "Mild Infection", Icon: AlertCircle, color: "text-blue-500", bgColor: "bg-blue-500" },
  { id: 3, name: "Stage 3", subtitle: "Moderate Infection", Icon: ShieldAlert, color: "text-orange-500", bgColor: "bg-orange-500" },
  { id: 4, name: "Stage 4", subtitle: "Heavy Infection", Icon: Biohazard, color: "text-red-500", bgColor: "bg-red-500" },
  { id: 5, name: "Stage 5", subtitle: "Severe Infection", Icon: Skull, color: "text-purple-500", bgColor: "bg-purple-500" },
];

export default function AppleStageChecker() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-rose-50">
      {/* Header */}
      <div className="text-center p-8 bg-gradient-to-b from-[#E06B80] to-[#c95f74]">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Apple Disease Visualizer</h1>
        <p className="text-lg text-rose-100">Follow the journey of an apple from healthy to infected.</p>
      </div>

      {/* Timeline Section */}
      <div className="relative p-8">
        {/* The vertical timeline line */}
        <div className="absolute left-1/2 -ml-[2px] top-0 h-full w-1 bg-rose-200"></div>

        <div className="space-y-12">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className="relative flex items-center cursor-pointer group"
              onClick={() => navigate(`/stage/${stage.id}`)}
            >
              {/* Timeline Dot */}
              <div className={`absolute left-1/2 -ml-4 w-8 h-8 rounded-full ${stage.bgColor} border-4 border-rose-100 shadow-md flex items-center justify-center`}>
                <stage.Icon size={16} className="text-white" />
              </div>

              {/* Card */}
              <div className={`w-[calc(50%-2rem)] p-5 rounded-2xl bg-white/70 backdrop-blur-md border border-rose-100 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 group-hover:!bg-white ${
                  index % 2 === 0 ? 'mr-auto text-right' : 'ml-auto text-left'
                }`}
              >
                <p className={`font-bold text-sm ${stage.color}`}>{stage.name}</p>
                <h3 className="text-xl font-bold tracking-tight text-slate-800">{stage.subtitle}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Instruction Card */}
       <div className="p-8">
         <div className="w-full max-w-2xl p-6 mx-auto text-center bg-white border shadow-lg rounded-2xl border-rose-100">
           <h2 className="text-xl font-bold text-[#E06B80] mb-3">How It Works</h2>
           <p className="text-md text-slate-600">
             Click on any stage in the timeline above to see a detailed 3D model, learn about the causes, and discover organic remedies to protect your apples.
           </p>
         </div>
       </div>
    </div>
  );
}
