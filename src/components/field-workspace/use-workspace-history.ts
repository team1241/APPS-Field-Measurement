"use client";

import { useCallback, useState } from "react";
import { INITIAL_SETTINGS } from "./workspace-constants";
import type {
  FieldPoint,
  Preset,
  Unit,
  WorkspaceHistory,
  WorkspaceSettings,
} from "./workspace-types";

const MAX_POINTS = 2;

export const useWorkspaceHistory = () => {
  const [viewSettings, setViewSettings] =
    useState<Omit<WorkspaceSettings, "points">>(INITIAL_SETTINGS);
  const [history, setHistory] = useState<WorkspaceHistory>({
    entries: [INITIAL_SETTINGS.points],
    index: 0,
  });
  const settings: WorkspaceSettings = {
    ...viewSettings,
    points: history.entries[history.index] ?? INITIAL_SETTINGS.points,
  };

  const updatePoints = useCallback(
    (update: (current: FieldPoint[]) => FieldPoint[]) => {
      setHistory((currentHistory) => {
        const currentPoints =
          currentHistory.entries[currentHistory.index] ??
          INITIAL_SETTINGS.points;
        const nextPoints = update(currentPoints);

        if (currentPoints === nextPoints) {
          return currentHistory;
        }

        return {
          entries: [
            ...currentHistory.entries.slice(0, currentHistory.index + 1),
            nextPoints,
          ],
          index: currentHistory.index + 1,
        };
      });
    },
    []
  );

  const undo = useCallback(() => {
    setHistory((currentHistory) => ({
      ...currentHistory,
      index: Math.max(0, currentHistory.index - 1),
    }));
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => ({
      ...currentHistory,
      index: Math.min(
        currentHistory.entries.length - 1,
        currentHistory.index + 1
      ),
    }));
  }, []);

  const setPreset = useCallback((preset: Preset) => {
    setViewSettings((current) => ({ ...current, preset }));
  }, []);

  const addPoint = useCallback(
    (point: FieldPoint) => {
      updatePoints((current) =>
        current.length >= MAX_POINTS ? current : [...current, point]
      );
    },
    [updatePoints]
  );

  const removePoint = useCallback(
    (pointIndex: number) => {
      updatePoints((current) =>
        current.some((_, index) => index === pointIndex)
          ? current.filter((_, index) => index !== pointIndex)
          : current
      );
    },
    [updatePoints]
  );

  const setUnit = useCallback((unit: Unit) => {
    setViewSettings((current) => ({ ...current, unit }));
  }, []);

  const toggleGrid = useCallback(() => {
    setViewSettings((current) => ({
      ...current,
      showGrid: !current.showGrid,
    }));
  }, []);

  return {
    addPoint,
    canRedo: history.index < history.entries.length - 1,
    canUndo: history.index > 0,
    redo,
    removePoint,
    setPreset,
    settings,
    setUnit,
    toggleGrid,
    undo,
  };
};
