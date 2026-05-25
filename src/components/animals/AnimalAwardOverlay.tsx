import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface AnimalAwardOverlayProps {
  animal: string | null
  onDismiss: () => void
}

export function AnimalAwardOverlay({ animal, onDismiss }: AnimalAwardOverlayProps) {
  return (
    <AnimatePresence>
      {animal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-indigo-600/90 backdrop-blur-sm"
        >
          {/* Confetti dots */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: ['#fbbf24','#f87171','#34d399','#60a5fa','#a78bfa','#f472b6'][i % 6],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0, y: 0 }}
              animate={{ scale: [0, 1, 0.8], y: [-20, 20, 100], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: i * 0.05, ease: 'easeOut' }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
            className="text-[8rem] leading-none select-none"
          >
            {animal}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white mt-4 space-y-2"
          >
            <p className="text-2xl font-bold">Új állat a gyűjteménybe!</p>
            <p className="text-lg opacity-80">Gyere vissza holnap egy újért 🌟</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <Button
              variant="secondary"
              size="lg"
              onClick={onDismiss}
              className="bg-white/20 text-white hover:bg-white/30 border-white/30"
            >
              Hurrá! 🎊
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
