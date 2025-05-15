"use client";

import React from "react";
import classNames from "classnames/bind";

import styles from "./ContactSection.module.scss";
import { Button } from "@/app/_components/Button";
import ContactForm from "@/app/_components/ContactForm";
import Modal from "@/app/_components/Modal";
import Typography from "@/app/_components/Typography";
import { ContactDictionary } from "@/app/_types/dictionary/mainLayout.types";

const cx = classNames.bind(styles);

interface ContactSectionProps {
  dictionary?: Partial<ContactDictionary>;
  customAnchorId?: string;
  footerDictionary?: any; // Añadido para recibir los datos del footer
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  dictionary,
  customAnchorId,
  footerDictionary,
}) => {
  // Set default values if dictionary is not provided
  const contactText = {
    title:
      dictionary?.title ||
      "Let's connect, collaborate, and bring ideas to life",
    subtitle:
      dictionary?.subtitle || "Questions or just saying hi? I'm here for you!",
    cta: dictionary?.cta || "Send me a message",
  };

  // Get contact form dictionary
  const contactFormDictionary = dictionary?.forms?.contactForm;

  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  // Set default values if footerDictionary is not provided
  // const copyright = footerDictionary?.copyright
  //   ? footerDictionary.copyright.replace("{year}", currentYear.toString())
  //   : `Development & Design © ${currentYear}`;

  const copyright = `Development & Design © ${currentYear}`;

  // Ya no necesitamos los navigationItems
  // Solo requerimos el copyright

  return (
    <section className={cx("contact-section")} id={customAnchorId}>
      <div className={cx("contact-section__background")}></div>

      <div className={cx("contact-section__container")}>
        <div className={cx("contact-section__content")}>
          <div className={cx("contact-section__center-content")}>
            <Typography
              variant="h2"
              theme="dark"
              fontFamily="sofia"
              color="primary"
              fontWeight={600}
              className={cx("contact-section__heading")}
            >
              {contactText.title}
            </Typography>

            <div className={cx("contact-section__message")}>
              <Typography
                variant="p1"
                theme="dark"
                fontFamily="sofia"
                color="secondary"
                fontWeight={500}
                className={cx("contact-section__message-text")}
              >
                {contactText.subtitle}
              </Typography>
            </div>

            <Modal>
              <Modal.Open opens="contact-form">
                <Button
                  size="md"
                  // variant="cosmic-aura-gradient"
                  // variant="modern-shape"
                  variant="gradient"
                  className={cx("contact-section__action-button")}
                >
                  {contactText.cta}
                </Button>
              </Modal.Open>
              <Modal.Window name="contact-form">
                <ContactForm dictionary={contactFormDictionary} />
              </Modal.Window>
            </Modal>
          </div>
        </div>
      </div>

      {/* Footer Glassmorphism Copyright Section - Fuera del contenedor principal */}
      <div className={cx("contact-section__footer-glass")}>
        <div className={cx("contact-section__copyright")}>
          <Typography
            theme="dark"
            variant="p3"
            fontFamily="sofia"
            className={cx("project-details__footer-brand")}
          >
            José Pablo Karam Dolores
          </Typography>
          <Typography
            theme="dark"
            variant="p3"
            fontFamily="sofia"
            color="tertiary"
          >
            {copyright}
          </Typography>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
