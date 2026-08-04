"use client";

import {
  Download04Icon,
  GridIcon,
  RedoIcon,
  UndoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useState,
} from "react";

import { Button } from "@/components/ui/button";

type Preset = "preset-1" | "preset-2" | "preset-3";
type Unit = "in" | "mm";

interface WorkspaceSettings {
  gridVisible: boolean;
  preset: Preset;
  unit: Unit;
}

interface WorkspaceHistory {
  entries: WorkspaceSettings[];
  index: number;
}

type ExportState = "error" | "exporting" | "idle" | "success";

const INITIAL_SETTINGS: WorkspaceSettings = {
  gridVisible: false,
  preset: "preset-1",
  unit: "in",
};

const PRESET_SCALE: Record<Preset, string> = {
  "preset-1": "scale-100",
  "preset-2": "scale-[1.15]",
  "preset-3": "scale-[1.3]",
};

const settingsAreEqual = (
  first: WorkspaceSettings,
  second: WorkspaceSettings
): boolean =>
  first.gridVisible === second.gridVisible &&
  first.preset === second.preset &&
  first.unit === second.unit;

const createExport = async (
  imageSrc: string,
  gridVisible: boolean
): Promise<Blob> => {
  const response = await fetch(imageSrc);
  if (!response.ok) {
    throw new Error("The field image could not be loaded for export.");
  }

  const imageBitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;

  const context = canvas.getContext("2d");
  if (!context) {
    imageBitmap.close();
    throw new Error("Your browser could not prepare the export.");
  }

  context.drawImage(imageBitmap, 0, 0);
  imageBitmap.close();

  if (gridVisible) {
    const gridSize = 48;
    context.strokeStyle = "rgba(17, 24, 39, 0.18)";
    context.lineWidth = 1;

    for (let x = gridSize; x < canvas.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }

    for (let y = gridSize; y < canvas.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
  }

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error("The exported image could not be created."));
    }, "image/png");
  });
};

