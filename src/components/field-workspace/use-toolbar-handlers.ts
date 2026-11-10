"use client";

import { type MouseEvent, useCallback } from "react";
import type { Unit } from "./workspace-types";

export const useToolbarHandlers = (onUnitChange: (unit: Unit) => void) => {
  const handleUnitChange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onUnitChange(event.currentTarget.dataset.unit as Unit);
    },
    [onUnitChange]
  );

  return { handleUnitChange };
};
