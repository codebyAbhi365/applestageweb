import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Leaf,
  ShieldAlert,
  ListChecks,
  Volume2,
  StopCircle,
  Mic,
} from "lucide-react";

// 3D Model Component
function AppleModel({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={2.5} />;
}

export default function Stage0() {
  const { t, i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState({ en: null, hi: null, mr: null });
  const [audio, setAudio] = useState(null);
  const [recognition, setRecognition] = useState(null);

  // 🎤 Load voices and setup recognition
  useEffect(() => {
    const loadAndSetVoices = () => {
      setTimeout(() => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) return;
        const englishVoice = availableVoices.find((v) => v.lang.startsWith("en"));
        const hindiVoice = availableVoices.find((v) => v.lang === "hi-IN");
        const marathiVoice = availableVoices.find((v) => v.lang === "mr-IN");
        setVoices({ en: englishVoice, hi: hindiVoice, mr: marathiVoice });
        console.log("Voices found:", { englishVoice, hindiVoice, marathiVoice });
      }, 100);
    };

    window.speechSynthesis.onvoiceschanged = loadAndSetVoices;
    loadAndSetVoices();

    // 🎙️ Setup speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-IN";

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("User said:", transcript);
        handleVoiceCommand(transcript);
      };

      recog.onend = () => setIsListening(false);
      setRecognition(recog);
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }

    return () => {
      window.speechSynthesis.cancel();
      if (audio) audio.pause();
    };
  }, [audio]);

  // 🔊 Speak helper
  const speak = (text) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();

    const currentLang = i18n.language;
    let selectedVoice =
      currentLang === "en"
        ? voices.en
        : currentLang === "hi"
        ? voices.hi
        : voices.mr;

    // Fallback to Google Translate TTS if regional voice not available
    if ((currentLang === "hi" || currentLang === "mr") && !selectedVoice) {
      const langCode = currentLang === "hi" ? "hi-IN" : "mr-IN";
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${langCode}&client=tw-ob`;

      const newAudio = new Audio(ttsUrl);
      setAudio(newAudio);
      setIsSpeaking(true);
      newAudio.play();

      newAudio.onended = () => {
        setIsSpeaking(false);
        setAudio(null);
      };
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utterance);
  };

  // 🧠 Handle speech commands
  const handleVoiceCommand = (command) => {
    if (command.includes("overview")) {
      speak(`${t("overviewTitle")}. ${t("overviewDesc")}`);
    } else if (command.includes("prevention")) {
      speak(`${t("preventionTitle")}. ${t("preventionDesc")}`);
    } else if (command.includes("action")) {
      speak(
        `${t("actionTitle")}. ${t("actionSteps", { returnObjects: true }).join(". ")}`
      );
    } else if (command.includes("stop")) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speak("Stopped reading.");
    } else if (command.includes("read all")) {
      handleSpeak();
    } else {
      speak("Sorry, I didn't understand that command.");
    }
  };

  // 🔁 Read full content
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${t("overviewTitle")}. ${t("overviewDesc")}. ${t(
      "preventionTitle"
    )}. ${t("preventionDesc")}. ${t("actionTitle")}. ${t("actionSteps", {
      returnObjects: true,
    }).join(". ")}`;

    speak(textToSpeak);
  };

  // 🎤 Start listening to voice
  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
      speak("Listening for your command.");
    }
  };

  const modelPath = "/models/apples0.glb";

  return (
    <div className="min-h-screen bg-rose-50 font-sans text-slate-800">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/80 backdrop-blur-lg border-b border-rose-100">
        <Link
          to="/apple-visualizer"
          className="p-2 rounded-full text-slate-600 hover:bg-rose-100 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-lg font-bold text-slate-700">{t("stageTitle")}</h1>
        <div className="w-10"></div>
      </header>

      <main className="px-4 py-6 md:px-6 md:py-8">
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

        <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 mb-8 bg-white/80 backdrop-blur-md rounded-2xl border border-rose-100 shadow-sm">
          <div className="flex items-center gap-2">
            {["en", "hi", "mr"].map((lang) => (
              <button
                key={lang}
                onClick={() => i18n.changeLanguage(lang)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  i18n.language === lang
                    ? "bg-[#E06B80] text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-rose-100"
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startListening}
              className={`flex items-center gap-2.5 px-5 py-2 text-sm font-semibold rounded-full text-white shadow-lg transition-all ${
                isListening ? "bg-green-600" : "bg-blue-600 hover:opacity-90"
              }`}
              disabled={isListening}
            >
              <Mic size={18} /> {isListening ? "Listening..." : "Voice Command"}
            </button>

            <button
              onClick={handleSpeak}
              className="flex items-center gap-2.5 px-5 py-2 text-sm font-semibold text-white bg-[#E06B80] rounded-full hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
              disabled={isSpeaking}
            >
              {isSpeaking ? <StopCircle size={18} /> : <Volume2 size={18} />}{" "}
              {isSpeaking ? t("reading") : t("readAloud")}
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]">
                <Leaf size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-700">
                {t("overviewTitle")}
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{t("overviewDesc")}</p>
          </div>

          <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]">
                <ShieldAlert size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-700">
                {t("preventionTitle")}
              </h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {t("preventionDesc")}
            </p>
          </div>

          <div className="p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-rose-100 rounded-full text-[#E06B80]">
                <ListChecks size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-700">
                {t("actionTitle")}
              </h2>
            </div>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              {t("actionSteps", { returnObjects: true }).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

