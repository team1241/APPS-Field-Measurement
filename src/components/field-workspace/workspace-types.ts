export type Preset = "preset-1" | "preset-2" | "preset-3";
export type Unit = "in" | "m";

export interface WorkspaceSettings {
  points: FieldPoint[];
  preset: Preset;
  showGrid: boolean;
  unit: Unit;
}

export interface WorkspaceHistory {
  entries: WorkspaceSettings[];
  index: number;
}

export interface FieldPoint {
  x: number;
  y: number;
}

export type ExportState = "error" | "exporting" | "idle" | "success";
