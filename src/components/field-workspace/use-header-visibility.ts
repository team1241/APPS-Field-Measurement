"use client";

import { useEffect, useState } from "react";

const SCROLL_DIRECTION_THRESHOLD = 6;

export const useHeaderVisibility = (keepVisible: boolean): boolean => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    let previousScrollPosition = window.scrollY;

    if (keepVisible) {
      setIsHeaderVisible(true);
    }

    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const scrollDistance = currentScrollPosition - previousScrollPosition;

      if (keepVisible || currentScrollPosition <= 0) {
        setIsHeaderVisible(true);
      } else if (Math.abs(scrollDistance) >= SCROLL_DIRECTION_THRESHOLD) {
        setIsHeaderVisible(scrollDistance < 0);
      }

      previousScrollPosition = currentScrollPosition;
    };

    const handleWheel = (event: WheelEvent) => {
      if (keepVisible || Math.abs(event.deltaY) < SCROLL_DIRECTION_THRESHOLD) {
        return;
      }

      setIsHeaderVisible(event.deltaY < 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [keepVisible]);

  return isHeaderVisible;
};
