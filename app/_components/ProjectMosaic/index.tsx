"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import classNames from "classnames/bind";
import { Typography } from "@/app/_components/Typography";
import styles from "./ProjectMosaic.module.scss";

const cx = classNames.bind(styles);

interface Project {
  id: string;
  title: string;
  featured_image: string;
  slug?: string;
}

interface ProjectMosaicProps {
  title: string;
  subtitle: string;
  projects: Project[];
  customAnchorId?: string;
}

const ProjectMosaic: React.FC<ProjectMosaicProps> = ({
  title,
  subtitle,
  projects,
  customAnchorId,
}) => {
  const mosaicRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(mosaicRef, { once: true, amount: 0.1 });

  // Animaciones del contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Animaciones de los elementos
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  // Obtener el tamaño para cada proyecto
  const getProjectSize = (index: number) => {
    // Alternamos proyectos grandes y normales para crear el efecto de mosaico
    const isLarge = index % 5 === 0 || index % 5 === 3;
    return isLarge ? "large" : "normal";
  };

  return (
    <section className={cx("project-mosaic")} id={customAnchorId}>
      <div className={cx("project-mosaic__container")}>
        <motion.div
          className={cx("project-mosaic__header")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Typography
              theme="dark"
              variant="h2"
              className={cx("project-mosaic__title")}
            >
              {title}
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography
              theme="dark"
              variant="p1"
              className={cx("project-mosaic__subtitle")}
            >
              {subtitle}
            </Typography>
          </motion.div>
        </motion.div>

        <motion.div
          ref={mosaicRef}
          className={cx("project-mosaic__grid")}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {projects.map((project, index) => {
            const size = getProjectSize(index);
            return (
              <motion.div
                key={project.id}
                className={cx(
                  "project-mosaic__item",
                  `project-mosaic__item--${size}`
                )}
                variants={itemVariants}
              >
                <Link
                  href={`/projects/${project.slug || project.id}`}
                  className={cx("project-mosaic__link")}
                >
                  <div className={cx("project-mosaic__project")}>
                    <div className={cx("project-mosaic__image-container")}>
                      <Image
                        src={project.featured_image}
                        alt={project.title}
                        fill
                        className={cx("project-mosaic__image")}
                      />
                      <div
                        className={cx("project-mosaic__image-overlay")}
                      ></div>
                    </div>
                    <div className={cx("project-mosaic__info")}>
                      <Typography
                        theme="dark"
                        variant="h3"
                        className={cx("project-mosaic__project-title")}
                      >
                        {project.title}
                      </Typography>
                      <div className={cx("project-mosaic__view-button")}>
                        <Typography theme="dark" variant="button">
                          View Project
                        </Typography>
                        <div className={cx("project-mosaic__arrow-icon")}>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 12H19"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 5L19 12L12 19"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectMosaic;
