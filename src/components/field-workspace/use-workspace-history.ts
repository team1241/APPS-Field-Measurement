"use client";

import { useCallback, useState } from "react";
import { INITIAL_SETTINGS } from "./workspace-constants";
import { workspaceSettingsAreEqual } from "./workspace-settings";
import type {
  FieldPoint,
  Unit,
  WorkspaceHistory,
  WorkspaceSettings,
} from "./workspace-types";

const MAX_POINTS = 2;

export const useWorkspaceHistory = () => {
  const [history, setHistory] = useState<WorkspaceHistory>({
    entries: [INITIAL_SETTINGS],
    index: 0,
  });
  const settings = history.entries[history.index] ?? INITIAL_SETTINGS;

  const updateSettings = useCallback(
    (update: (current: WorkspaceSettings) => WorkspaceSettings) => {
      setHistory((currentHistory) => {
        const currentSettings =
          currentHistory.entries[currentHistory.index] ?? INITIAL_SETTINGS;
        const nextSettings = update(currentSettings);

        if (workspaceSettingsAreEqual(currentSettings, nextSettings)) {
          return currentHistory;
        }

        return {
          entries: [
            ...currentHistory.entries.slice(0, currentHistory.index + 1),
            nextSettings,
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

  const setPreset = useCallback(
    (preset: string) => {
      updateSettings((current) => {
        const points = current.presetPoints[preset];
        if (!points) {
          return current;
        }

        return { ...current, points, preset };
      });
    },
    [updateSettings]
  );

  const addPreset = useCallback(() => {
    updateSettings((current) => {
      const presetNumber = current.presets.length + 1;
      const preset = `preset-${presetNumber}`;
      return {
        ...current,
        points: [],
        preset,
        presetPoints: { ...current.presetPoints, [preset]: [] },
        presets: [
          ...current.presets,
          { id: preset, name: `Preset ${presetNumber}` },
        ],
      };
    });
  }, [updateSettings]);

  const renamePreset = useCallback(
    (presetId: string, name: string) => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return;
      }

      updateSettings((current) => ({
        ...current,
        presets: current.presets.map((preset) =>
          preset.id === presetId ? { ...preset, name: trimmedName } : preset
        ),
      }));
    },
    [updateSettings]
  );

  const addPoint = useCallback(
    (point: FieldPoint) => {
      updateSettings((current) => {
        if (current.points.length >= MAX_POINTS) {
          return current;
        }

        const points = [...current.points, point];
        return {
          ...current,
          points,
          presetPoints: {
            ...current.presetPoints,
            [current.preset]: points,
          },
        };
      });
    },
    [updateSettings]
  );

  const removePoint = useCallback(
    (pointIndex: number) => {
      updateSettings((current) => {
        const points = current.points.filter(
          (_, index) => index !== pointIndex
        );
        return {
          ...current,
          points,
          presetPoints: {
            ...current.presetPoints,
            [current.preset]: points,
          },
        };
      });
    },
    [updateSettings]
  );

  const setUnit = useCallback(
    (unit: Unit) => {
      updateSettings((current) => ({ ...current, unit }));
    },
    [updateSettings]
  );

  const toggleGrid = useCallback(() => {
    updateSettings((current) => ({
      ...current,
      showGrid: !current.showGrid,
    }));
  }, [updateSettings]);

  return {
    addPoint,
    addPreset,
    canRedo: history.index < history.entries.length - 1,
    canUndo: history.index > 0,
    redo,
    removePoint,
    renamePreset,
    setPreset,
    settings,
    setUnit,
    toggleGrid,
    undo,
  };
};
