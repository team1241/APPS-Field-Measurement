import type { FieldPoint, Unit } from "./workspace-types";

// The reference drawing marks 651.22 in between the matching diamond-plate
// boundaries, whose centers are 1,239 px apart in the field image.
const CALIBRATION_DISTANCE_INCHES = 651.22;
const CALIBRATION_DISTANCE_PIXELS = 1239;
const METERS_PER_INCH = 0.0254;

export interface MeasuredSegment {
  end: FieldPoint;
  key: string;
  label: string;
  start: FieldPoint;
}

const formatDistance = (distanceInches: number, unit: Unit): string => {
  if (unit === "m") {
    return `${(distanceInches * METERS_PER_INCH).toFixed(2)} m`;
  }

  return `${distanceInches.toFixed(2)} in`;
};

const createMeasuredSegment = (
  start: FieldPoint,
  end: FieldPoint,
  unit: Unit
): MeasuredSegment => {
  const distancePixels = Math.hypot(end.x - start.x, end.y - start.y);
  const distanceInches =
    (distancePixels * CALIBRATION_DISTANCE_INCHES) /
    CALIBRATION_DISTANCE_PIXELS;

  return {
    end,
    key: `${start.x}-${start.y}-${end.x}-${end.y}`,
    label: formatDistance(distanceInches, unit),
    start,
  };
};

export const getMeasuredSegments = (
  points: FieldPoint[],
  unit: Unit
): MeasuredSegment[] => {
  if (points.length < 2) {
    return [];
  }

  const segments: MeasuredSegment[] = [];
  for (let pointIndex = 1; pointIndex < points.length; pointIndex += 1) {
    const start = points[pointIndex - 1];
    const end = points[pointIndex];
    if (start && end) {
      segments.push(createMeasuredSegment(start, end, unit));
    }
  }

  const [firstPoint] = points;
  const lastPoint = points.at(-1);
  if (points.length >= 3 && firstPoint && lastPoint) {
    segments.push(createMeasuredSegment(lastPoint, firstPoint, unit));
  }

  return segments;
};
