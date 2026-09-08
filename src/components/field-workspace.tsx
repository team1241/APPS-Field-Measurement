"use client";

import { ExportStatus } from "./field-workspace/export-status";
import { FieldPlan } from "./field-workspace/field-plan";
import { useFieldExport } from "./field-workspace/use-field-export";
import { useWorkspaceHistory } from "./field-workspace/use-workspace-history";
import { WorkspaceToolbar } from "./field-workspace/workspace-toolbar";

interface FieldWorkspaceProps {
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
}

export function FieldWorkspace({
  imageHeight,
  imageSrc,
  imageWidth,
}: FieldWorkspaceProps) {
  const workspace = useWorkspaceHistory();
  const { exportField, exportState } = useFieldExport(
    imageSrc,
    workspace.settings,
    workspace.settings.points
  );

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-slate-100">
      <WorkspaceToolbar
        canRedo={workspace.canRedo}
        canUndo={workspace.canUndo}
        exportState={exportState}
        onAddPreset={workspace.addPreset}
        onExport={exportField}
        onGridToggle={workspace.toggleGrid}
        onPresetChange={workspace.setPreset}
        onRedo={workspace.redo}
        onRenamePreset={workspace.renamePreset}
        onUndo={workspace.undo}
        onUnitChange={workspace.setUnit}
        settings={workspace.settings}
      />
      <FieldPlan
        imageHeight={imageHeight}
        imageSrc={imageSrc}
        imageWidth={imageWidth}
        onAddPoint={workspace.addPoint}
        onRemovePoint={workspace.removePoint}
        points={workspace.settings.points}
        showGrid={workspace.settings.showGrid}
        unit={workspace.settings.unit}
      />
      <ExportStatus state={exportState} />
    </main>
  );
}
