"use client";

import React, { useEffect, useMemo, useState } from "react";
import classnames from "classnames/bind";
import {
  DEFAULT_HEADER_CONFIG,
  HeaderProps,
  HeaderState,
} from "./types/header.types";
import { createIconElement } from "../../_utils/iconUtils";

import { HeaderContext } from "./context";
import { useLanguage } from "../../_context/LanguageContext";

import { useHeaderScroll } from "./hooks";

import { MenuList } from "../MenuList";
import { Header } from "./Header";
import LanguageSelector from "../LanguageSelector";

import styles from "./styles/Header.module.scss";
import Brand from "../Brand";

const cx = classnames.bind(styles);

const HeaderClient: React.FC<HeaderProps> = ({
  dictionary,
  variant = DEFAULT_HEADER_CONFIG.variant,
  appearance = DEFAULT_HEADER_CONFIG.appearance,
  breakpoint = DEFAULT_HEADER_CONFIG.breakpoint,
  menuPosition = DEFAULT_HEADER_CONFIG.menuPosition,
  className,
}) => {
  const { language, setLanguage } = useLanguage();

  const isScrolled = useHeaderScroll(0);
  const [menuState, setMenuState] = useState<HeaderState>({
    isNavOpen: false,
  });

  // Extraer las opciones de idioma del diccionario
  const languageOptions = useMemo(() => {
    return [
      {
        code: "en",
        label: dictionary.languageOptions.english.label,
        aria: dictionary.languageOptions.english.aria,
        countryCode: "GB", // Código ISO para Reino Unido
      },
      {
        code: "es",
        label: dictionary.languageOptions.spanish.label,
        aria: dictionary.languageOptions.spanish.aria,
        countryCode: "ES", // Código ISO para España
      },
    ];
  }, [dictionary.languageOptions]);

  // Process primary navigation items to map icon strings to React components
  const primaryNavigationItems = useMemo(() => {
    return Object.values(dictionary.navigation.primary).map((item) => {
      // Create icon component if an icon name is provided
      const iconElement =
        typeof item.icon === "string"
          ? createIconElement(item.icon, { size: 18, strokeWidth: 2 })
          : item.icon;

      // If the element has showDropdownIcon, create a dropdown icon
      const dropdownIcon = item.showDropdownIcon
        ? createIconElement("dropDown", { size: 14, strokeWidth: 2 })
        : undefined;

      return {
        ...item,
        icon: iconElement,
        dropdownIcon,
      };
    });
  }, [dictionary.navigation.primary]);

  // Process secondary navigation items similarly
  const secondaryNavigationItems = useMemo(() => {
    return Object.values(dictionary.navigation.secondary).map((item) => {
      const iconElement =
        typeof item.icon === "string"
          ? createIconElement(item.icon, { size: 18, strokeWidth: 2 })
          : item.icon;

      const dropdownIcon = item.showDropdownIcon
        ? createIconElement("dropDown", { size: 14, strokeWidth: 2 })
        : undefined;

      return {
        ...item,
        icon: iconElement,
        dropdownIcon,
      };
    });
  }, [dictionary.navigation.secondary]);

  const setIsNavOpen = (isOpen: boolean) =>
    setMenuState((prev) => ({ ...prev, isNavOpen: isOpen }));

  const contextValue = useMemo(
    () => ({
      dictionary,
      variant,
      appearance,
      breakpoint,
      menuPosition,
      isScrolled,
      isNavOpen: menuState.isNavOpen,
      setIsNavOpen,
    }),
    [
      dictionary,
      variant,
      appearance,
      breakpoint,
      menuPosition,
      isScrolled,
      menuState.isNavOpen,
    ]
  );

  const handleMenuClick = () => {
    if (menuState.isNavOpen) {
      setIsNavOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = menuState.isNavOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuState.isNavOpen]);

  if (!primaryNavigationItems?.length) return null;

  return (
    <HeaderContext.Provider value={contextValue}>
      <Header.Root
        className={cx(
          "header",
          {
            "header--glass": menuState.isNavOpen,
            "header--scrolled": isScrolled,
          },
          className
        )}
      >
        <Header.Content>
          <Header.Nav>
            {/* Desktop Menu */}
            <div className={cx("header__menu-group", "header__desktop-menu")}>
              <MenuList
                // frontPageID={language || 1}
                data={primaryNavigationItems}
                onClick={handleMenuClick}
                useActiveStyle
                locale={language}
              />
            </div>

            {/* Mobile Language Selector (left) */}
            <div className={cx("header__mobile-language-toggle")}>
              <LanguageSelector
                className={cx("header__mobile-language-selector")}
                variant="rounded-dropdown-with-icon"
                currentLanguage={language}
                onLanguageChange={setLanguage}
                options={languageOptions}
              />
            </div>

            {/* Logo (centered in both desktop and mobile) */}
            <div className={cx("header__logo")}>
              <Brand size="lg" />
            </div>

            {/* Desktop Actions */}
            <div
              className={cx("header__actions-group", "header__desktop-actions")}
            >
              <MenuList
                // frontPageID={language || 1}
                data={secondaryNavigationItems}
                onClick={handleMenuClick}
                useActiveStyle
                locale={language}
              />
              <LanguageSelector
                className={cx("header__language-selector")}
                variant="rounded-dropdown-with-icon"
                currentLanguage={language}
                onLanguageChange={setLanguage}
                options={languageOptions}
              />
            </div>

            {/* Mobile Menu Toggle (right) */}
            <div className={cx("header__mobile-menu-toggle")}>
              <Header.MenuToggle />
            </div>

            {/* Mobile Menu (shown when isNavOpen is true) */}
            {menuState.isNavOpen && (
              <Header.MobileMenu
                primaryNavigation={primaryNavigationItems}
                secondaryNavigation={secondaryNavigationItems}
                locale={language}
              />
            )}
          </Header.Nav>
        </Header.Content>
      </Header.Root>
    </HeaderContext.Provider>
  );
};

export default HeaderClient;
