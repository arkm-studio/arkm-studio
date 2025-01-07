// src/components/Typography/Typography.tsx
import React, { CSSProperties, ElementType } from "react";
import classNames from "classnames/bind";
import styles from "./Typography.module.scss";
import type { TypographyProps, TypographyVariant, ThemeType } from "./types";

const cx = classNames.bind(styles);

const ELEMENT_MAPPING: Record<TypographyVariant, keyof JSX.IntrinsicElements> =
  {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    p1: "p",
    p2: "p",
    p3: "p",
    button: "span",
    label: "span",
  } as const;

export const Typography = <T extends ElementType = "span">({
  as,
  align = "inherit",
  children,
  className = "",
  color,
  fontWeight,
  gutterBottom = false,
  noWrap = false,
  paragraph = false,
  style,
  textTransform = "none",
  variant = "p1",
  theme = "dark",
  ...rest
}: TypographyProps<T>) => {
  const Component = as || ELEMENT_MAPPING[variant];
  const themeType = typeof theme === "string" ? theme : theme.type;

  const rootClassName = cx(
    "typography",
    `typography--${variant}`,
    {
      "typography--truncate": noWrap,
      "typography--gutterBottom": gutterBottom,
      "typography--paragraph": paragraph,
      [`typography--theme-${themeType}`]: themeType,
    },
    color && color !== "inherit" && `typography--${color}`,
    className
  );

  const combinedStyles: CSSProperties = {
    ...(align !== "inherit" && { textAlign: align }),
    ...(textTransform !== "none" && { textTransform }),
    ...(fontWeight && { fontWeight }),
    ...(typeof theme !== "string" &&
      theme.type === "custom" &&
      theme.customValues && {
        color: theme.customValues.text,
      }),
    ...style,
  };

  return (
    <Component className={rootClassName} style={combinedStyles} {...rest}>
      {children}
    </Component>
  );
};

Typography.displayName = "Typography";

export default Typography;
