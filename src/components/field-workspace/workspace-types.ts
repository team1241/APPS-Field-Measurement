export type Unit = "in" | "m";

export interface Preset {
  id: string;
  name: string;
}

export interface WorkspaceSettings {
  points: FieldPoint[];
  preset: string;
  presetPoints: Record<string, FieldPoint[]>;
  presets: Preset[];
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
