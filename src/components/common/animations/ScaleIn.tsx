import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface ScaleInProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  initialScale?: number;
  once?: boolean;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: 'some' | 'all' | number;
  };
}

/**
 * ScaleIn animation component that animates children with a scale effect
 */
const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  initialScale = 0.95,
  once = true,
  viewport,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier easing
      }}
      viewport={viewport || { once }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
