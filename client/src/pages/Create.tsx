import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createVideoRequestSchema, type CreateVideoRequest } from "@shared/schema";
import { useCreateRequest } from "@/hooks/use-requests";
import { HeartParticles } from "@/components/HeartParticles";
import { PremiumButton } from "@/components/PremiumButton";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ArrowLeft, ArrowRight, Heart, Sparkles, Music, Send, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

// Step components
const steps = [
  { id: 1, title: "Détails", icon: Heart },
  { id: 2, title: "Musique", icon: Music },
  { id: 3, title: "Aperçu", icon: Sparkles },
];

export default function Create() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const createMutation = useCreateRequest();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CreateVideoRequest>({
    resolver: zodResolver(createVideoRequestSchema),
    defaultValues: {
      senderName: "",
      receiverName: "",
      message: "",
      music: "romantic",
      // @ts-ignore
      customMusicUrl: "",
    },
  });

  const { watch, setValue, trigger } = form;
  const formData = watch();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    setIsUploading(true);
    try {
      const response = await fetch("/api/upload-music", {
        method: "POST",
        body: uploadFormData,
      });
      if (!response.ok) throw new Error("Envoi échoué");
      const data = await response.json();
      setValue("music", "custom");
      // @ts-ignore
      setValue("customMusicUrl", data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["senderName", "receiverName", "message"]);
      if (isValid) {
        const wordCount = formData.message.trim().split(/\s+/).length;
        if (wordCount > 1000) {
          alert("Le message ne doit pas dépasser 1000 mots.");
          isValid = false;
        }
      }
    } else if (step === 2) {
      isValid = await trigger("music");
    }

    if (isValid) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    try {
      const result = await createMutation.mutateAsync(formData);
      setLocation(`/result/${result.id}`);
    } catch (error) {
      // Error handled by hook toast
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/50 relative flex flex-col">
      <HeartParticles />

      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between z-10 backdrop-blur-sm bg-white/30 sticky top-0">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white">
             <Heart size={16} fill="currentColor" />
           </div>
           <span className="font-serif font-bold text-xl text-rose-900">SendLove</span>
        </div>
        <div className="text-sm font-medium text-rose-800">
          Step {step} of 3
        </div>
      </header>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8 relative z-10 flex flex-col justify-center">
        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="h-1 bg-rose-200 rounded-full w-full overflow-hidden">
            <motion.div 
              className="h-full bg-rose-600 rounded-full"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((s) => (
              <div 
                key={s.id}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors duration-300",
                  step >= s.id ? "text-rose-700" : "text-gray-400"
                )}
              >
                <s.icon size={16} className={step >= s.id ? "text-rose-600" : "text-gray-300"} />
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-rose-900/5 border border-white/60 p-6 md:p-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Pour qui est-ce ?</h2>
                  <p className="text-muted-foreground">Commençons par les bases.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">De la part de</label>
                    <input
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100 outline-none transition-all placeholder:text-gray-400"
                      {...form.register("senderName")}
                    />
                    {form.formState.errors.senderName && <p className="text-red-500 text-xs ml-1">{form.formState.errors.senderName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Pour</label>
                    <input
                      placeholder="Son nom"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100 outline-none transition-all placeholder:text-gray-400"
                      {...form.register("receiverName")}
                    />
                     {form.formState.errors.receiverName && <p className="text-red-500 text-xs ml-1">{form.formState.errors.receiverName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Votre Message (max 1000 mots)</label>
                  <textarea
                    rows={5}
                    placeholder="Écrivez quelque chose qui vient du cœur..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100 outline-none transition-all resize-none placeholder:text-gray-400"
                    {...form.register("message")}
                  />
                  {form.formState.errors.message && <p className="text-red-500 text-xs ml-1">{form.formState.errors.message.message}</p>}
                  <p className="text-right text-xs text-muted-foreground">{formData.message?.trim().split(/\s+/).filter(Boolean).length || 0}/1000 mots</p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Choisissez l'ambiance</h2>
                  <p className="text-muted-foreground">Sélectionnez la musique de fond parfaite.</p>
                </div>

                <div className="space-y-4">
                  <MusicPlayer 
                    title="Soft Acoustic" 
                    src="/music/soft-acoustic.mp3" 
                    isSelected={formData.music === "acoustic"}
                    onSelect={() => setValue("music", "acoustic")}
                  />

                  <div className="pt-4 border-t border-rose-100">
                    <label className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer",
                      formData.music === "custom" ? "bg-rose-50 border-rose-400" : "bg-white border-transparent hover:bg-gray-50"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                          <Upload size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Importer votre musique</p>
                          <p className="text-xs text-muted-foreground">{isUploading ? "Envoi..." : "Fichiers MP3 ou WAV"}</p>
                        </div>
                      </div>
                      <input type="file" className="hidden" accept="audio/*" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Prêt à envoyer ?</h2>
                  <p className="text-muted-foreground">Vérifiez votre message avant de générer la surprise.</p>
                </div>

                <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100 text-center space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-200 via-rose-400 to-rose-200"></div>
                  
                  <p className="text-sm uppercase tracking-widest text-rose-400 font-semibold">Aperçu</p>
                  
                  <div className="font-serif text-2xl text-gray-900">
                    Cher/Chère <span className="text-rose-600 font-semibold">{formData.receiverName}</span>,
                  </div>
                  
                  <p className="font-serif text-lg italic leading-relaxed text-gray-700 max-w-md mx-auto relative z-10">
                    "{formData.message}"
                  </p>
                  
                  <div className="font-serif text-xl text-gray-900 mt-6">
                    Avec tout mon amour,<br/>
                    <span className="font-script text-3xl text-rose-600 block mt-2">{formData.senderName}</span>
                  </div>

                  <Heart className="w-24 h-24 text-rose-100 absolute -bottom-4 -right-4 rotate-12 -z-0" />
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Music size={14} />
                  <span>Sélection : <span className="font-medium text-gray-900 capitalize">{formData.music === "custom" ? "Musique personnalisée" : formData.music}</span></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-2 text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={18} /> Retour
            </button>
          ) : (
            <div /> // Spacer
          )}

          {step < 3 ? (
            <PremiumButton onClick={handleNext} className="pl-6 pr-4">
              Suivant <ArrowRight size={18} className="ml-2" />
            </PremiumButton>
          ) : (
            <PremiumButton 
              onClick={handleSubmit} 
              isLoading={createMutation.isPending}
              className="pl-6 pr-4 shadow-rose-600/30"
            >
              Générer la surprise <Send size={18} className="ml-2" />
            </PremiumButton>
          )}
        </div>
      </main>
    </div>
  );
}
