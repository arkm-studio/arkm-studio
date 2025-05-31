"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import classNames from "classnames/bind";
import { Typography } from "@/app/_components/Typography";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ProjectDetails.module.scss";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const cx = classNames.bind(styles);

interface Technology {
  name: string;
}

interface ProjectDetailsProps {
  title: string;
  description: string;
  introText: string;
  client: string;
  projectType: string;
  platform: string;
  expertise: string[];
  technologies: Technology[];
  whatWeDid: string[];
  finalProduct: string;
  projectUrl: string;
  images: {
    featured: string;
    gallery: string[];
  };
  studioName: string;
  year: string;
  // Labels with defaults
  whatWeDidLabel?: string;
  finalProductLabel?: string;
  seeWorkLabel?: string;
  clientLabel?: string;
  projectTypeLabel?: string;
  platformLabel?: string;
  expertiseLabel?: string;
  technologyLabel?: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  title,
  description,
  introText,
  client,
  projectType,
  platform,
  expertise,
  technologies,
  whatWeDid,
  finalProduct,
  projectUrl,
  images,
  studioName,
  year,
  // Labels with defaults
  whatWeDidLabel = "What we did",
  finalProductLabel = "The final product",
  seeWorkLabel = "See The Work",
  clientLabel = "CLIENT",
  projectTypeLabel = "PROJECT TYPE",
  platformLabel = "PLATFORM",
  expertiseLabel = "EXPERTISE",
  technologyLabel = "TECHNOLOGY",
}) => {
  // For the advanced image slider
  const allImages = [images.featured, ...images.gallery];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  
  // Get the current image and adjacent images for the slider
  const currentImage = allImages[currentIndex];
  const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
  const nextIndex = (currentIndex + 1) % allImages.length;
  const prevImage = allImages[prevIndex];
  const nextImage = allImages[nextIndex];

  const handleNavigateToWork = () => {
    router.push(projectUrl);
  };

  // Handle navigation between images
  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  return (
    <motion.div
      className={cx("project-details")}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className={cx("project-details__container")}>
        <section className={cx("project-details__hero")}>
          {/* <motion.div
            className={cx("project-details__hero-header")}
            variants={itemVariants}
          >
            <div className={cx("project-details__header-content")}>
              <div className={cx("project-details__category-badge")}>
                <Typography theme="dark" variant="label">
                  {projectType}
                </Typography>
              </div>

              <Typography
                theme="dark"
                variant="h1"
                className={cx("project-details__title")}
              >
                {title}
              </Typography>
            </div>
          </motion.div> */}

          <div className={cx("project-details__hero-content")}>
            <motion.div
              className={cx("project-details__featured-image-container")}
              variants={itemVariants}
            >
              <div className={cx("project-details__advanced-slider")}>                
                {/* Navigation buttons */}
                <button 
                  className={cx("project-details__slider-nav", "project-details__slider-nav--prev")} 
                  onClick={goToPrevSlide}
                  aria-label="Previous image"
                  disabled={isAnimating}
                >
                  <FiChevronLeft />
                </button>
                
                <div className={cx("project-details__slider-container")}>                  
                  {/* Previous image (smaller) */}
                  <div className={cx("project-details__slider-item", "project-details__slider-item--prev")}>
                    <div className={cx("project-details__slider-image-wrapper")}>
                      <Image
                        src={prevImage}
                        alt={`${title} previous image`}
                        fill
                        className={cx("project-details__slider-image")}
                      />
                      <div className={cx("project-details__image-overlay")}></div>
                    </div>
                  </div>
                  
                  {/* Current image (main) */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentIndex}
                      className={cx("project-details__slider-item", "project-details__slider-item--current")}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className={cx("project-details__slider-image-wrapper")}>
                        <Image
                          src={currentImage}
                          alt={`${title} featured image`}
                          fill
                          className={cx("project-details__slider-image")}
                          priority
                        />
                        <div className={cx("project-details__image-overlay")}></div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Next image (smaller) */}
                  <div className={cx("project-details__slider-item", "project-details__slider-item--next")}>
                    <div className={cx("project-details__slider-image-wrapper")}>
                      <Image
                        src={nextImage}
                        alt={`${title} next image`}
                        fill
                        className={cx("project-details__slider-image")}
                      />
                      <div className={cx("project-details__image-overlay")}></div>
                    </div>
                  </div>
                </div>
                
                <button 
                  className={cx("project-details__slider-nav", "project-details__slider-nav--next")} 
                  onClick={goToNextSlide}
                  aria-label="Next image"
                  disabled={isAnimating}
                >
                  <FiChevronRight />
                </button>
              </div>
              
              {/* Dots indicator */}
              <div className={cx("project-details__dots-slider")}>
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={cx("project-details__dot", {
                      "project-details__dot--active": index === currentIndex,
                    })}
                    onClick={() => goToSlide(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              className={cx("project-details__hero-info")}
              variants={itemVariants}
            >
              <div className={cx("project-details__info-wrapper")}>
                {/* Cliente y plataforma ahora van aquí, arriba de la descripción */}
                {/* <div
                  className={cx("project-details__client-platform-container")}
                >
                  <div className={cx("project-details__client-info-container")}>
                    <Typography
                    fontFamily="sofia"
                      theme="dark"
                      variant="label"
                      className={cx("project-details__info-label")}
                    >
                      {clientLabel}
                    </Typography>
                    <Typography
                    fontFamily="sofia"
                      theme="dark"
                      variant="h4"
                      className={cx("project-details__client-title")}
                    >
                      {client}
                    </Typography>
                  </div>

                  <div
                    className={cx("project-details__platform-info-container")}
                  >
                    <Typography
                    fontFamily="sofia"
                      theme="dark"
                      variant="label"
                      className={cx("project-details__info-label")}
                    >
                      {platformLabel}
                    </Typography>
                    <Typography
                    fontFamily="sofia"
                      theme="dark"
                      variant="h4"
                      className={cx("project-details__platform-title")}
                    >
                      {platform}
                    </Typography>
                  </div>
                </div> */}
                <motion.div
                  className={cx("project-details__hero-header")}
                  variants={itemVariants}
                >
                  <div className={cx("project-details__header-content")}>
                    {/* <div className={cx("project-details__category-badge")}>
                      <Typography theme="dark" variant="label">
                        {projectType}
                      </Typography>
                    </div> */}

                    <Typography
                      fontFamily="sofia"
                      theme="dark"
                      variant="h1"
                      className={cx("project-details__title")}
                    >
                      {title}
                    </Typography>
                  </div>
                </motion.div>
                {/* Descripción del proyecto */}
                <Typography
                  theme="dark"
                  fontFamily="sofia"
                  align="center"
                  variant="h5"
                  fontWeight={500}
                  className={cx("project-details__description")}
                >
                  {description}
                </Typography>

                {/* Tarjeta de expertise y tecnologías */}
                <div className={cx("project-details__project-card")}>
                  <div className={cx("project-details__cards-container")}>
                    <div
                      className={cx(
                        "project-details__detail-card",
                        "project-details__detail-card--expertise"
                      )}
                    >
                      <Typography
                        fontFamily="sofia"
                        theme="dark"
                        // variant="label"
                        className={cx("project-details__card-title")}
                      >
                        {expertiseLabel}
                      </Typography>
                      <div className={cx("project-details__tags-wrap")}>
                        {expertise.map((skill, index) => (
                          <span
                            key={index}
                            className={cx("project-details__tag")}
                          >
                            <Typography
                              theme="dark"
                              fontFamily="sofia"
                              variant="p2"
                            >
                              {skill}
                            </Typography>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className={cx(
                        "project-details__detail-card",
                        "project-details__detail-card--technology"
                      )}
                    >
                      <Typography
                        fontFamily="sofia"
                        theme="dark"
                        // variant="label"
                        className={cx("project-details__card-title")}
                      >
                        {technologyLabel}
                      </Typography>
                      <div className={cx("project-details__tags-wrap")}>
                        {technologies.map((tech, index) => (
                          <span
                            key={index}
                            className={cx("project-details__tag")}
                          >
                            <Typography
                              theme="dark"
                              fontFamily="sofia"
                              variant="p2"
                            >
                              {tech.name}
                            </Typography>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.div
          className={cx("project-details__intro-section")}
          variants={itemVariants}
        >
          <Typography
            theme="dark"
            variant="h5"
            fontWeight={400}
            fontFamily="sofia"
            className={cx("project-details__intro-text")}
          >
            {introText}
          </Typography>
        </motion.div>

        <div className={cx("project-details__content-layout")}>
          <div className={cx("project-details__main-content")}>
            <motion.section
              className={cx("project-details__section")}
              variants={itemVariants}
            >
              <div className={cx("project-details__section-header")}>
                <div className={cx("project-details__section-indicator")}>
                  01
                </div>
                <Typography
                  theme="dark"
                  variant="h2"
                  // fontWeight={400}
                  fontFamily="sofia"
                  className={cx("project-details__section-title")}
                >
                  {whatWeDidLabel}
                </Typography>
              </div>

              <div className={cx("project-details__section-content")}>
                {whatWeDid.map((paragraph, index) => (
                  <Typography
                    theme="dark"
                    key={index}
                    variant="h5"
                    fontWeight={400}
                    fontFamily="sofia"
                    className={cx("project-details__paragraph")}
                  >
                    {paragraph}
                  </Typography>
                ))}
              </div>
            </motion.section>

            <motion.section
              className={cx("project-details__section")}
              variants={itemVariants}
            >
              <div className={cx("project-details__section-header")}>
                <div className={cx("project-details__section-indicator")}>
                  02
                </div>
                <Typography
                  theme="dark"
                  variant="h2"
                  // fontWeight={400}
                  fontFamily="sofia"
                  className={cx("project-details__section-title")}
                >
                  {finalProductLabel}
                </Typography>
              </div>

              <div className={cx("project-details__section-content")}>
                <Typography
                  theme="dark"
                  variant="h5"
                  fontWeight={400}
                  fontFamily="sofia"
                  className={cx("project-details__paragraph")}
                >
                  {finalProduct}
                </Typography>

                <div className={cx("project-details__cta-arrow")}>
                  <Button
                    size="lg"
                    // variant="modern-shape"
                    // variant="modern-glow"
                    variant="gradient"
                    href={projectUrl}
                    target="_blank"
                    className={cx("hero__cta-button")}
                    // onClick={handleNavigateToWork}
                  >
                    {seeWorkLabel}
                  </Button>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        <motion.footer
          className={cx("project-details__footer")}
          variants={itemVariants}
        >
          <div className={cx("project-details__footer-content")}>
            <Typography
              theme="dark"
              variant="p3"
              fontFamily="sofia"
              className={cx("project-details__footer-brand")}
            >
              {studioName}
            </Typography>
            <Typography
              theme="dark"
              variant="p3"
              fontFamily="sofia"
              className={cx("project-details__footer-copyright")}
            >
              Development & Design © {year}
            </Typography>
            {/* <Typography
              theme="dark"
              variant="p3"
              className={cx("project-details__footer-project")}
            >
              {client} - {studioName}
            </Typography> */}
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
