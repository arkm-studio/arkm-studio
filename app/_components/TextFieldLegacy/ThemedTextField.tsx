// "use client";

// import React, { ElementType, useState } from "react";
// import classNames from "classnames/bind";
// import { useField } from "formik";
// import type { TextFieldProps } from "./types";
// import { ThemedTypography } from "../Typography/ThemedTypography";
// import styles from "./TextField.module.scss";

// const cx = classNames.bind(styles);

// export const ThemedTextField = <T extends ElementType = "div">({
//   as,
//   className,
//   label,
//   name,
//   icon,
//   type = "text",
//   variant = "primary",
//   theme = { type: "light" },
//   disabled = false,
//   labelClassName,
//   inputClassName,
//   errorClassName,
//   showError,
//   placeholder,
//   fontFamily,
//   ...rest
// }: TextFieldProps<T>) => {
//   const [field, meta] = useField(name);
//   const [focused, setFocused] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   const Component = as || "div";
//   const themeType = typeof theme === "string" ? theme : theme.type;
//   const customValues =
//     typeof theme === "object" ? theme.customValues : undefined;

//   const rootClassName = cx(
//     "textfield",
//     `textfield--${variant}`,
//     {
//       "textfield--disabled": disabled,
//       "textfield--error": showError && meta.error && meta.touched,
//       "textfield--not-empty": field.value,
//       "textfield--focused": focused,
//       "textfield--with-icon": icon,
//       [`textfield--theme-${themeType}`]: themeType,
//     },
//     className
//   );

//   const style = customValues
//     ? ({
//         "--textfield-primary": customValues.primary,
//         "--textfield-secondary": customValues.secondary,
//         "--textfield-background": customValues.background,
//         "--textfield-border": customValues.border,
//         "--textfield-text": customValues.text,
//         "--textfield-label": customValues.label,
//         "--textfield-error": customValues.error,
//         "--textfield-placeholder": customValues.placeholder,
//         "--textfield-focus": customValues.focus,
//       } as React.CSSProperties)
//     : undefined;

//   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     setFocused(true);
//     field.onBlur(e);
//   };

//   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
//     setFocused(false);
//     field.onBlur(e);
//   };

//   const togglePasswordVisibility = () => {
//     setPasswordVisible((prev) => !prev);
//   };

//   return (
//     <Component className={rootClassName} style={style}>
//       <div className={cx("textfield__input-container")}>
//         {label && (
//           <ThemedTypography
//             as="label"
//             variant="label"
//             fontFamily={fontFamily} // Se pasa la fuente
//             className={cx("textfield__label", labelClassName, {
//               "textfield__label--focused":
//                 variant === "secondary" && (focused || field.value),
//             })}
//             htmlFor={name}
//           >
//             {label}
//           </ThemedTypography>
//         )}

//         <div className={cx("textfield__input-wrapper")}>
//           <input
//             {...field}
//             {...rest}
//             id={name}
//             type={type === "password" && passwordVisible ? "text" : type}
//             className={cx("textfield__input", inputClassName)}
//             disabled={disabled}
//             onFocus={handleFocus}
//             onBlur={handleBlur}
//             placeholder={variant === "primary" ? placeholder : ""}
//           />

//           {icon && (
//             <div
//               className={cx("textfield__icon", {
//                 "textfield__icon--clickable": type === "password",
//               })}
//               onClick={
//                 type === "password" ? togglePasswordVisibility : undefined
//               }
//             >
//               {icon}
//             </div>
//           )}
//         </div>
//       </div>

//       {showError && meta.error && meta.touched && (
//         <ThemedTypography
//           variant="p3"
//           fontFamily={fontFamily} // Se pasa la fuente
//           className={cx("textfield__error", errorClassName)}
//         >
//           {meta.error}
//         </ThemedTypography>
//       )}
//     </Component>
//   );
// };

// ThemedTextField.displayName = "TextField";

// export default ThemedTextField;
