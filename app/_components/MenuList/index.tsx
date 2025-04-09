"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import classnames from "classnames/bind";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import useScrollActiveSection from "@/app/_hooks/useScrollActiveSection";
import { Typography } from "@/app/_components/Typography";
import { buildLocalizedPath } from "@/app/_utils/path";
import { Language } from "@/app/_lib/config/i18n";
import styles from "./MenuList.module.scss";

// Register GSAP plugins
gsap.registerPlugin(ScrollToPlugin);

/**
 * Interface for MenuItem objects from the API
 */
export interface MenuItem {
  menu_item_id: number;
  menu_item_parent: number;
  title: string;
  href: string;
  target?: string;
  icon?: React.ReactElement;
  dropdownIcon?: React.ReactElement;
  showDropdownIcon?: boolean;
  isSectionLink?: boolean;
}

/**
 * Props for the MenuList component
 */
interface MenuListProps {
  /** Array of menu items */
  data: MenuItem[];
  /** ID of the front/home page */
  frontPageID?: number | string;
  /** Optional callback function when a menu item is clicked */
  onClick?: () => void;
  /** Whether to highlight the active menu item */
  useActiveStyle?: boolean;
  /** Orientation of the menu */
  orientation?: "horizontal" | "vertical";
  /** Gap between menu items in pixels */
  gap?: number;
  /** Whether to show borders between menu items */
  showBorders?: boolean;
  /** Current locale (language code) */
  locale?: Language;
}

const cx = classnames.bind(styles);

/**
 * MenuList component that renders a navigation menu with support for
 * submenu items, smooth scrolling, and active state tracking.
 */
