// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import classNames from "classnames/bind";
// import type { DropdownProps, Option } from "./types";
// import { ThemedTypography } from "../Typography/ThemedTypography";
// import styles from "./Dropdown.module.scss";

// const cx = classNames.bind(styles);

// export const ThemedDropdown: React.FC<DropdownProps> = ({
//   label,
//   id,
//   options,
//   selected,
//   onSelectedChange,
//   className,
//   closeOnScroll = false,
//   theme = { type: "light" },
//   icon,
//   maxHeight = "200px",
//   disabled = false,
//   variant = "default",
//   fontFamily,
// }) => {
//   const [open, setOpen] = useState(false);
//   const ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const onBodyClick = (event: MouseEvent) => {
//       if (ref.current?.contains(event.target as Node)) return;
//       setOpen(false);
//     };

//     const onScroll = () => {
//       if (closeOnScroll) setOpen(false);
//     };

//     document.body.addEventListener("click", onBodyClick, { capture: true });
//     if (closeOnScroll) window.addEventListener("scroll", onScroll);

//     return () => {
//       document.body.removeEventListener("click", onBodyClick, {
//         capture: true,
//       });
//       if (closeOnScroll) window.removeEventListener("scroll", onScroll);
//     };
//   }, [closeOnScroll]);

//   const sortedOptions = React.useMemo(() => {
//     return [...options].sort((a, b) => {
//       const valueA = parseInt(a.value, 10);
//       const valueB = parseInt(b.value, 10);
//       return !isNaN(valueA) && !isNaN(valueB) ? valueA - valueB : 0;
//     });
//   }, [options]);

//   const handleOptionSelect = (option: Option) => {
//     if (disabled) return;
//     onSelectedChange?.(option);
//     setOpen(false);
//   };

//   const toggleDropdown = () => {
//     if (disabled) return;
//     setOpen(!open);
//   };

//   const customStyles = theme.customValues
//     ? ({
//         "--dropdown-primary": theme.customValues.primary,
//         "--dropdown-secondary": theme.customValues.secondary,
//         "--dropdown-background": theme.customValues.background,
//         "--dropdown-border": theme.customValues.border,
//         "--dropdown-text": theme.customValues.text,
//         "--dropdown-disabled": theme.customValues.disabled,
//         "--dropdown-disabled-bg": theme.customValues.disabledBg,
//       } as React.CSSProperties)
//     : undefined;

//   const renderedOptions = sortedOptions.map((option, i) => {
//     if (option.value === selected.value) return null;
//     return (
//       <div
//         key={i}
//         className={cx("dropdown__item")}
//         onClick={() => handleOptionSelect(option)}
//         role="option"
//         aria-selected={false}
//         tabIndex={0}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" || e.key === " ") {
//             handleOptionSelect(option);
//             e.preventDefault();
//           }
//         }}
//       >
//         <div className={cx("dropdown__item-content")}>
//           {typeof option.label === "string" ? (
//             <ThemedTypography
//               variant="p2"
//               fontWeight={500}
//               fontFamily={fontFamily}
//               className={cx("dropdown__item-text")}
//             >
//               {option.label}
//             </ThemedTypography>
//           ) : (
//             option.label
//           )}
//         </div>
//       </div>
//     );
//   });

//   return (
//     <div
//       ref={ref}
//       className={cx("dropdownWrapper", `dropdownWrapper--theme-${theme.type}`)}
//       style={customStyles}
//     >
//       {label && variant !== "placeholderInput" && (
//         <ThemedTypography
//           as="label"
//           variant="label"
//           fontFamily={fontFamily}
//           className={cx("dropdown__label", {
//             "dropdown__label--disabled": disabled,
//           })}
//           htmlFor={id}
//         >
//           {label}
//         </ThemedTypography>
//       )}

//       <div className={cx("field")}>
//         <div className={cx("dropdownContainer")}>
//           <div
//             onClick={toggleDropdown}
//             className={cx(
//               "dropdown",
//               `dropdown--theme-${theme.type}`,
//               `dropdown--variant-${
//                 variant === "tertiary" || variant === "placeholderInput"
//                   ? "default"
//                   : variant
//               }`,
//               className,
//               { "dropdown--active": open, "dropdown--disabled": disabled }
//             )}
//             id={id}
//             aria-haspopup="listbox"
//             aria-expanded={open}
//             aria-disabled={disabled}
//             role="button"
//             tabIndex={disabled ? -1 : 0}
//             onKeyDown={(e) => {
//               if (disabled) return;
//               if (e.key === "Enter" || e.key === " ") {
//                 toggleDropdown();
//                 e.preventDefault();
//               }
//             }}
//           >
//             <div
//               className={cx("dropdown__text", {
//                 "dropdown__text--disabled": disabled,
//                 "dropdown__text--tertiary": variant === "tertiary",
//               })}
//             >
//               <div className={cx("dropdown__selected")}>
//                 {typeof selected.label === "string" ? (
//                   <ThemedTypography
//                     variant="p2"
//                     fontWeight={500}
//                     fontFamily={fontFamily}
//                     className={cx("dropdown__item-text")}
//                   >
//                     {selected.label}
//                   </ThemedTypography>
//                 ) : (
//                   selected.label
//                 )}
//               </div>
//               <div
//                 className={cx("dropdown__icon", {
//                   "dropdown__icon--active": open,
//                 })}
//               >
//                 {icon}
//               </div>
//             </div>

//             {open && !disabled && (
//               <div
//                 className={cx("dropdown__menu", {
//                   "dropdown__menu--active": open,
//                 })}
//                 role="listbox"
//                 style={{ maxHeight }}
//               >
//                 {renderedOptions}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThemedDropdown;
