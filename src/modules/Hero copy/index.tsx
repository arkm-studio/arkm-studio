"use client";

import React, { useEffect, useRef, useState } from "react";

import { FONTS } from "@/lib/fonts";
import { ProjectForm } from "@/components/ProjectForm";
import WebGLText from "@/components/WebGLText";
import classNames from "classnames/bind";
import Modal from "@/components/Modal";
import gsap from "gsap";
import { plasmaPulseShader } from "@/lib/shaders";
import styles from "./Hero.module.scss";
import useMousePosition from "@/hooks/useMousePosition";
import { HeroDictionary } from "@/types/dictionary/home.types";

const cx = classNames.bind(styles);

interface HeroProps {
  dictionary: HeroDictionary;
}

export const Hero = ({ dictionary }: HeroProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isShaderComplete, setIsShaderComplete] = useState(false);
  const [isShaderFadedOut, setIsShaderFadedOut] = useState(false);

  const textBehindRef = useRef(null);
  const textFrontRef = useRef(null);
  const textBehindBlurRef = useRef(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  // const { onCursor, theme } = useUIContext();
  const { x, y } = useMousePosition();

  const headlineText = {
    create: dictionary.headline.create,
    scale: dictionary.headline.scale,
    transform: dictionary.headline.transform,
  };

  const handleShaderComplete = () => {
    setIsShaderComplete(true);
  };

  const handleShaderFadeOut = () => {
    setIsShaderFadedOut(true);
  };

  // Efecto para el scroll
  useEffect(() => {
    const handleScroll = () => {
      if (glowRef.current) {
        const rotateX = (window.scrollY / window.innerHeight) * 20;
        glowRef.current.style.transform = `rotateX(${rotateX}deg)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efecto principal para el movimiento de todas las capas

  useEffect(() => {
    if (maskRef.current) {
      const size = isHovered ? 300 : 0;
      const maskX = x - size / 2;
      const maskY = y - size / 2;

      gsap.to(maskRef.current, {
        webkitMaskPosition: `${maskX}px ${maskY}px`,
        webkitMaskSize: `${size}px`,
        ease: "power2.out",
        duration: 0.3,
        opacity: isHovered ? 1 : 0, // Mejor control de la visibilidad del mask
      });

      const normalizedX = (x - window.innerWidth / 2) / (window.innerWidth / 2);
      const normalizedY =
        (y - window.innerHeight / 2) / (window.innerHeight / 2);
      const acceleration = (distance: number) =>
        Math.sign(distance) * Math.pow(Math.abs(distance), 1.5);
      const moveX = acceleration(normalizedX) * 30;
      const moveY = acceleration(normalizedY) * 30;

      // Aumentamos el umbral de detección de movimiento
      const isMoving = Math.abs(moveX) > 2 || Math.abs(moveY) > 2;

      // Añadimos un pequeño retraso al volver a la posición inicial
      const zPosition = isMoving ? 50 : 0;
      const transitionDuration = isMoving ? 0.8 : 1.5; // Más lento al volver

      // Animamos las capas traseras
      gsap.to([textBehindRef.current, maskRef.current], {
        x: moveX * 0.4,
        y: moveY * 0.4,
        rotateY: moveX * 0.1,
        rotateX: -moveY * 0.1,
        z: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.to(textBehindBlurRef.current, {
        x: moveX * 2,
        y: moveY * 2,
        rotateY: moveX * 0.3,
        rotateX: -moveY * 0.3,
        z: 20,
        duration: 1,
        ease: "power2.out",
      });

      // Animamos la capa frontal
      if (textFrontRef.current) {
        const distance = Math.sqrt(
          normalizedX * normalizedX + normalizedY * normalizedY
        );
        const offsetAmount = Math.min(distance * 10, 5);
        const intensity = 0.5 + distance * 0.5;

        gsap.to(textFrontRef.current, {
          x: moveX * 2.5,
          y: moveY * 2.5,
          rotateY: moveX * 0.5,
          rotateX: -moveY * 0.5,
          z: zPosition,
          scale: 1,
          textShadow: `
            ${-offsetAmount}px 0 rgba(255,0,0,${intensity}),
            ${offsetAmount}px 0 rgba(0,255,255,${intensity})
          `,
          color: "rgba(255, 255, 255, 0.9)",
          duration: transitionDuration,
          ease: isMoving ? "power2.out" : "power3.inOut",
        });
      }
    }
  }, [x, y, isHovered]);

  useEffect(() => {
    if (maskRef.current) {
      const size = isHovered ? 300 : 0;
      const maskX = x - size / 2;
      const maskY = y - size / 2;

      gsap.to(maskRef.current, {
        webkitMaskPosition: `${maskX}px ${maskY}px`,
        webkitMaskSize: `${size}px`,
        ease: "power2.out",
        duration: 0.3,
      });

      const normalizedX = (x - window.innerWidth / 2) / (window.innerWidth / 2);
      const normalizedY =
        (y - window.innerHeight / 2) / (window.innerHeight / 2);
      const acceleration = (distance: number) =>
        Math.sign(distance) * Math.pow(Math.abs(distance), 1.5);
      const moveX = acceleration(normalizedX) * 30;
      const moveY = acceleration(normalizedY) * 30;

      if (textBehindRef.current) {
        const angle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI);
        const distance = Math.sqrt(
          normalizedX * normalizedX + normalizedY * normalizedY
        );

        gsap.to(textBehindRef.current, {
          x: moveX * 2.5,
          y: moveY * 2.5,
          rotateY: moveX * 0.5,
          rotateX: -moveY * 0.5,
          background: `
            linear-gradient(
              ${angle}deg,
              rgba(99, 102, 241, ${0.7 + distance * 0.3}) 0%,
              rgba(244, 114, 182, ${0.7 + distance * 0.3}) 50%,
              rgba(129, 140, 248, ${0.7 + distance * 0.3}) 100%
            )
          `,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          filter: `brightness(${1.2 + distance * 0.3}) contrast(120%)`,
          // Añadimos una máscara que permita ver el text-stroke permanente
          WebkitMaskImage: `linear-gradient(
            ${angle}deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.8) 50%,
            rgba(0, 0, 0, 0.5) 100%
          )`,
          WebkitMaskComposite: "destination-out",
          duration: 1.2,
          ease: "power2.out",
        });
      }
      if (textFrontRef.current) {
        const distance = Math.sqrt(
          normalizedX * normalizedX + normalizedY * normalizedY
        );
        const intensity = 0.4 + distance * 0.3;

        gsap.to(textFrontRef.current, {
          x: moveX * 0.8,
          y: moveY * 0.8,
          rotateY: moveX * 0.1,
          rotateX: -moveY * 0.1,

          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textShadow: `
            0 0 ${10 + distance * 15}px rgba(255, 255, 255, ${0.5 * intensity}),
            0 0 ${20 + distance * 25}px rgba(99, 102, 241, ${0.3 * intensity})
          `,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      gsap.to(textBehindBlurRef.current, {
        x: moveX * 2,
        y: moveY * 2,
        rotateY: moveX * 0.3,
        rotateX: -moveY * 0.3,
        duration: 1,
        ease: "power2.out",
      });
    }
  }, [x, y, isHovered]);

  return (
    <section
      id="home"
      className={cx("hero", {
        "hero--dark": true,
      })}
    >
      <div className={cx("hero__ambient-glow")} ref={glowRef} />
      <div className={cx("hero__grid-background")} />

      <div className={cx("hero__headline")}>
        <div
          ref={textBehindRef}
          className={cx("hero__headline-text", "hero__headline-text--behind")}
        >
          {headlineText.create},
          <span className={cx("hero__headline-text-indent")}>
            {headlineText.scale}
          </span>
          <br />
          {headlineText.transform}
        </div>

        <div
          ref={textBehindBlurRef}
          className={cx("hero__headline-text", "hero__headline-text--blur")}
        >
          {headlineText.create},
          <span className={cx("hero__headline-text-indent")}>
            {headlineText.scale}
          </span>
          <br />
          {headlineText.transform}
        </div>

        <div className={cx("hero__headline-text", "hero__headline-text--main")}>
          {headlineText.create},
          <span className={cx("hero__headline-text-indent")}>
            {headlineText.scale}
          </span>
          <br />
          {headlineText.transform}
        </div>

        <div
          ref={maskRef}
          className={cx(
            "hero__headline-text",
            "hero__headline-text--white-stroke"
          )}
        >
          {headlineText.create},
          <span className={cx("hero__headline-text-indent")}>
            {headlineText.scale}
          </span>
          <br />
          {headlineText.transform}
        </div>

        <div
          className={cx(
            "hero__headline-text",
            "hero__headline-text--permanent-stroke"
          )}
        >
          {headlineText.create},
          <span className={cx("hero__headline-text-indent")}>
            {headlineText.scale}
          </span>
          <br />
          {headlineText.transform}
        </div>

        <div
          ref={textFrontRef}
          className={cx("hero__headline-text", "hero__headline-text--front", {
            "hero__headline-text--shader-complete": isShaderFadedOut,
            "is-hovered": isHovered,
          })}
        >
          {headlineText.create},
          <span className={cx("hero__headline-text-indent")}>
            {headlineText.scale}
          </span>
          <br />
          {headlineText.transform}
        </div>

        <WebGLText
          className={cx("hero__webgl-text", {
            "hero__webgl-text--fade-out": isShaderComplete,
          })}
          fragmentShader={plasmaPulseShader}
          text={[
            `${headlineText.create}, ${headlineText.scale}`,
            headlineText.transform,
          ]}
          options={{
            font: {
              family: FONTS.KRANTO.family,
              weight: FONTS.KRANTO.weights.light,
              style: "normal",
            },
            fontSize: {
              min: 48, // Tamaño mínimo que coincide con el CSS clamp
              max: 142, // Tamaño máximo que coincide con el CSS clamp
              preferred: 12, // Equivalente a 12vw en el CSS
            },
            color: "#ffffff",
            textAlign: "center",
            textBaseline: "middle",
            scale: 2,
            lineHeight: 0.92,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            position: {
              marginTop: "0",
              marginBottom: "0",
            },
            pixelRatio:
              typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2,
          }}
          onComplete={handleShaderComplete}
          onFadeComplete={handleShaderFadeOut}
          fadeOutDuration={0.5}
          debug={process.env.NODE_ENV === "development"}
        />

        <div
          ref={maskRef}
          className={cx("hero__mask", "hero__mask--neon")}
          onMouseEnter={() => {
            // onCursor("hovered");
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            // onCursor("");
            setIsHovered(false);
          }}
        >
          <div className={cx("hero__mask-text")}>
            {headlineText.create}
            <span className={cx("hero__mask-text-accent")}>,</span>
            <span className={cx("hero__mask-text-indent")}>
              {headlineText.scale}
            </span>
            <br />
            {headlineText.transform}
          </div>
        </div>
      </div>

      <div className={cx("hero__content")}>
        <div className={cx("hero__info")}>
          <p className={cx("hero__info-subtitle")}>
            {dictionary.description.subtitle}
          </p>
          <div className={cx("hero__info-description")}>
            {dictionary.description.description}
          </div>
          <Modal>
            <Modal.Open opens="project-form">
              <button
                className={cx("hero__cta-button")}
                onMouseEnter={() => {
                  // onCursor("hovered");
                  setIsHovered(true);
                }}
                onMouseLeave={() => {
                  // onCursor("");
                  setIsHovered(false);
                }}
              >
                {dictionary.description.cta}
              </button>
            </Modal.Open>
            <Modal.Window name="project-form">
              <ProjectForm />
            </Modal.Window>
          </Modal>
        </div>

        <div className={cx("hero__scroll")}>
          <span className={cx("hero__scroll-text")}>{dictionary.scroll}</span>
          <div className={cx("hero__scroll-indicator")} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
