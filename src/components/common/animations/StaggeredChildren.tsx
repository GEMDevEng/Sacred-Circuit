import React from 'react';
import { motion, Variants } from 'framer-motion';

interface StaggeredChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  initialDelay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: 'some' | 'all' | number;
  };
}

/**
 * StaggeredChildren animation component that animates children with a staggered effect
 */
const StaggeredChildren: React.FC<StaggeredChildrenProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  initialDelay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
  once = true,
  viewport,
}) => {
  // Define animation variants
  const getVariants = (): Variants => {
    // Determine initial position based on direction
    const getInitialPosition = () => {
      switch (direction) {
        case 'up':
          return { opacity: 0, y: distance };
        case 'down':
          return { opacity: 0, y: -distance };
        case 'left':
          return { opacity: 0, x: distance };
        case 'right':
          return { opacity: 0, x: -distance };
        case 'none':
          return { opacity: 0 };
        default:
          return { opacity: 0, y: distance };
      }
    };

    return {
      hidden: {
        ...getInitialPosition(),
      },
      visible: {
        opacity: 1,
        y: direction === 'up' || direction === 'down' ? 0 : undefined,
        x: direction === 'left' || direction === 'right' ? 0 : undefined,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier easing
        },
      },
    };
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: initialDelay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport || { once }}
      variants={containerVariants}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        return (
          <motion.div variants={getVariants()}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StaggeredChildren;
