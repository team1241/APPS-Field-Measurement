import type { WorkspaceSettings } from "./workspace-types";

export const workspaceSettingsAreEqual = (
  first: WorkspaceSettings,
  second: WorkspaceSettings
): boolean =>
  first.points === second.points &&
  first.preset === second.preset &&
  first.showGrid === second.showGrid &&
  first.unit === second.unit;
