import { ReactNode } from "react";

// Group variant types by category
export type PrismaVariants = "prisma-multiple" | "prisma-refraction";

export type NebulaVariants =
  | "nebula-stardust"
  | "nebula-vortex"
  | "nebula-quantum";

export type AuroraVariants =
  | "aurora-waves"
  | "aurora-curtain"
  | "aurora-plasma";

export type CosmicVariants =
  | "cosmic-aura"
  | "cosmic-aura-outlined"
  | "cosmic-aura-glow"
  | "cosmic-aura-gradient"
  | "cosmic-aura-nebula"
  | "cosmic-aura-minimal";

export type CrystalVariants =
  | "crystal-frosted"
  | "crystal-prismatic"
  | "crystal-liquid";

export type ModernGlowVariants =
  | "modern-glow"
  | "modern-glow-pro"
  | "modern-glow-glass"
  | "modern-glow-pulse";

export type ModernShapeVariants =
  | "modern-shape"
  | "modern-shape-gradient"
  | "modern-shape-texture"
  | "modern-shape-bordered";

export type RainbowVariants =
  | "rainbow-gradient"
  | "rainbow-cosmic"
  | "rainbow-hologram"
  | "rainbow-neon";

export type HybridVariants =
  | "modern-glow-hologram"
  | "modern-shape-rainbow"
  | "modern-glow-cosmic"
  | "modern-pulse-neon"
  | "modern-shape-hologram";

// Nueva categoría: GradientShaderVariants
export type GradientShaderVariants =
  | "gradient-neon"
  | "gradient-aurora"
  | "gradient-cyber"
  | "gradient-holographic"
  | "gradient-crystal";

// Define all glass-type variants
export type GlassyVariants =
  | PrismaVariants
  | NebulaVariants
  | AuroraVariants
  | CrystalVariants
  | CosmicVariants
  | ModernGlowVariants
  | ModernShapeVariants
  | RainbowVariants
  | HybridVariants
  | GradientShaderVariants;

// Basic variants + glassy variants
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "gradient"
  | GlassyVariants;

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonRadius = "sm" | "md" | "lg" | "full";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  icon?: ReactNode;

  className?: string;
  target?: "_blank" | "_self";
  href?: string;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLElement>) => void);
  type?: "button" | "submit" | "reset";
  gradientColor?: "purple" | "red"; // For gradient variants
}

export interface ButtonStyleProps {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  hasIcon: boolean;
}
