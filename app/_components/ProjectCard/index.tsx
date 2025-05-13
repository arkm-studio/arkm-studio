"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import classNames from "classnames/bind";
import { Typography } from "@/app/_components/Typography";
import styles from "./ProjectCard.module.scss";

const cx = classNames.bind(styles);

interface Project {
  id: string;
  title: string;
  featured_image: string;
  slug?: string;
  client?: string;
  projectType?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isPriority: boolean;
  lang: "en" | "es";
  labels: {
    projectType: string;
    client: string;
    viewProject: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  isPriority,
  lang,
  labels,
}) => {
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
    <div className={cx("project-card")}>
      <Link
        href={`/${lang}/projects/${project.slug || project.id}`}
        className={cx("project-card__link")}
      >
        <div className={cx("project-card__content")}>
          <div className={cx("project-card__image-container")}>
            <Image
              src={getSafeImageUrl(project.featured_image)}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isPriority}
              className={cx("project-card__image")}
            />
          </div>

          <div className={cx("project-card__info")}>
            <div className={cx("project-card__text-content")}>
              <Typography
                theme="dark"
                fontFamily="sofia"
                variant="h3"
                className={cx("project-card__title")}
              >
                {project.title}
              </Typography>
              <Typography
                theme="dark"
                fontFamily="sofia"
                variant="p3"
                className={cx("project-card__subtitle")}
              >
                {project.projectType || labels.projectType},{" "}
                {project.client || labels.client}
              </Typography>
            </div>

            <button className={cx("project-card__cta-button")}>
              <span>{labels.viewProject}</span>
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
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