export const MenuList: React.FC<MenuListProps> = ({
  data,
  frontPageID,
  onClick,
  useActiveStyle = true,
  orientation = "horizontal",
  gap = 24,
  showBorders = false,
  locale = "en", // Default to English if not provided
}) => {
  if (!data || !Array.isArray(data)) return null;

  const router = useRouter();
  const pathname = usePathname();

  // State for mobile viewport detection
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // State for tracking active menu item
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Refs for DOM elements and state tracking
  const ref = useRef<HTMLUListElement>(null); // Menu list reference
  const menuRef = useRef<HTMLUListElement>(null); // Menu container reference
  const menuItemRefs = useRef<Array<HTMLLIElement | null>>([]); // Individual menu items
  const handledInitialScroll = useRef(false); // Track if initial scroll has been handled
  const previousPathname = useRef(""); // Track previous pathname for navigation changes

  // Split menu items into top-level and submenu items
  const topMenuItems = data.filter((item) => item.menu_item_parent === 0);
  const submenuItems = data.filter((item) => item.menu_item_parent !== 0);

  // Extract section IDs for the scrolling hook
  const sectionIds = data
    .filter((item) => item.href.startsWith("#"))
    .map((item) => item.href.replace("#", ""));

  // Get active section ID from custom hook
  const activeSectionId = useScrollActiveSection(sectionIds);

  // Set CSS variable for menu gap
  const menuStyle = {
    "--menu-gap": `${gap}px`,
  } as React.CSSProperties;

  /**
   * Handles smooth scrolling to a section
   * @param href - The hash link to scroll to (e.g., "#contact")
   */
  const handleScrollToSection = useCallback((href: string) => {
    const targetElement = document.querySelector(href);

    if (targetElement) {
      const offset = 120; // Additional offset from the top

      gsap.to(window, {
        duration: 1, // Animation duration
        scrollTo: {
          y: targetElement,
          offsetY: offset,
        },
      });
    }
  }, []);

  /**
   * Handles click events on menu items
   * @param e - React mouse event
   * @param href - URL to navigate to
   * @param hasSubmenu - Whether the item has a submenu
   * @param menuItemId - ID of the menu item
   */
  const handleMenuClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      href: string,
      hasSubmenu: boolean,
      menuItemId: number
    ) => {
      // Para submenú móvil
      if (isMobile && hasSubmenu) {
        e.preventDefault();
        setActiveIndex(activeIndex === menuItemId ? null : menuItemId);
      }
      // Para enlaces con hash (navegación por secciones)
      else if (href.includes("#")) {
        e.preventDefault();

        // Extraer la parte del hash
        const hashPart = href.substring(href.indexOf("#"));

        // Verificar si estamos en la página de inicio
        const isHomePage =
          pathname === "/" ||
          pathname === `/${locale}` ||
          pathname === `/${locale}/`;

        if (!isHomePage) {
          // Navegar a la página de inicio con el hash
          router.push(`/${locale}/${hashPart}`);

          // Esperar a que se complete la navegación y luego desplazarse a la sección
          setTimeout(() => {
            handleScrollToSection(hashPart);
          }, 100);
        } else {
          // Ya en la página de inicio, solo desplazarse
          handleScrollToSection(hashPart);
        }

        setActiveIndex(menuItemId);
        if (onClick) onClick();
      } else {
        // Enlaces regulares - aquí implementamos el scroll al inicio
        e.preventDefault();

        // Navegar a la URL deseada
        router.push(href);

        // Hacer scroll al inicio después de la navegación
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth", // o 'auto' para scroll instantáneo
          });
        }, 100);

        if (onClick) {
          onClick();
        }
      }
    },
    [
      isMobile,
      activeIndex,
      pathname,
      locale,
      router,
      onClick,
      handleScrollToSection,
    ]
  );
  // Effect to detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1360);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to handle clicks outside the menu (for desktop)
  useEffect(() => {
    if (!isMobile && ref.current) {
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (!ref.current?.contains(event.target as Node)) {
          // Close any open submenu
          setActiveIndex(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }
  }, [isMobile]);

  // Effect to update active menu item based on current route/section
  useEffect(() => {
    // First check if there's an active section
    if (activeSectionId) {
      const activeItem = data.find(
        (item) => item.href === `#${activeSectionId}`
      );
      if (activeItem) {
        setActiveIndex(activeItem.menu_item_id);
        return;
      }
    }

    // If no active section, check if current path matches any menu item
    if (pathname) {
      // Remove locale prefix for comparison
      const pathnameWithoutLocale = pathname.replace(
        new RegExp(`^/${locale}`),
        ""
      );

      // Check top-level menu items
      const matchingItem = topMenuItems.find((item) => {
        return (
          pathnameWithoutLocale === item.href ||
          (pathnameWithoutLocale.startsWith(item.href) && item.href !== "/")
        );
      });

      if (matchingItem) {
        setActiveIndex(matchingItem.menu_item_id);
      } else {
        // Check submenu items
        const matchingSubmenuItem = submenuItems.find((item) => {
          return (
            pathnameWithoutLocale === item.href ||
            (pathnameWithoutLocale.startsWith(item.href) && item.href !== "/")
          );
        });

        if (matchingSubmenuItem) {
          // Activate parent menu item
          setActiveIndex(matchingSubmenuItem.menu_item_parent);
        } else {
          // No matches, deactivate all
          setActiveIndex(null);
        }
      }
    } else {
      setActiveIndex(null);
    }
  }, [pathname, activeSectionId, data, topMenuItems, submenuItems, locale]);

  // Effect to handle scrolling to section when URL has a hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if we're on the home page
      const isHomePage =
        pathname === "/" ||
        pathname === `/${locale}` ||
        pathname === `/${locale}/`;

      const hash = window.location.hash;

      // Check if we changed pages
      const hasChangedPage = previousPathname.current !== pathname;
      previousPathname.current = pathname;

      // Scroll when:
      // 1. We're on the home page AND there's a hash
      // 2. AND (we changed pages OR haven't handled initial scroll)
      if (
        isHomePage &&
        hash &&
        (hasChangedPage || !handledInitialScroll.current)
      ) {
        // Small delay to ensure DOM elements are ready
        setTimeout(() => {
          handleScrollToSection(hash);
          handledInitialScroll.current = true;
        }, 100);
      } else if (!hash || hasChangedPage) {
        // Reset flag when:
        // - No hash in URL
        // - Or we changed to a different page
        handledInitialScroll.current = false;
      }
    }
  }, [pathname, handleScrollToSection, locale]);

  // Effect to update the active indicator position
  useLayoutEffect(() => {
    if (menuRef.current) {
      if (
        useActiveStyle &&
        activeIndex !== null &&
        menuItemRefs.current.length
      ) {
        const activeItemIndex = topMenuItems.findIndex(
          (item) => item.menu_item_id === activeIndex
        );

        const activeItem = menuItemRefs.current[activeItemIndex];
        if (activeItem) {
          const menuElement = menuRef.current;
          const itemRect = activeItem.getBoundingClientRect();
          const menuRect = menuElement.getBoundingClientRect();

          // Calculate position for the active indicator
          const left = itemRect.left - menuRect.left;
          const width = itemRect.width;

          // Set CSS variables for indicator position
          menuElement.style.setProperty("--indicator-left", `${left}px`);
          menuElement.style.setProperty("--indicator-width", `${width}px`);
        }
      } else {
        // Hide indicator when no active item
        menuRef.current.style.setProperty("--indicator-width", `0px`);
      }
    }
  }, [useActiveStyle, activeIndex, topMenuItems]);

  // Render top-level menu items and their submenus
  const menu = topMenuItems.map((menuItem, index) => {
    // Get localized path
    const path = buildLocalizedPath(menuItem.href, locale);

    // Find child submenu items
    const childSubmenuItems = submenuItems.filter(
      (item) => item.menu_item_parent === menuItem.menu_item_id
    );

    const hasSubmenu = childSubmenuItems.length > 0;
    const isActive = activeIndex === menuItem.menu_item_id;

    return (
      <li
        key={menuItem.menu_item_id}
        ref={(el) => {
          menuItemRefs.current[index] = el;
        }}
        className={cx("menu__item", {
          "menu__item--active": useActiveStyle && isActive,
          "menu__item--border":
            showBorders && index !== topMenuItems.length - 1,
        })}
      >
        <Link
          href={path}
          target={menuItem.target}
          className={cx("menu__link")}
          onClick={(e) =>
            handleMenuClick(e, path, hasSubmenu, menuItem.menu_item_id)
          }
        >
          {menuItem.icon && (
            <span className={cx("menu__icon")}>{menuItem.icon}</span>
          )}

          <Typography
            variant="p1"
            theme="dark"
            fontFamily="sofia"
            fontWeight={500}
            className={cx("menu__link-text")}
          >
            {menuItem.title}
          </Typography>

          {hasSubmenu &&
            menuItem.showDropdownIcon !== false &&
            (menuItem.dropdownIcon || (
              <span className={cx("dropdown__icon")}>▼</span>
            ))}
        </Link>

        {hasSubmenu && (
          <ul
            className={cx("submenu", {
              "submenu--open": isActive,
              "submenu--vertical": orientation === "vertical",
            })}
          >
            {childSubmenuItems.map((submenuItem) => {
              const subpath = buildLocalizedPath(submenuItem.href, locale);

              return (
                <li
                  key={submenuItem.menu_item_id}
                  className={cx("submenu__item")}
                >
                  <Link
                    href={subpath}
                    className={cx("submenu__link")}
                    onClick={onClick}
                    target={submenuItem.target}
                  >
                    {submenuItem.icon && (
                      <span className={cx("submenu__icon")}>
                        {submenuItem.icon}
                      </span>
                    )}

                    <Typography
                      variant="p3"
                      fontFamily="sofia"
                      theme="dark"
                      textTransform="uppercase"
                    >
                      {submenuItem.title}
                    </Typography>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  });

  return (
    <ul
      ref={menuRef}
      className={cx("menu", {
        "menu--vertical": orientation === "vertical",
      })}
      style={menuStyle}
    >
      {menu}
    </ul>
  );
};

export default MenuList;
