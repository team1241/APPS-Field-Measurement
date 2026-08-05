import type { ExportState } from "./workspace-types";

export const ExportStatus = ({ state }: { state: ExportState }) => (
  <p aria-live="polite" className="sr-only">
    {state === "success" ? "Field image exported." : null}
    {state === "error"
      ? "The field image could not be exported. Please try again."
      : null}
  </p>
);
