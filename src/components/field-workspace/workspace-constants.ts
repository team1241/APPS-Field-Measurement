import type { WorkspaceSettings } from "./workspace-types";

export const INITIAL_SETTINGS: WorkspaceSettings = {
  points: [],
  preset: "preset-1",
  presetPoints: {
    "preset-1": [],
    "preset-2": [],
    "preset-3": [],
  },
  presets: [
    { id: "preset-1", name: "Preset 1" },
    { id: "preset-2", name: "Preset 2" },
    { id: "preset-3", name: "Preset 3" },
  ],
  showGrid: false,
  unit: "in",
};
