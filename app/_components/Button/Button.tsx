"use client";

import { forwardRef } from "react";
import Link from "next/link";
import classNames from "classnames/bind";
import { Loader } from "lucide-react";
import { ButtonProps } from "./types";
import styles from "./Button.module.scss";
import {
  isGlassyVariant,
  isGradientShaderVariant,
} from "./utils/variantHelpers";
import { renderAuroraVariantElements } from "./variants/AuroraVariants";
import { renderBasicVariantElements } from "./variants/BasicVariants";
import { renderCrystalVariantElements } from "./variants/CrystalVariants";
import { renderHybridVariantElements } from "./variants/HybridVariants";
import { renderModernGlowVariantElements } from "./variants/ModernGlowVariants";
import { renderModernShapeVariantElements } from "./variants/ModernShapeVariants";
import { renderNebulaVariantElements } from "./variants/NebulaVariants";
import { renderPrismaVariantElements } from "./variants/PrismaVariants";
import { renderRainbowVariantElements } from "./variants/RainbowVariants";
import { renderCosmicAuraVariantElements } from "./variants/CosmicAuraVariants";
import { renderGradientShaderVariantElements } from "./variants/GradientShaderVariants";

const cx = classNames.bind(styles);

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      radius = "full",
      icon,
      className,
      target = "_blank",
      href,
      isLoading = false,
      disabled = false,
      onClick,
      fullWidth = false,
      type = "button",
      gradientColor,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cx(
      "button",
      `button--${variant}`,
      `button--${size}`,
      `button--radius-${radius}`,
      {
        "button--disabled": disabled,
        "button--loading": isLoading,
        "button--with-icon": !!icon,
        "button--fullWidth": fullWidth,
        [`button--gradient--${gradientColor}`]:
          (variant === "gradient" || isGradientShaderVariant(variant)) &&
          gradientColor,
      },
      className
    );

    // Delegate rendering of variant-specific elements to the appropriate module
    const renderVariantElements = () => {
      if (!isGlassyVariant(variant)) return null;

      // Basic variants
      if (
        variant === "primary" ||
        variant === "secondary" ||
        variant === "gradient"
      ) {
        return renderBasicVariantElements(variant, cx);
      }

      // Gradient Shader variants
      if (isGradientShaderVariant(variant)) {
        return renderGradientShaderVariantElements(variant, cx);
      }

      // Prisma variants
      if (variant.startsWith("prisma-")) {
        return renderPrismaVariantElements(variant, cx);
      }

      // Nebula variants
      if (variant.startsWith("nebula-")) {
        return renderNebulaVariantElements(variant, cx);
      }

      // Aurora variants
      if (variant.startsWith("aurora-")) {
        return renderAuroraVariantElements(variant, cx);
      }

      // Crystal variants
      if (variant.startsWith("crystal-")) {
        return renderCrystalVariantElements(variant, cx);
      }

      // Modern Glow variants
      if (
        variant === "modern-glow" ||
        variant === "modern-glow-pro" ||
        variant === "modern-glow-glass" ||
        variant === "modern-glow-pulse"
      ) {
        return renderModernGlowVariantElements(variant, cx);
      }

      // Modern Shape variants
      if (
        variant === "modern-shape" ||
        variant === "modern-shape-gradient" ||
        variant === "modern-shape-texture" ||
        variant === "modern-shape-bordered"
      ) {
        return renderModernShapeVariantElements(variant, cx);
      }

      // Rainbow variants
      if (variant.startsWith("rainbow-")) {
        return renderRainbowVariantElements(variant, cx);
      }

      // Hybrid variants (combinations of the above)
      if (
        variant.startsWith("modern-") &&
        (variant.includes("-hologram") ||
          variant.includes("-rainbow") ||
          variant.includes("-cosmic") ||
          variant.includes("-neon"))
      ) {
        return renderHybridVariantElements(variant, cx);
      }

      // Cosmic Aura variants
      if (variant.startsWith("cosmic-aura")) {
        return renderCosmicAuraVariantElements(variant, cx);
      }

      return null;
    };

    const content = (
      <>
        {isLoading ? (
          <Loader className={cx("button__spinner")} size={20} />
        ) : (
          <>
            {(variant === "gradient" || isGradientShaderVariant(variant)) && (
              <span className={cx("button__glow")} />
            )}
            {isGlassyVariant(variant) && renderVariantElements()}
            <span className={cx("button__text")}>{children}</span>
            {icon && <span className={cx("button__icon")}>{icon}</span>}
          </>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <Link
          href={href}
          className={buttonClasses}
          ref={ref as any}
          target={target}
          onClick={onClick}
          {...props}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as any}
        className={buttonClasses}
        disabled={disabled || isLoading}
        onClick={onClick}
        type={type}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
