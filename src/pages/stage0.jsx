import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Leaf, ShieldAlert, ListChecks, Volume2, StopCircle } from "lucide-react";

// 3D Model Component (no changes)
function AppleModel({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={2.5} />;
}

// Main component for the stage page
export default function Stage0() {
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState({ en: null, hi: null, mr: null });

  // Voice-finding logic remains the same
  useEffect(() => {
    const loadAndSetVoices = () => {
      // Use setTimeout to ensure voices are loaded, a common workaround for some browsers
      setTimeout(() => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) {
          return;
        }
        const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));
        const hindiVoice = availableVoices.find(v => v.lang === 'hi-IN');
        const marathiVoice = availableVoices.find(v => v.lang === 'mr-IN');
        setVoices({ en: englishVoice, hi: hindiVoice, mr: marathiVoice });
        console.log("Found voices:", { en: englishVoice, hi: hindiVoice, mr: marathiVoice });
      }, 100);
    };

    window.speechSynthesis.onvoiceschanged = loadAndSetVoices;
    loadAndSetVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  // --- FULLY REVISED handleSpeak FUNCTION ---
  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    // If speaking, stop. If pending, cancel.
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    if (isSpeaking) return; // Prevent multiple clicks while processing

    setIsSpeaking(true);

    // 1. Removed stageTitle from the text to be spoken
    const textToSpeak = `${t('overviewTitle')}. ${t('overviewDesc')}. ${t('preventionTitle')}. ${t('preventionDesc')}. ${t('actionTitle')}. ${t('actionSteps', { returnObjects: true }).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const currentLang = i18n.language;

    // 2. This is the robust logic for mobile devices
    let selectedVoice = null;
    if (currentLang === 'en') selectedVoice = voices.en;
    else if (currentLang === 'hi') selectedVoice = voices.hi;
    else if (currentLang === 'mr') selectedVoice = voices.mr;

    // ALWAYS set the language code. This is the most crucial part for mobile.
    utterance.lang = currentLang;

    // ONLY assign a specific voice if one was successfully found.
    // Otherwise, the mobile OS will use its default voice for the specified language.
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    console.log("Attempting to speak with voice:", utterance.voice ? utterance.voice.name : `OS default for lang '${utterance.lang}'`);
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("Speech synthesis error:", e);
      setIsSpeaking(false);
    };

    synth.speak(utterance);
  };
  
  const modelPath = "/models/apples0.glb";

  return (
     <div className="min-h-screen bg-rose-50 font-sans text-slate-800">
      {/* The rest of your JSX remains the same */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-lg border-b border-rose-100">
        <Link to="/apple-visualizer" className="p-2 rounded-full text-slate-600 hover:bg-rose-100 hover:text-slate-800 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-slate-700">{t('stageTitle')}</h1>
        <div className="w-10"></div>
      </header>
      <main className="px-4 py-6 md:px-6 md:py-8">
        <section className="w-full h-[45vh] md:h-[50vh] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-white p-2 shadow-inner-lg mb-8">
          <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
            <Suspense fallback={null}><Stage environment="city" intensity={0.8}><AppleModel path={modelPath} /></Stage></Suspense>
            <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1.0} />
          </Canvas>
        </section>
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-8 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-100 shadow-sm">
          <div className="flex items-center gap-2">
            {['en', 'hi', 'mr'].map((lang) => (<button key={lang} onClick={() => i18n.changeLanguage(lang)} className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${i18n.language === lang ? 'bg-[#E06B80] text-white shadow-md' : 'bg-white text-slate-600 hover:bg-rose-100'}`}>{lang.toUpperCase()}</button>))}
          </div>
          <button onClick={handleSpeak} className="flex items-center gap-2.5 px-5 py-2 text-sm font-semibold text-white bg-[#E06B80] rounded-full hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50" disabled={isSpeaking}>
            {isSpeaking ? <StopCircle size={18}/> : <Volume2 size={18} />} {isSpeaking ? t('reading') : t('readAloud')}
          </button>
        </section>
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]"><Leaf size={20} /></div><h2 className="text-lg font-bold text-slate-700">{t('overviewTitle')}</h2></div>
            <p className="text-slate-600 leading-relaxed">{t('overviewDesc')}</p>
          </div>
          <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]"><ShieldAlert size={20} /></div><h2 className="text-lg font-bold text-slate-700">{t('preventionTitle')}</h2></div>
            <p className="text-slate-600 leading-relaxed">{t('preventionDesc')}</p>
          </div>
          <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]"><ListChecks size={20} /></div><h2 className="text-lg font-bold text-slate-700">{t('actionTitle')}</h2></div>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              {t('actionSteps', { returnObjects: true }).map((step, index) => (<li key={index}>{step}</li>))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
