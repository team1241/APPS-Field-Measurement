"use client";

import { useCallback, useState } from "react";
import { downloadBlob } from "./download-blob";
import { exportFieldImage } from "./export-field-image";
import type { ExportState, WorkspaceSettings } from "./workspace-types";

export const useFieldExport = (
  imageSrc: string,
  settings: WorkspaceSettings
) => {
  const [exportState, setExportState] = useState<ExportState>("idle");

  const exportField = useCallback(async () => {
    setExportState("exporting");

    try {
      const exportBlob = await exportFieldImage(imageSrc);
      downloadBlob(
        exportBlob,
        `field-measurement-${settings.preset}-${settings.unit}.png`
      );
      setExportState("success");
    } catch {
      setExportState("error");
    }
  }, [imageSrc, settings.preset, settings.unit]);

  return { exportField, exportState };
};
