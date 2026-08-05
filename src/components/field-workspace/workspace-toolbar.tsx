"use client";

import {
  Cancel01Icon,
  Download04Icon,
  GridIcon,
  Menu01Icon,
  RedoIcon,
  UndoIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeaderBrand } from "./header-brand";
import { useHeaderMenu } from "./use-header-menu";
import { useHeaderVisibility } from "./use-header-visibility";
import { useToolbarHandlers } from "./use-toolbar-handlers";
import type {
  ExportState,
  Preset,
  Unit,
  WorkspaceSettings,
} from "./workspace-types";

interface WorkspaceToolbarProps {
  canRedo: boolean;
  canUndo: boolean;
  exportState: ExportState;
  onExport: () => void;
  onPresetChange: (preset: Preset) => void;
  onRedo: () => void;
  onUndo: () => void;
  onUnitChange: (unit: Unit) => void;
  settings: WorkspaceSettings;
}

const EXPORT_LABELS: Record<ExportState, string> = {
  error: "Export",
  exporting: "Exporting",
  idle: "Export",
  success: "Export",
};

export const WorkspaceToolbar = ({
  canRedo,
  canUndo,
  exportState,
  onExport,
  onPresetChange,
  onRedo,
  onUndo,
  onUnitChange,
  settings,
}: WorkspaceToolbarProps) => {
  const exportLabel = EXPORT_LABELS[exportState];
  const { isMenuOpen, menuRef, toggleMenu, triggerRef } = useHeaderMenu();
  const isHeaderVisible = useHeaderVisibility(isMenuOpen);
  const { handlePresetChange, handleUnitChange } = useToolbarHandlers(
    onPresetChange,
    onUnitChange
  );

  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-20 border-slate-200 border-b bg-white/95 px-3 py-2 shadow-[0_1px_12px_rgba(15,23,42,0.06)] backdrop-blur transition-[opacity,transform] duration-300 ease-out sm:px-5 sm:py-3",
        isHeaderVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      )}
    >
      <div className="relative mx-auto flex max-w-[1800px] items-center gap-3 min-[900px]:grid min-[900px]:grid-cols-[auto_auto_1fr_auto] min-[900px]:gap-4">
        <Button
          aria-controls="workspace-header-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="shrink-0 rounded-lg text-slate-700 min-[900px]:hidden"
          onClick={toggleMenu}
          ref={triggerRef}
          size="icon"
          variant="ghost"
        >
          <HugeiconsIcon
            icon={isMenuOpen ? Cancel01Icon : Menu01Icon}
            strokeWidth={2}
          />
        </Button>

        <HeaderBrand />

        <div
          className={cn(
            "absolute top-full right-0 left-0 mt-3 max-h-[calc(100dvh-5rem)] flex-col gap-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl min-[900px]:contents",
            isMenuOpen ? "flex" : "hidden min-[900px]:contents"
          )}
          id="workspace-header-menu"
          ref={menuRef}
        >
          <fieldset
            aria-label="Edit history"
            className="flex w-fit items-center gap-1 rounded-xl bg-slate-100 p-1"
          >
            <Button
              aria-label="Undo"
              className="rounded-lg text-slate-700 hover:bg-white hover:shadow-sm"
              disabled={!canUndo}
              onClick={onUndo}
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
              onClick={onRedo}
              size="icon-sm"
              title="Redo"
              variant="ghost"
            >
              <HugeiconsIcon icon={RedoIcon} strokeWidth={2} />
            </Button>
          </fieldset>

          <div className="flex flex-wrap items-center gap-2 min-[900px]:justify-self-center">
            <label className="sr-only" htmlFor="view-preset">
              View preset
            </label>
            <select
              className="h-10 min-w-32 rounded-xl border border-slate-200 bg-white px-3 font-semibold text-slate-800 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15"
              id="view-preset"
              onChange={handlePresetChange}
              value={settings.preset}
            >
              <option value="preset-1">Preset 1</option>
              <option value="preset-2">Preset 2</option>
              <option value="preset-3">Preset 3</option>
            </select>
            <Button
              className="h-10 rounded-xl border-slate-200 px-3 font-semibold shadow-sm"
              disabled
              title="Grid controls coming soon"
              variant="outline"
            >
              <HugeiconsIcon icon={GridIcon} strokeWidth={2} />
              <span>Grid</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 min-[900px]:justify-self-end">
            <fieldset
              aria-label="Measurement unit"
              className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-sm"
            >
              {(["in", "m"] as const).map((unit) => (
                <button
                  aria-pressed={settings.unit === unit}
                  className="h-8 min-w-9 rounded-lg px-2 font-bold text-xs uppercase transition aria-pressed:bg-white aria-pressed:text-blue-700 aria-pressed:shadow-sm"
                  data-unit={unit}
                  key={unit}
                  onClick={handleUnitChange}
                  type="button"
                >
                  {unit}
                </button>
              ))}
            </fieldset>
            <Button
              className="h-10 rounded-xl bg-blue-600 px-3 font-bold shadow-blue-600/20 shadow-sm hover:bg-blue-700 sm:px-4"
              disabled={exportState === "exporting"}
              onClick={onExport}
            >
              <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
              <span className="hidden min-[420px]:inline">{exportLabel}</span>
              <span className="sr-only min-[420px]:hidden">{exportLabel}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
