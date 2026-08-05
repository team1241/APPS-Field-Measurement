"use client";

import { useCallback, useState } from "react";
import { INITIAL_SETTINGS } from "./workspace-constants";
import { workspaceSettingsAreEqual } from "./workspace-settings";
import type {
  Preset,
  Unit,
  WorkspaceHistory,
  WorkspaceSettings,
} from "./workspace-types";

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
    (preset: Preset) => {
      updateSettings((current) => ({ ...current, preset }));
    },
    [updateSettings]
  );

  const setUnit = useCallback(
    (unit: Unit) => {
      updateSettings((current) => ({ ...current, unit }));
    },
    [updateSettings]
  );

  return {
    canRedo: history.index < history.entries.length - 1,
    canUndo: history.index > 0,
    redo,
    setPreset,
    settings,
    setUnit,
    undo,
  };
};
