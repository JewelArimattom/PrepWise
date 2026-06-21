"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const InterviewCardMotion = ({
  children,
  index = 0,
}: {
  children: ReactNode;
  index?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      }}
      className="w-[300px] sm:w-[340px] shrink-0 h-full group cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

export default InterviewCardMotion;
