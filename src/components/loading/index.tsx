import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import dots from "./animations/dots.json";
import photoloading from "./animations/photoLoading.json";
import loading from "./animations/loading.json";

const animations = [photoloading, dots, loading];

const messages = [
  "Preparando a sua imagem",
  "Quase lá...",
  "Só mais um momento ",
];
export default function LoadingPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % animations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-auto my-auto mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-40 h-40"
        >
          <Lottie animationData={animations[index]} loop autoplay />
        </motion.div>
      </AnimatePresence>
      <div className="h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={`message-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-montserrat text-black"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
