"use client";

import { ExportStatus } from "./field-workspace/export-status";
import { FieldPlan } from "./field-workspace/field-plan";
import { useFieldExport } from "./field-workspace/use-field-export";
import { useWorkspaceHistory } from "./field-workspace/use-workspace-history";
import { WorkspaceToolbar } from "./field-workspace/workspace-toolbar";

export function FieldWorkspace({ imageSrc }: { imageSrc: string }) {
  const workspace = useWorkspaceHistory();
  const { exportField, exportState } = useFieldExport(
    imageSrc,
    workspace.settings
  );

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-slate-100">
      <WorkspaceToolbar
        canRedo={workspace.canRedo}
        canUndo={workspace.canUndo}
        exportState={exportState}
        onExport={exportField}
        onPresetChange={workspace.setPreset}
        onRedo={workspace.redo}
        onUndo={workspace.undo}
        onUnitChange={workspace.setUnit}
        settings={workspace.settings}
      />
      <FieldPlan imageSrc={imageSrc} />
      <ExportStatus state={exportState} />
    </main>
  );
}
