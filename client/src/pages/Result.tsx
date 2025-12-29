import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { useRequestStatus, useRequest } from "@/hooks/use-requests";
import { PremiumButton } from "@/components/PremiumButton";
import { HeartParticles } from "@/components/HeartParticles";
import confetti from "canvas-confetti";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Loader2, Download, Share2, AlertCircle, Sparkles, Heart, Star, Music } from "lucide-react";
import { api } from "@shared/routes";

export default function Result() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: request, error: loadError } = useRequest(id || "");
  const { data: statusData } = useRequestStatus(id || "");
  
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFinalCta, setShowFinalCta] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (statusData?.status === "completed") {
      setIsCompleted(true);
      const duration = 15000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#ffccd5', '#e11d48', '#fbbf24', '#ff0080']
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#ffccd5', '#e11d48', '#fbbf24', '#ff0080']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [statusData?.status]);

  const musicUrls: Record<string, string> = {
    romantic: "/music/soft-acoustic.mp3",
    acoustic: "/music/soft-acoustic.mp3",
    cinematic: "/music/soft-acoustic.mp3",
  };

  const audioUrl = request?.music === "custom" ? request.customMusicUrl : musicUrls[request?.music || "romantic"];

  const phrases = useMemo(() => {
    if (!request?.message) return [];
    // Support multi-line messages and handle splitting more robustly
    // Replace newlines with full stops to treat them as distinct phrases if they don't have punctuation
    const text = request.message.replace(/\n+/g, ". ");
    const matches = text.match(/[^.!?]+[.!?]*/g);
    return matches ? matches.map(m => m.trim()).filter(Boolean) : [text.trim()];
  }, [request?.message]);

  useEffect(() => {
    if (isCompleted && !isStopped && phraseIndex < phrases.length) {
      const currentPhrase = phrases[phraseIndex];
      let charIndex = 0;
      const timer = setInterval(() => {
        if (charIndex <= currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            if (!isStopped) {
              if (phraseIndex < phrases.length - 1) {
                setPhraseIndex(prev => prev + 1);
                setDisplayText("");
              } else {
                setShowFinalCta(true);
              }
            }
          }, 3500);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isCompleted, isStopped, phraseIndex, phrases]);

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
         <div className="text-center space-y-4">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
           <h2 className="text-xl font-bold text-gray-900">Demande non trouvée</h2>
           <PremiumButton onClick={() => setLocation("/")} variant="outline">Retour</PremiumButton>
         </div>
      </div>
    );
  }

  const isProcessing = !statusData || statusData.status === "pending" || statusData.status === "processing";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5f7] relative overflow-hidden px-4 selection:bg-rose-200">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,182,193,0.1)_0%,_transparent_100%)] animate-pulse" />
      
      {isCompleted && <HeartParticles />}
      {isCompleted && audioUrl && !isStopped && (
        <audio 
          src={audioUrl} 
          autoPlay 
          loop 
          onError={(e) => console.error("Audio playback error:", e)}
          onCanPlayThrough={(e) => {
            const audio = e.currentTarget;
            audio.play().catch(err => {
              console.log("Autoplay blocked, waiting for interaction", err);
            });
          }}
        />
      )}

      <main className="w-full max-w-5xl container mx-auto px-4 py-12 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {isProcessing && !isCompleted ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8"
            >
              <div className="relative">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="text-rose-500 mb-4 flex justify-center drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                >
                  <Heart size={80} fill="currentColor" />
                </motion.div>
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center text-white"
                >
                  <Sparkles size={32} />
                </motion.div>
              </div>
              <h2 className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-500 animate-pulse">
                On prépare votre dose d'amour...
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              {/* Floating Header */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mb-16 text-center"
              >
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 backdrop-blur-md border border-rose-100 shadow-sm mb-6">
                  <Star className="w-4 h-4 text-rose-400 fill-rose-400 animate-spin-slow" />
                  <span className="text-rose-900 font-serif font-medium tracking-wide">Un moment magique</span>
                  <Star className="w-4 h-4 text-rose-400 fill-rose-400 animate-spin-slow" />
                </div>
                <h1 className="text-rose-900 font-serif text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  De <span className="text-rose-600 italic underline decoration-rose-200 decoration-wavy underline-offset-8">{request?.senderName}</span> <br className="md:hidden" /> pour <span className="text-rose-600 italic underline decoration-rose-200 decoration-wavy underline-offset-8">{request?.receiverName}</span>
                </h1>
              </motion.div>

              {/* Central Message Area */}
              <div className="relative w-full min-h-[400px] flex items-center justify-center">
                {/* Decorative Elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                   <div className="w-[500px] h-[500px] rounded-full bg-rose-200 blur-[100px] animate-pulse" />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={phraseIndex}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(15px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(15px)" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative z-20 text-center max-w-4xl"
                  >
                    <p className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 italic font-medium leading-[1.3] md:leading-[1.2] tracking-tight drop-shadow-sm">
                      <span className="bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
                        {displayText}
                      </span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="inline-block w-1.5 h-16 bg-rose-400/80 ml-4 align-middle rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                      />
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons - Reveal at end or show stop button */}
              <div className="mt-16 flex flex-col items-center gap-6">
                {!showFinalCta && !isStopped && (
                  <PremiumButton 
                    variant="outline"
                    onClick={() => {
                      setIsStopped(true);
                      setShowFinalCta(true);
                    }}
                    className="px-8 bg-white/50 backdrop-blur-sm border-rose-200 text-rose-900"
                  >
                    Arrêter
                  </PremiumButton>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: showFinalCta ? 1 : 0, y: showFinalCta ? 0 : 30 }}
                  className="flex flex-wrap justify-center gap-6"
                >
                  <PremiumButton 
                    onClick={() => window.print()} 
                    className="px-10 py-6 text-lg bg-rose-600 hover:bg-rose-700 shadow-xl shadow-rose-200 transform hover:scale-105 transition-all"
                  >
                    <Download className="mr-3" size={24} /> Immortatiser ce message
                  </PremiumButton>
                  <PremiumButton 
                    variant="outline" 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Une surprise romantique pour toi',
                          text: `Regarde ce que ${request?.senderName} t'a envoyé`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Lien magique copié ! 💖");
                      }
                    }}
                    className="px-10 py-6 text-lg bg-white/80 backdrop-blur-xl border-rose-200 text-rose-900 hover:bg-white shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Share2 className="mr-3" size={24} /> Partager l'amour
                  </PremiumButton>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Immersive Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              color: `rgba(255, ${150 + Math.random() * 100}, ${150 + Math.random() * 100}, ${0.1 + Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ 
              y: "110vh",
              scale: 0.2 + Math.random() * 0.8,
              rotate: 0 
            }}
            animate={{ 
              y: "-10vh",
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
            }}
            transition={{ 
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 15
            }}
          >
            {Math.random() > 0.3 ? <Heart fill="currentColor" size={20 + Math.random() * 60} /> : <Star fill="currentColor" size={15 + Math.random() * 40} />}
          </motion.div>
        ))}
      </div>

      {/* Bottom Gradient Wash */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-0" />
    </div>
  );
}
