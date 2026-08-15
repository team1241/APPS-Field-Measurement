"use client";

import { useState } from "react";
import { ExportStatus } from "./field-workspace/export-status";
import { FieldPlan } from "./field-workspace/field-plan";
import { useFieldExport } from "./field-workspace/use-field-export";
import { useWorkspaceHistory } from "./field-workspace/use-workspace-history";
import { WorkspaceToolbar } from "./field-workspace/workspace-toolbar";
import type { FieldPoint } from "./field-workspace/workspace-types";

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
  const [points, setPoints] = useState<FieldPoint[]>([]);
  const { exportField, exportState } = useFieldExport(
    imageSrc,
    workspace.settings,
    points
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
      <FieldPlan
        imageHeight={imageHeight}
        imageSrc={imageSrc}
        imageWidth={imageWidth}
        onPointsChange={setPoints}
        points={points}
      />
      <ExportStatus state={exportState} />
    </main>
  );
}
