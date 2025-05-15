"use client";

import React, { useCallback } from "react";
import classNames from "classnames/bind";
import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Link from "next/link"; // Importar Link de Next.js

import ProjectForm from "@/app/_components/ProjectForm";
import Modal from "@/app/_components/Modal";
import { Typography } from "@/app/_components/Typography";
import { Button } from "@/app/_components/Button";

import { HeroDictionary } from "@/app/_types/dictionary/home.types";

import styles from "./Hero.module.scss";

const cx = classNames.bind(styles);

interface HeroProps {
  dictionary: HeroDictionary;
  projectFormDictionary?: any;
}

// Register ScrollToPlugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

export const Hero = ({ dictionary, projectFormDictionary }: HeroProps) => {
  const handleScrollToSection = useCallback((href: string) => {
    const targetElement = document.querySelector(href);

    if (targetElement) {
      const offset = 120; // Additional offset from the top

      gsap.to(window, {
        duration: 1, // Animation duration
        scrollTo: {
          y: targetElement,
          offsetY: offset,
        },
      });
    }
  }, []);

  return (
    <section id="home" className={cx("hero")}>
      <div className={cx("hero__content")}>
        <div className={cx("hero__spacer")} />

        <div className={cx("hero__info")}>
          <Typography
            variant="h1"
            color="primary"
            fontWeight={600}
            fontFamily="sofia"
            theme="dark"
            className={cx("hero__info-text")}
          >
            {dictionary.description.description}
          </Typography>
          <Typography
            variant="h5"
            color="secondary"
            fontWeight={600}
            fontFamily="sofia"
            theme="dark"
            className={cx("hero__info-subtitle")}
          >
            {dictionary.title.main}
            <span className={cx("hero__info-subtitle-and-character")}>
              {dictionary.title.connector}
            </span>
            {dictionary.title.secondary}
          </Typography>
        </div>

        <div className={cx("hero__actions")}>
          {/* Botón CTA con smooth scroll a la sección portfolio */}
          <Button
            size="lg"
            variant="gradient"
            className={cx("hero__cta-button")}
            onClick={() => handleScrollToSection("#portfolio")}
          >
            {dictionary.description.cta}
          </Button>

          <div className={cx("hero__scroll")}>
            <Typography
              variant="p3"
              color="secondary"
              fontFamily="sofia"
              fontWeight={600}
              theme="dark"
              className={cx("hero__scroll-text")}
            >
              {dictionary.scroll}
            </Typography>

            <div className={cx("hero__scroll-indicator")} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
