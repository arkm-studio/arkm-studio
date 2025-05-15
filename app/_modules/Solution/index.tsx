"use client";

import React, { useRef, useState, useEffect, Suspense, lazy } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import classNames from "classnames/bind";
import SolutionCardExpandable from "@/app/_components/SolutionCard/SolutionCardExpandable";
import styles from "./Solution.module.scss";

const cx = classNames.bind(styles);

const LazyLandingWireframe = lazy(
  () => import("@/app/_components/animations/LandingWireframe")
);
const LazyCodeEditorAnimation = lazy(
  () => import("@/app/_components/animations/CodeEditorAnimation")
);

const AnimationWrapper = ({
  animationComponentName,
}: {
  animationComponentName: string;
}) => {
  const AnimationComponent =
    animationComponentName === "CodeEditorAnimation"
      ? LazyCodeEditorAnimation
      : LazyLandingWireframe;

  return (
    <Suspense fallback={<div className={cx("animation-placeholder")} />}>
      <AnimationComponent />
    </Suspense>
  );
};

// Hook personalizado para detectar breakpoints
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isAdaptive: false,
  });

  useEffect(() => {
    const MOBILE_BREAKPOINT = 768;
    const ADAPTIVE_BREAKPOINT = 830;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      setBreakpoint({
        isMobile: width <= MOBILE_BREAKPOINT,
        isAdaptive: width <= ADAPTIVE_BREAKPOINT && width > MOBILE_BREAKPOINT,
      });
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};

// Configuraciones de animación
const animationConfig = {
  initial: {
    opacity: 0,
    y: 40,
    rotateX: 5,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
  },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.25, 0.25, 1], // Custom easing similar to power3.out
    staggerChildren: 0.1,
  },
};

const floatingElementVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const connectorVariants = {
  initial: {
    opacity: 0,
    scaleX: 0,
    originX: 0,
  },
  animate: {
    opacity: 0.7,
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Solution = ({
  solution,
  solutionNumber,
  layout = "card-left",
  animationComponentName,
}: {
  solution: any;
  solutionNumber: number;
  layout?: "card-left" | "card-right";
  animationComponentName: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, isAdaptive } = useBreakpoint();

  // Para las animaciones de parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Detectar cuando el elemento está en vista
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  // Crear spring animations para parallax más suave
  const cardParallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -40]),
    { damping: 20, stiffness: 100 }
  );

  const wireframeParallaxY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -40]),
    { damping: 20, stiffness: 100 }
  );

  // Parallax horizontal y rotación basado en layout
  const parallaxMultiplier = layout === "card-left" ? 1 : -1;

  const cardParallaxX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 15 * parallaxMultiplier]),
    { damping: 20, stiffness: 100 }
  );

  const wireframeParallaxX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -15 * parallaxMultiplier]),
    { damping: 20, stiffness: 100 }
  );

  const cardRotateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 3 * parallaxMultiplier]),
    { damping: 30, stiffness: 120 }
  );

  const wireframeRotateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -4 * parallaxMultiplier]),
    { damping: 30, stiffness: 120 }
  );

  // Efecto de escala y brillo basado en posición en viewport
  const centerProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scale = useSpring(useTransform(centerProgress, [0, 1], [1, 1.03]), {
    damping: 25,
    stiffness: 150,
  });

  const brightness = useSpring(
    useTransform(centerProgress, [0, 1], [1, 1.07]),
    { damping: 25, stiffness: 150 }
  );

  // Configurar timing de animaciones en cascada
  const getStaggeredDelay = (isFirst: boolean) => {
    if (isMobile) return 0;
    if (isAdaptive) return isFirst ? 0 : 0.8;
    return isFirst ? 0 : 0.4;
  };

  const isCardFirst = layout === "card-left";

  return (
    <motion.div
      ref={containerRef}
      className={cx("solution", `solution--${layout}`, {
        "solution--mobile": isMobile,
        "solution--adaptive": isAdaptive,
      })}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={{
        initial: { opacity: 0 },
        animate: {
          opacity: 1,
          transition: {
            duration: 0.3,
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {/* Elementos decorativos - solo en modo normal */}
      <AnimatePresence>
        {!isMobile && !isAdaptive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Elementos flotantes */}
            {[1, 2, 3, 4].map((num) => (
              <motion.div
                key={`float-${num}`}
                className={cx(
                  "solution__floating-element",
                  `solution__floating-element--${num}`
                )}
                variants={floatingElementVariants}
                custom={num}
                transition={{ delay: num * 0.05 }}
              />
            ))}

            {/* Conectores */}
            {["horizontal", "diagonal-1", "diagonal-2"].map((type, index) => (
              <motion.div
                key={`connector-${type}`}
                className={cx(
                  "solution__connector",
                  `solution__connector--${type}`
                )}
                variants={connectorVariants}
                transition={{ delay: index * 0.03 }}
              />
            ))}

            {/* Luz ambiental */}
            <motion.div
              className={cx("solution__ambient-light")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cx("solution__container")}>
        <div className={cx("solution__content-wrapper")}>
          {/* Tarjeta */}
          <motion.div
            className={cx("solution__card-wrapper")}
            style={
              !isMobile && !isAdaptive
                ? {
                    y: cardParallaxY,
                    x: cardParallaxX,
                    rotateY: cardRotateY,
                    scale,
                    filter:
                      brightness.get() !== 1
                        ? `brightness(${brightness.get()})`
                        : undefined,
                  }
                : undefined
            }
            initial={animationConfig.initial}
            animate={
              isInView ? animationConfig.animate : animationConfig.initial
            }
            transition={{
              ...animationConfig.transition,
              delay: getStaggeredDelay(isCardFirst),
            }}
          >
            <SolutionCardExpandable
              {...solution}
              solutionNumber={solutionNumber}
              className={cx("solution__card")}
            />
          </motion.div>

          {/* Wireframe */}
          <motion.div
            className={cx("solution__wireframe-wrapper")}
            style={
              !isMobile && !isAdaptive
                ? {
                    y: wireframeParallaxY,
                    x: wireframeParallaxX,
                    rotateY: wireframeRotateY,
                    scale,
                    filter:
                      brightness.get() !== 1
                        ? `brightness(${brightness.get()})`
                        : undefined,
                  }
                : undefined
            }
            initial={animationConfig.initial}
            animate={
              isInView ? animationConfig.animate : animationConfig.initial
            }
            transition={{
              ...animationConfig.transition,
              delay: getStaggeredDelay(!isCardFirst),
            }}
          >
            <AnimationWrapper animationComponentName={animationComponentName} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(Solution);
