import { motion } from 'framer-motion';

export const GradientWaveBackground = () => {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          LIGHT MODE - Subtle Pastel Ambient Gradients
      ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 dark:hidden block">
        {/* Soft blue gradient - top right */}
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-[60%] h-[50%]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.25) 0%, rgba(196, 181, 253, 0.15) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Soft violet gradient - bottom left */}
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[45%]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(196, 181, 253, 0.2) 0%, rgba(165, 243, 252, 0.12) 50%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, 15, 0],
            y: [0, -10, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />
        
        {/* Soft cyan accent - center right */}
        <motion.div
          className="absolute top-1/3 -right-1/6 w-[35%] h-[30%]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(165, 243, 252, 0.18) 0%, rgba(147, 197, 253, 0.1) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -10, 5, 0],
            y: [0, 10, -5, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DARK MODE - Immersive Gradient Waves
      ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 dark:block hidden">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d20] to-[#0a0a1a]" />
        
        {/* Animated gradient wave 1 - Blue to Purple */}
        <motion.div
          className="absolute -bottom-1/2 -left-1/4 w-[150%] h-[100%] opacity-60"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.3) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Animated gradient wave 2 - Purple to Cyan */}
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-[120%] h-[80%] opacity-50"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.35) 0%, rgba(6, 182, 212, 0.25) 50%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        
        {/* Animated gradient wave 3 - Cyan accent */}
        <motion.div
          className="absolute bottom-0 left-1/4 w-[60%] h-[50%] opacity-40"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        
        {/* Subtle noise overlay for texture */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </>
  );
};
