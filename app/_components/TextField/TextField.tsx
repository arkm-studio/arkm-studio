"use client";

import React, { ElementType, useState, useEffect, useCallback } from "react";
import classNames from "classnames/bind";
import { useField } from "formik";
import type { TextFieldProps } from "./types";
import { Typography } from "../Typography";
import styles from "./TextField.module.scss";
import { getIconComponent } from "@/app/_utils/iconUtils";

const cx = classNames.bind(styles);

export const TextField = <T extends ElementType = "div">({
  as,
  className,
  label,
  name,
  icon,
  type = "text",
  variant = "primary",
  theme = { type: "dark" },
  disabled = false,
  labelClassName,
  inputClassName,
  errorClassName,
  showError = false,
  required = false,
  placeholder,
  fontFamily,
  error,
  value,
  onChange,
  ...rest
}: TextFieldProps<T>) => {
  const [field, meta, helpers] = useField({
    name,
    ...(value !== undefined ? { value } : {}),
    ...(onChange ? { onChange } : {}),
  });

  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fieldTouched, setFieldTouched] = useState(false);
  const [valueChanged, setValueChanged] = useState(false);
  const [lastValue, setLastValue] = useState(field.value);

  const Component = as || "div";
  const themeType = typeof theme === "string" ? theme : theme.type;
  const customValues =
    typeof theme === "object" ? theme.customValues : undefined;

  // Manejo de error con soporte para limpieza cuando el valor cambia
  const errorMessage = valueChanged
    ? null
    : error || (meta.error && meta.touched ? meta.error : null);
  const shouldDisplayError = showError && !!errorMessage;

  // Handlers memorizados para evitar recreaciones innecesarias
  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      if (rest.onFocus) {
        rest.onFocus(e);
      }
    },
    [rest]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setFieldTouched(true);
      setValueChanged(false); // Permitir que se muestren errores nuevamente al perder el foco
      field.onBlur(e);
      if (rest.onBlur) {
        rest.onBlur(e);
      }
    },
    [field, rest]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Si ya hay un error mostrado, marcar que el valor ha cambiado
      if (showError && (error || meta.error)) {
        setValueChanged(true);
      }
      field.onChange(e);
      if (onChange) {
        onChange(e);
      }
    },
    [field, showError, error, meta.error, onChange]
  );

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  // Efecto para detectar cambios en el valor
  useEffect(() => {
    if (field.value !== lastValue && showError) {
      setValueChanged(true);
    }
    setLastValue(field.value);
  }, [field.value, lastValue, showError]);

  // Efecto para restablecer valueChanged cuando cambia showError
  useEffect(() => {
    if (showError === false) {
      setValueChanged(false);
    }
  }, [showError]);

  // Efecto para restablecer valueChanged cuando cambia el error
  useEffect(() => {
    if (error || meta.error) {
      setValueChanged(false);
    }
  }, [error, meta.error]);

  const passwordIcon = getIconComponent(
    passwordVisible ? "showPassword" : "hidePassword"
  );

  const rootClassName = cx(
    "textfield",
    `textfield--${variant}`,
    {
      "textfield--disabled": disabled,
      "textfield--error": shouldDisplayError,
      "textfield--not-empty": field.value,
      "textfield--focused": focused,
      "textfield--with-icon": icon,
      [`textfield--theme-${themeType}`]: themeType,
    },
    className
  );

  const style = customValues
    ? ({
        "--textfield-primary": customValues.primary,
        "--textfield-secondary": customValues.secondary,
        "--textfield-background": customValues.background,
        "--textfield-border": customValues.border,
        "--textfield-text": customValues.text,
        "--textfield-label": customValues.label,
        "--textfield-error": customValues.error,
        "--textfield-placeholder": customValues.placeholder,
        "--textfield-focus": customValues.focus,
        "--textfield-autofill-bg": customValues.autofillBg,
        "--textfield-disabled": customValues.disabled,
        "--textfield-disabled-bg": customValues.disabledBg,
      } as React.CSSProperties)
    : undefined;

  return (
    <Component className={rootClassName} style={style}>
      <div className={cx("textfield__input-container")}>
        {label && (
          <Typography
            theme={{ type: themeType }}
            as="label"
            fontWeight={500}
            variant="label"
            color={shouldDisplayError ? "error" : undefined}
            fontFamily={fontFamily}
            className={cx("textfield__label", labelClassName, {
              "textfield__label--focused":
                variant === "secondary" && (focused || field.value),
            })}
            htmlFor={name}
          >
            {label}
            {required && <span className={cx("textfield__required")}> *</span>}
          </Typography>
        )}

        <div className={cx("textfield__input-wrapper")}>
          <input
            {...rest}
            id={name}
            name={name}
            value={field.value}
            onChange={handleChange}
            type={type === "password" && passwordVisible ? "text" : type}
            className={cx("textfield__input", inputClassName)}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={variant === "primary" ? placeholder : ""}
            aria-invalid={shouldDisplayError ? "true" : "false"}
            aria-required={required ? "true" : "false"}
          />

          {(icon || type === "password") && (
            <div
              className={cx("textfield__icon", {
                "textfield__icon--clickable": type === "password",
                "textfield__icon--error": shouldDisplayError,
              })}
              onClick={
                type === "password" ? togglePasswordVisibility : undefined
              }
            >
              {type === "password" ? passwordIcon : icon}
            </div>
          )}
        </div>
      </div>

      {shouldDisplayError && (
        <Typography
          variant="p3"
          color="error"
          theme={{ type: themeType }}
          fontFamily={fontFamily}
          className={cx("textfield__error", errorClassName)}
        >
          {errorMessage}
        </Typography>
      )}
    </Component>
  );
};

TextField.displayName = "TextField";

export default TextField;