export function FieldWorkspace({ imageSrc }: { imageSrc: string }) {
  const [history, setHistory] = useState<WorkspaceHistory>({
    entries: [INITIAL_SETTINGS],
    index: 0,
  });
  const [exportState, setExportState] = useState<ExportState>("idle");
  const settings = history.entries[history.index] ?? INITIAL_SETTINGS;
  const canUndo = history.index > 0;
  const canRedo = history.index < history.entries.length - 1;

  const updateSettings = useCallback(
    (update: (current: WorkspaceSettings) => WorkspaceSettings) => {
      setHistory((currentHistory) => {
        const currentSettings =
          currentHistory.entries[currentHistory.index] ?? INITIAL_SETTINGS;
        const nextSettings = update(currentSettings);

        if (settingsAreEqual(currentSettings, nextSettings)) {
          return currentHistory;
        }

        return {
          entries: [
            ...currentHistory.entries.slice(0, currentHistory.index + 1),
            nextSettings,
          ],
          index: currentHistory.index + 1,
        };
      });
    },
    []
  );

  const undo = useCallback(() => {
    setHistory((currentHistory) => ({
      ...currentHistory,
      index: Math.max(0, currentHistory.index - 1),
    }));
  }, []);

  const redo = useCallback(() => {
    setHistory((currentHistory) => ({
      ...currentHistory,
      index: Math.min(
        currentHistory.entries.length - 1,
        currentHistory.index + 1
      ),
    }));
  }, []);

  const changePreset = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const preset = event.target.value as Preset;
      updateSettings((current) => ({ ...current, preset }));
    },
    [updateSettings]
  );

  const toggleGrid = useCallback(() => {
    updateSettings((current) => ({
      ...current,
      gridVisible: !current.gridVisible,
    }));
  }, [updateSettings]);

  const changeUnit = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const unit = event.currentTarget.dataset.unit as Unit;
      updateSettings((current) => ({ ...current, unit }));
    },
    [updateSettings]
  );

  const exportField = useCallback(async () => {
    setExportState("exporting");

    try {
      const exportBlob = await createExport(imageSrc, settings.gridVisible);
      const downloadUrl = URL.createObjectURL(exportBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = `field-measurement-${settings.preset}-${settings.unit}.png`;
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
      setExportState("success");
    } catch {
      setExportState("error");
    }
  }, [imageSrc, settings.gridVisible, settings.preset, settings.unit]);

  let exportLabel = "Export";
  if (exportState === "exporting") {
    exportLabel = "Exporting";
  }

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-slate-100">
      <header className="z-20 shrink-0 border-slate-200 border-b bg-white/95 px-3 py-2 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5 sm:py-3">
        <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:gap-4">
          <fieldset
            aria-label="Edit history"
            className="flex items-center gap-1 rounded-xl bg-slate-100 p-1"
          >
            <Button
              aria-label="Undo"
              className="rounded-lg text-slate-700 hover:bg-white hover:shadow-sm"
              disabled={!canUndo}
              onClick={undo}
              size="icon-sm"
              title="Undo"
              variant="ghost"
            >
              <HugeiconsIcon icon={UndoIcon} strokeWidth={2} />
            </Button>
            <Button
              aria-label="Redo"
              className="rounded-lg text-slate-700 hover:bg-white hover:shadow-sm"
              disabled={!canRedo}
              onClick={redo}
              size="icon-sm"
              title="Redo"
              variant="ghost"
            >
              <HugeiconsIcon icon={RedoIcon} strokeWidth={2} />
            </Button>
          </fieldset>

          <div className="order-3 flex w-full items-center justify-center gap-2 sm:order-none sm:w-auto">
            <label className="sr-only" htmlFor="view-preset">
              View preset
            </label>
            <select
              className="h-10 min-w-32 rounded-xl border border-slate-200 bg-white px-3 font-semibold text-slate-800 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
              id="view-preset"
              onChange={changePreset}
              value={settings.preset}
            >
              <option value="preset-1">Preset 1</option>
              <option value="preset-2">Preset 2</option>
              <option value="preset-3">Preset 3</option>
            </select>
            <Button
              aria-pressed={settings.gridVisible}
              className="h-10 rounded-xl border-slate-200 px-3 font-semibold shadow-sm data-[pressed]:border-blue-200 data-[pressed]:bg-blue-50 data-[pressed]:text-blue-700"
              data-pressed={settings.gridVisible ? "" : undefined}
              onClick={toggleGrid}
              variant="outline"
            >
              <HugeiconsIcon icon={GridIcon} strokeWidth={2} />
              <span>Grid</span>
              <span className="text-xs opacity-60">
                {settings.gridVisible ? "On" : "Off"}
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <fieldset
              aria-label="Measurement unit"
              className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-sm"
            >
              {(["in", "mm"] as const).map((unit) => (
                <button
                  aria-pressed={settings.unit === unit}
                  className="h-8 min-w-9 rounded-lg px-2 font-bold text-xs uppercase transition aria-pressed:bg-white aria-pressed:text-blue-700 aria-pressed:shadow-sm"
                  data-unit={unit}
                  key={unit}
                  onClick={changeUnit}
                  type="button"
                >
                  {unit}
                </button>
              ))}
            </fieldset>
            <Button
              className="h-10 rounded-xl bg-blue-600 px-3 font-bold shadow-blue-600/20 shadow-sm hover:bg-blue-700 sm:px-4"
              disabled={exportState === "exporting"}
              onClick={exportField}
            >
              <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
              <span className="hidden min-[420px]:inline">{exportLabel}</span>
              <span className="sr-only min-[420px]:hidden">{exportLabel}</span>
            </Button>
          </div>
        </div>
      </header>

      <section
        aria-label="Field plan workspace"
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <div
          className={`relative h-full w-full transition-transform duration-300 ease-out ${PRESET_SCALE[settings.preset]}`}
        >
          <Image
            alt="2026 field layout"
            className="object-contain p-3 sm:p-6 lg:p-8"
            fill
            priority
            sizes="100vw"
            src={imageSrc}
          />
        </div>

        {settings.gridVisible ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.12)_1px,transparent_1px)] bg-[size:48px_48px]"
          />
        ) : null}

        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-slate-200 bg-white/90 px-2.5 py-1.5 font-semibold text-slate-600 text-xs shadow-sm backdrop-blur">
          Units: {settings.unit === "in" ? "Inches" : "Millimetres"}
        </div>
      </section>

      <p aria-live="polite" className="sr-only">
        {exportState === "success" ? "Field image exported." : null}
        {exportState === "error"
          ? "The field image could not be exported. Please try again."
          : null}
      </p>
    </main>
  );
}
