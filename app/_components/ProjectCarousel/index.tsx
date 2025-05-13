"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import classNames from "classnames/bind";
import { Typography } from "@/app/_components/Typography";
import styles from "./ProjectCarousel.module.scss";
import SectionHeading from "../SectionHeading";

const cx = classNames.bind(styles);

interface Project {
  id: string;
  title: string;
  featured_image: string;
  slug?: string;
  client?: string;
  projectType?: string;
}

interface ProjectCarouselProps {
  title: string;
  subtitle: string;
  projects: Project[];
  customAnchorId?: string;
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  title,
  subtitle,
  projects,
  customAnchorId,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Manejo del scroll horizontal con drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Multiplicador de velocidad de scroll
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Actualizar activeIndex basado en el scroll
  useEffect(() => {
    const updateActiveIndex = () => {
      if (!carouselRef.current) return;

      const containerWidth = carouselRef.current.clientWidth;
      const scrollPosition = carouselRef.current.scrollLeft;
      const itemWidth = containerWidth / 3.5; // Aproximadamente el ancho de cada ítem visible

      const index = Math.round(scrollPosition / itemWidth);
      setActiveIndex(Math.min(index, projects.length - 1));
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", updateActiveIndex);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", updateActiveIndex);
      }
    };
  }, [projects.length]);

  // Scrollear a un ítem específico
  const scrollToProject = (index: number) => {
    if (!carouselRef.current) return;

    const containerWidth = carouselRef.current.clientWidth;
    const itemWidth = containerWidth / 3.5;
    const scrollPosition = index * itemWidth;

    carouselRef.current.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  };

  // Navegación de flechas del carrusel
  const handlePrevious = () => {
    const newIndex = Math.max(activeIndex - 1, 0);
    scrollToProject(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(activeIndex + 1, projects.length - 1);
    scrollToProject(newIndex);
  };

  // Intersection Observer para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(cx("project-carousel__visible"));
          }
        });
      },
      { threshold: 0.1 }
    );

    const wrapper = wrapperRef.current;
    if (wrapper) {
      observer.observe(wrapper);
    }

    return () => {
      if (wrapper) {
        observer.unobserve(wrapper);
      }
    };
  }, []);

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  // Renderizar estrellas para la calificación
  const renderStars = (count = 5) => {
    return (
      <div className={cx("project-carousel__stars")}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={cx("project-carousel__star")}>
            ★
          </span>
        ))}
      </div>
    );
  };

  // Asegurarse de que las imágenes existen y tienen un formato correcto
  const getSafeImageUrl = (url: string) => {
    if (!url) return "/images/placeholder-project.jpg";

    // Si la URL ya tiene http o https, es externa y la devolvemos tal cual
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Si la URL no empieza con /, añadirla
    if (!url.startsWith("/")) {
      return `/${url}`;
    }

    return url;
  };

  return (
    <section
      className={cx("project-carousel")}
      ref={wrapperRef}
      id={customAnchorId}
    >
      <div className={cx("project-carousel__container")}>
        <motion.div
          className={cx("project-carousel__header")}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <SectionHeading title={title} subtitle={subtitle} />
          </motion.div>
        </motion.div>

        <div className={cx("project-carousel__navigation-buttons")}>
          <button
            className={cx(
              "project-carousel__nav-button",
              "project-carousel__nav-button--prev"
            )}
            onClick={handlePrevious}
            aria-label="Previous projects"
            disabled={activeIndex === 0}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className={cx(
              "project-carousel__nav-button",
              "project-carousel__nav-button--next"
            )}
            onClick={handleNext}
            aria-label="Next projects"
            disabled={activeIndex === projects.length - 1}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div
          className={cx("project-carousel__carousel-container")}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div
            className={cx("project-carousel__carousel", {
              "project-carousel__carousel--dragging": isDragging,
            })}
            ref={carouselRef}
          >
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={cx("project-carousel__project")}
                onClick={(e) => {
                  // Evita la navegación si el click fue en un botón u otro elemento interactivo
                  if ((e.target as HTMLElement).closest("button")) return;
                  router.push(`/projects/${project.slug || project.id}`);
                }}
              >
                <div className={cx("project-carousel__project-content")}>
                  <div className={cx("project-carousel__image-container")}>
                    <Image
                      src={getSafeImageUrl(project.featured_image)}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === activeIndex}
                      className={cx("project-carousel__image")}
                    />
                  </div>
                  <div className={cx("project-carousel__arrow-button")}>
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
                  <div className={cx("project-carousel__info")}>
                    {/* {renderStars(5)} */}
                    <div className={cx("project-carousel__decoration")} />

                    <Typography
                      theme="dark"
                      fontFamily="sofia"
                      variant="h3"
                      className={cx("project-carousel__project-title")}
                    >
                      {project.title}
                    </Typography>
                    <Typography
                      theme="dark"
                      fontFamily="sofia"
                      variant="p3"
                      className={cx("project-carousel__project-subtitle")}
                    >
                      {project.projectType || "Project Type"},{" "}
                      {project.client || "Client"}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cx("project-carousel__navigation")}>
          <div className={cx("project-carousel__dots")}>
            {projects.map((project, index) => (
              <button
                key={project.id}
                className={cx("project-carousel__dot", {
                  "project-carousel__dot--active": index === activeIndex,
                })}
                onClick={() => scrollToProject(index)}
                aria-label={`Go to project ${index + 1}: ${project.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
