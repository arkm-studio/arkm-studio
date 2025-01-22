// GoogleButton.tsx
import { forwardRef, useState } from "react";
import { signIn } from "next-auth/react";
import classNames from "classnames/bind";
import { Loader } from "lucide-react";
import { Typography } from "../Typography";
import styles from "./GoogleButton.module.scss";

const cx = classNames.bind(styles);

export interface GoogleButtonProps {
  variant?: "default" | "outline" | "flat";
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "full";
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  callbackUrl?: string;
  children?: React.ReactNode;
}

export const GoogleButton = forwardRef<HTMLButtonElement, GoogleButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      radius = "md",
      className,
      disabled = false,
      isLoading: externalLoading = false,
      callbackUrl = "/dashboard",
      children,
    },
    ref
  ) => {
    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const isLoading = externalLoading || isLocalLoading;

    const handleGoogleSignIn = async () => {
      try {
        setIsLocalLoading(true);
        await signIn("google", { callbackUrl });
      } catch (error) {
        console.error("Error signing in with Google:", error);
      } finally {
        setIsLocalLoading(false);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleGoogleSignIn}
        className={cx(
          "google-button",
          `google-button--${variant}`,
          `google-button--${size}`,
          `google-button--radius-${radius}`,
          {
            "google-button--disabled": disabled,
            "google-button--loading": isLoading,
          },
          className
        )}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <Loader className={cx("google-button__spinner")} size={20} />
        ) : (
          <>
            <svg className={cx("google-button__icon")} viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.-.25H12v4.26h5.92c-.26 1.37-1.04 .53-.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-.66l-3.57-.77c-.98.66-.23 1.06-3.71 1.06-.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-.09s.13-1.43.35-.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 .09 14.97 1 12 1 7.7 1 3.99 3.47 .18 7.07l3.66 .84c.87-.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <Typography
              variant="p1"
              className={cx("google-button__text")}
              fontWeight={500}
            >
              {children || "Continue with Google"}
            </Typography>
          </>
        )}
      </button>
    );
  }
);

GoogleButton.displayName = "GoogleButton";
