"use client";

import { useCallback, useState } from "react";
import { downloadBlob } from "./download-blob";
import { exportFieldImage } from "./export-field-image";
import type {
  ExportState,
  FieldPoint,
  WorkspaceSettings,
} from "./workspace-types";

export const useFieldExport = (
  imageSrc: string,
  settings: WorkspaceSettings,
  points: FieldPoint[]
) => {
  const [exportState, setExportState] = useState<ExportState>("idle");

  const exportField = useCallback(async () => {
    setExportState("exporting");

    try {
      const exportBlob = await exportFieldImage(imageSrc, points);
      downloadBlob(
        exportBlob,
        `field-measurement-${settings.preset}-${settings.unit}.png`
      );
      setExportState("success");
    } catch {
      setExportState("error");
    }
  }, [imageSrc, points, settings.preset, settings.unit]);

  return { exportField, exportState };
};
