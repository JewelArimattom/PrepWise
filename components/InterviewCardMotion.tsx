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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      className="card-border card-premium w-[360px] max-sm:w-full min-h-96 group"
    >
      {/* gradient border glow on hover */}
      <div className="card-glow-border" />
      {children}
    </motion.div>
  );
};

export default InterviewCardMotion;
