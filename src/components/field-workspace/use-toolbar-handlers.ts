"use client";

import { type ChangeEvent, type MouseEvent, useCallback } from "react";
import type { Preset, Unit } from "./workspace-types";

export const useToolbarHandlers = (
  onPresetChange: (preset: Preset) => void,
  onUnitChange: (unit: Unit) => void
) => {
  const handlePresetChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onPresetChange(event.target.value as Preset);
    },
    [onPresetChange]
  );

  const handleUnitChange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onUnitChange(event.currentTarget.dataset.unit as Unit);
    },
    [onUnitChange]
  );

  return { handlePresetChange, handleUnitChange };
};
