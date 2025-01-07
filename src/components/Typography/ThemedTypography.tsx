"use client";

import { Typography } from "@/components/Typography";
import { useSettings } from "@/context/SettingsContext";
import type {
  TypographyProps,
  TypographyTheme,
  ThemeType,
} from "@/components/Typography/types";
import classNames from "classnames/bind";
import styles from "@/components/Typography/Typography.module.scss";

const cx = classNames.bind(styles);

export function ThemedTypography<T extends React.ElementType = "p">({
  className,
  theme: customTheme,
  ...props
}: TypographyProps<T>) {
  const { theme: contextTheme } = useSettings();

  // Si customTheme es un string (ThemeType), lo convertimos a TypographyTheme
  const theme: TypographyTheme =
    typeof customTheme === "string"
      ? {
          type: customTheme as ThemeType,
          customValues: {
            text: undefined,
            textSecondary: undefined,
            textTertiary: undefined,
          },
        }
      : customTheme || {
          type: contextTheme,
          customValues: {
            text: undefined,
            textSecondary: undefined,
            textTertiary: undefined,
          },
        };

  return (
    <Typography
      {...props}
      className={cx("typography", className)}
      theme={theme}
    />
  );
}
