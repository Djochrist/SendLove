import { Link } from "wouter";
import { HeartParticles } from "@/components/HeartParticles";
import { PremiumButton } from "@/components/PremiumButton";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-rose-50 to-white px-4">
      <HeartParticles />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center z-10 max-w-2xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center justify-center p-3 bg-white/50 backdrop-blur-sm rounded-full shadow-sm mb-4 border border-rose-100">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 mr-2 animate-pulse" />
          <span className="text-sm font-medium text-rose-800 tracking-wide uppercase">The perfect digital gift</span>
        </div>

        <h1 className="font-serif text-6xl md:text-8xl font-bold text-foreground leading-tight">
          Send<span className="text-rose-600 font-script text-7xl md:text-9xl ml-2">Love</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
          Create a personalized, cinematic video message for your special someone. 
          Beautifully animated, instantly generated, forever cherished.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/create">
            <PremiumButton className="px-10 py-4 text-lg w-full sm:w-auto">
              Create My Video
            </PremiumButton>
          </Link>
          
          <button className="text-rose-800 hover:text-rose-600 font-medium text-sm transition-colors py-2 border-b border-transparent hover:border-rose-300">
            View Sample
          </button>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      
      {/* Decorative Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
    </div>
  );
}
