import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Leaf, ShieldAlert, ListChecks, Volume2, StopCircle } from "lucide-react";

// 3D Model Component - Adjusted for better lighting in the new scene
function AppleModel({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={2.5} />;
}

// Main component for the stage page
export default function Stage0() {
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState({ en: null, hi: null, mr: null });

  // Voice loading logic remains the same
  useEffect(() => {
    const loadAndSetVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        const englishVoice = availableVoices.find(v => v.name === "Microsoft Heera - English (India)");
        const hindiVoice = availableVoices.find(v => v.name === 'Microsoft Swara Online (Natural) - Hindi (India)');
        const marathiVoice = availableVoices.find(v => v.name === 'Microsoft Manohar Online (Natural) - Marathi (India)');
        setVoices({ en: englishVoice, hi: hindiVoice, mr: marathiVoice });
      }
    };
    window.speechSynthesis.onvoiceschanged = loadAndSetVoices;
    loadAndSetVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  // Speech handling logic remains the same
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = `${t('overviewTitle')}. ${t('overviewDesc')}. ${t('preventionTitle')}. ${t('preventionDesc')}. ${t('actionTitle')}. ${t('actionSteps', { returnObjects: true }).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const currentLang = i18n.language;
    if (currentLang === 'en' && voices.en) utterance.voice = voices.en;
    else if (currentLang === 'hi' && voices.hi) utterance.voice = voices.hi;
    else if (currentLang === 'mr' && voices.mr) utterance.voice = voices.mr;
    else utterance.lang = currentLang;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const modelPath = "/models/apples0.glb";

  return (
    <div className="min-h-screen font-sans bg-rose-50 text-slate-800">
      {/* --- Glassmorphism Header --- */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-lg border-rose-100">
        <Link to="/apple-visualizer" className="p-2 transition-colors rounded-full text-slate-600 hover:bg-rose-100 hover:text-slate-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-slate-700">
          {t('stageTitle')}
        </h1>
        {/* Spacer to keep title centered */}
        <div className="w-10"></div>
      </header>

      <main className="px-4 py-6 md:px-6 md:py-8">
        {/* --- Enlarged 3D Model Hero Section --- */}
        <section className="w-full h-[45vh] md:h-[50vh] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-white p-2 shadow-inner-lg mb-8">
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.8}>
                 <AppleModel path={modelPath} />
              </Stage>
            </Suspense>
            <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1.0} />
          </Canvas>
        </section>

        {/* --- Controls Section --- */}
        <section className="flex flex-col items-center justify-between gap-4 p-4 mb-8 border shadow-sm sm:flex-row bg-white/80 backdrop-blur-md rounded-2xl border-rose-100">
          <div className="flex items-center gap-2">
            {['en', 'hi', 'mr'].map((lang) => (
              <button 
                key={lang}
                onClick={() => i18n.changeLanguage(lang)} 
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${i18n.language === lang ? 'bg-[#E06B80] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-rose-100'}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <button onClick={handleSpeak} className="flex items-center gap-2.5 px-5 py-2 text-sm font-semibold text-white bg-[#E06B80] rounded-full hover:opacity-90 transition-opacity shadow-lg">
            {isSpeaking ? <StopCircle size={18}/> : <Volume2 size={18} />}
            {isSpeaking ? t('reading') : t('readAloud')}
          </button>
        </section>

        {/* --- Information Cards Section --- */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1: Overview */}
          <div className="p-5 border bg-white/70 backdrop-blur-md rounded-2xl border-rose-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]">
                <Leaf size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-700">{t('overviewTitle')}</h2>
            </div>
            <p className="leading-relaxed text-slate-600">{t('overviewDesc')}</p>
          </div>

          {/* Card 2: Prevention */}
          <div className="p-5 border bg-white/70 backdrop-blur-md rounded-2xl border-rose-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]">
                <ShieldAlert size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-700">{t('preventionTitle')}</h2>
            </div>
            <p className="leading-relaxed text-slate-600">{t('preventionDesc')}</p>
          </div>

          {/* Card 3: Action Plan */}
          <div className="p-5 border bg-white/70 backdrop-blur-md rounded-2xl border-rose-100">
            <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]">
                <ListChecks size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-700">{t('actionTitle')}</h2>
            </div>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              {t('actionSteps', { returnObjects: true }).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}


