"use client";

import {
  Add01Icon,
  ArrowDown01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import type { Preset } from "./workspace-types";

interface PresetMenuProps {
  activePresetId: string;
  onAddPreset: () => void;
  onPresetChange: (presetId: string) => void;
  onRenamePreset: (presetId: string, name: string) => void;
  presets: Preset[];
}

export const PresetMenu = ({
  activePresetId,
  onAddPreset,
  onPresetChange,
  onRenamePreset,
  presets,
}: PresetMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const activePreset = presets.find(({ id }) => id === activePresetId);

  const closeMenu = useCallback(() => {
    setEditingPresetId(null);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (
        event.target instanceof Node &&
        !menuRef.current?.contains(event.target)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  const startRenaming = (preset: Preset): void => {
    setDraftName(preset.name);
    setEditingPresetId(preset.id);
  };

  const selectPreset = (presetId: string): void => {
    onPresetChange(presetId);
  };

  const toggleMenu = (): void => {
    setIsOpen((current) => !current);
  };

  const handleDraftNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setDraftName(event.target.value);
  };

  const handlePresetClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const { presetId } = event.currentTarget.dataset;
    if (presetId) {
      selectPreset(presetId);
    }
  };

  const handlePresetDoubleClick = (
    event: MouseEvent<HTMLButtonElement>
  ): void => {
    const { presetId } = event.currentTarget.dataset;
    const preset = presets.find(({ id }) => id === presetId);
    if (preset) {
      startRenaming(preset);
    }
  };

  const saveName = (): void => {
    if (editingPresetId) {
      onRenamePreset(editingPresetId, draftName);
    }
    setEditingPresetId(null);
  };

  const handleNameKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      saveName();
      return;
    }

    if (event.key === "Escape") {
      event.stopPropagation();
      setEditingPresetId(null);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="h-10 min-w-36 justify-between rounded-xl border-slate-200 px-3 font-semibold text-slate-800 shadow-sm"
        onClick={toggleMenu}
        variant="outline"
      >
        <span className="max-w-32 truncate">
          {activePreset?.name ?? "Select preset"}
        </span>
        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
      </Button>

      {isOpen ? (
        <div
          aria-label="Presets"
          className="absolute top-full left-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
          role="menu"
        >
          <p className="px-2 py-1.5 font-semibold text-slate-500 text-xs">
            Double-click a name to rename it
          </p>
          <div className="max-h-64 overflow-y-auto">
            {presets.map((preset) =>
              editingPresetId === preset.id ? (
                <input
                  aria-label={`Rename ${preset.name}`}
                  autoFocus
                  className="h-9 w-full rounded-lg border border-blue-400 px-2 text-sm outline-none ring-3 ring-blue-500/15"
                  key={preset.id}
                  maxLength={50}
                  onBlur={saveName}
                  onChange={handleDraftNameChange}
                  onKeyDown={handleNameKeyDown}
                  value={draftName}
                />
              ) : (
                <button
                  aria-checked={preset.id === activePresetId}
                  className="flex h-9 w-full items-center justify-between rounded-lg px-2 text-left font-medium text-slate-700 text-sm hover:bg-slate-100"
                  data-preset-id={preset.id}
                  key={preset.id}
                  onClick={handlePresetClick}
                  onDoubleClick={handlePresetDoubleClick}
                  role="menuitemradio"
                  type="button"
                >
                  <span className="truncate">{preset.name}</span>
                  {preset.id === activePresetId ? (
                    <HugeiconsIcon
                      className="text-blue-600"
                      icon={Tick01Icon}
                      strokeWidth={2}
                    />
                  ) : null}
                </button>
              )
            )}
          </div>
          <div className="mt-1 border-slate-200 border-t pt-1">
            <button
              className="flex h-9 w-full items-center gap-2 rounded-lg px-2 font-semibold text-blue-700 text-sm hover:bg-blue-50"
              onClick={onAddPreset}
              role="menuitem"
              type="button"
            >
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Add preset
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
