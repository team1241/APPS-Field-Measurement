"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DESKTOP_HEADER_QUERY = "(min-width: 900px)";

export const useHeaderMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((current) => !current);
  }, []);

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia(DESKTOP_HEADER_QUERY);

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    desktopMediaQuery.addEventListener("change", handleDesktopChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const eventTarget = event.target;
      if (!(eventTarget instanceof Node)) {
        return;
      }

      const clickedMenu = menuRef.current?.contains(eventTarget) ?? false;
      const clickedTrigger = triggerRef.current?.contains(eventTarget) ?? false;

      if (!(clickedMenu || clickedTrigger)) {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeMenu, isMenuOpen]);

  return { isMenuOpen, menuRef, toggleMenu, triggerRef };
};
