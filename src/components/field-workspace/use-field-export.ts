"use client";

import { useCallback, useState } from "react";
import { downloadBlob } from "./download-blob";
import { exportFieldImage } from "./export-field-image";
import type {
  ExportState,
  FieldPoint,
  WorkspaceSettings,
} from "./workspace-types";

const NON_FILENAME_CHARACTERS = /[^a-z0-9]+/g;

export const useFieldExport = (
  imageSrc: string,
  settings: WorkspaceSettings,
  points: FieldPoint[]
) => {
  const [exportState, setExportState] = useState<ExportState>("idle");
  const presetName =
    settings.presets.find(({ id }) => id === settings.preset)?.name ?? "preset";

  const exportField = useCallback(async () => {
    setExportState("exporting");

    try {
      const exportBlob = await exportFieldImage(
        imageSrc,
        points,
        settings.unit,
        settings.showGrid
      );
      downloadBlob(
        exportBlob,
        `field-measurement-${presetName
          .toLowerCase()
          .replace(NON_FILENAME_CHARACTERS, "-")}-${settings.unit}.png`
      );
      setExportState("success");
    } catch {
      setExportState("error");
    }
  }, [imageSrc, points, presetName, settings.showGrid, settings.unit]);

  return { exportField, exportState };
};
