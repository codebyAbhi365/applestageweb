import React from "react";

export default function StageInfo({ stage }) {
  const info = [
    {
      desc: "Healthy apple — bright red or green skin, no visible spots.",
      tip: "Maintain proper irrigation and pruning.",
    },
    {
      desc: "Early infection — small olive-brown spots appear.",
      tip: "Use fungicide and avoid overwatering.",
    },
    {
      desc: "Advanced infection — dark lesions spread and deform the fruit.",
      tip: "Remove infected fruits and disinfect tools.",
    },
  ];

  return (
    <div className="text-center mt-4 max-w-lg">
      <p className="text-gray-700 text-lg mb-2">{info[stage].desc}</p>
      <p className="text-green-700 font-medium">
        Tip: {info[stage].tip}
      </p>
    </div>
  );
}
