"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  initial?: HTMLMotionProps<"div">["initial"];
  whileInView?: HTMLMotionProps<"div">["whileInView"];
  viewport?: HTMLMotionProps<"div">["viewport"];
  transition?: HTMLMotionProps<"div">["transition"];
  whileHover?: HTMLMotionProps<"div">["whileHover"];
  whileTap?: HTMLMotionProps<"div">["whileTap"];
  animate?: HTMLMotionProps<"div">["animate"];
}

export function AnimatedSection({
  children,
  className,
  initial,
  whileInView,
  viewport,
  transition,
  whileHover,
  whileTap,
  animate,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
      animate={animate}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedLink({
  href,
  children,
  className,
  whileHover,
  whileTap,
  target,
  rel,
  initial,
  whileInView,
  viewport,
  transition,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  whileHover?: HTMLMotionProps<"a">["whileHover"];
  whileTap?: HTMLMotionProps<"a">["whileTap"];
  target?: string;
  rel?: string;
  initial?: HTMLMotionProps<"a">["initial"];
  whileInView?: HTMLMotionProps<"a">["whileInView"];
  viewport?: HTMLMotionProps<"a">["viewport"];
  transition?: HTMLMotionProps<"a">["transition"];
}) {
  return (
    <motion.a
      href={href}
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      target={target}
      rel={rel}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      transition={transition}
    >
      {children}
    </motion.a>
  );
}
