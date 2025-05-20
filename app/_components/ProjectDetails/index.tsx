"use client";

import React, { useState } from "react";
import Image from "next/image";
import classNames from "classnames/bind";
import { Typography } from "@/app/_components/Typography";
import { motion } from "framer-motion";
import styles from "./ProjectDetails.module.scss";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

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
  // For the featured image carousel
  const [currentImage, setCurrentImage] = useState(images.featured);
  const allImages = [images.featured, ...images.gallery];
  const router = useRouter();

  const handleNavigateToWork = () => {
    router.push(projectUrl);
  };

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
              <div className={cx("project-details__featured-image")}>
                <Image
                  src={currentImage}
                  alt={`${title} featured image`}
                  fill
                  className={cx("project-details__image")}
                  priority
                />
                <div className={cx("project-details__image-overlay")}></div>
              </div>

              {/* Reemplazo de las miniaturas por dots */}
              <div className={cx("project-details__dots-slider")}>
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={cx("project-details__dot", {
                      "project-details__dot--active": image === currentImage,
                    })}
                    onClick={() => setCurrentImage(image)}
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
