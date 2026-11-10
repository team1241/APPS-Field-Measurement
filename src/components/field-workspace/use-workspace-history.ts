"use client";

import { useCallback, useState } from "react";
import { INITIAL_SETTINGS } from "./workspace-constants";
import type {
  FieldPoint,
  Unit,
  WorkspaceHistory,
  WorkspaceSettings,
} from "./workspace-types";

const MAX_POINTS = 2;

interface WorkspaceState
  extends Omit<WorkspaceSettings, "points" | "presetPoints"> {
  histories: Record<string, WorkspaceHistory>;
}

const getHistoryPoints = (history: WorkspaceHistory): FieldPoint[] =>
  history.entries[history.index] ?? [];

export const useWorkspaceHistory = () => {
  const [state, setState] = useState<WorkspaceState>(() => ({
    histories: Object.fromEntries(
      Object.entries(INITIAL_SETTINGS.presetPoints).map(([preset, points]) => [
        preset,
        { entries: [points], index: 0 },
      ])
    ),
    preset: INITIAL_SETTINGS.preset,
    presets: INITIAL_SETTINGS.presets,
    showGrid: INITIAL_SETTINGS.showGrid,
    unit: INITIAL_SETTINGS.unit,
  }));
  const history = state.histories[state.preset];
  const settings: WorkspaceSettings = {
    points: getHistoryPoints(history),
    preset: state.preset,
    presetPoints: Object.fromEntries(
      Object.entries(state.histories).map(([preset, presetHistory]) => [
        preset,
        getHistoryPoints(presetHistory),
      ])
    ),
    presets: state.presets,
    showGrid: state.showGrid,
    unit: state.unit,
  };

  const updateHistory = useCallback(
    (update: (current: WorkspaceHistory) => WorkspaceHistory) => {
      setState((current) => {
        const currentHistory = current.histories[current.preset];
        const nextHistory = update(currentHistory);
        if (currentHistory === nextHistory) {
          return current;
        }
        return {
          ...current,
          histories: { ...current.histories, [current.preset]: nextHistory },
        };
      });
    },
    []
  );

  const updatePoints = useCallback(
    (update: (current: FieldPoint[]) => FieldPoint[]) => {
      updateHistory((currentHistory) => {
        const currentPoints = getHistoryPoints(currentHistory);
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
    [updateHistory]
  );

  const undo = useCallback(() => {
    updateHistory((current) => ({
      ...current,
      index: Math.max(0, current.index - 1),
    }));
  }, [updateHistory]);

  const redo = useCallback(() => {
    updateHistory((current) => ({
      ...current,
      index: Math.min(current.entries.length - 1, current.index + 1),
    }));
  }, [updateHistory]);

  const setPreset = useCallback((preset: string) => {
    setState((current) =>
      current.presets.some(({ id }) => id === preset)
        ? { ...current, preset }
        : current
    );
  }, []);

  const addPreset = useCallback(() => {
    setState((current) => {
      const presetNumber = current.presets.length + 1;
      const preset = `preset-${presetNumber}`;
      return {
        ...current,
        histories: {
          ...current.histories,
          [preset]: { entries: [[]], index: 0 },
        },
        preset,
        presets: [
          ...current.presets,
          { id: preset, name: `Preset ${presetNumber}` },
        ],
      };
    });
  }, []);

  const renamePreset = useCallback((presetId: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    setState((current) => ({
      ...current,
      presets: current.presets.map((preset) =>
        preset.id === presetId ? { ...preset, name: trimmedName } : preset
      ),
    }));
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
    setState((current) => ({ ...current, unit }));
  }, []);

  const toggleGrid = useCallback(() => {
    setState((current) => ({ ...current, showGrid: !current.showGrid }));
  }, []);

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
