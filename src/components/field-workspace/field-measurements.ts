import { getDistanceInches } from "./field-scale";
import type { FieldPoint, Unit } from "./workspace-types";

const CENTIMETERS_PER_INCH = 2.54;
const CENTIMETERS_PER_METER = 100;
const INCHES_PER_FOOT = 12;

export interface MeasuredSegment {
  end: FieldPoint;
  key: string;
  label: string;
  start: FieldPoint;
}

const formatMetricDistance = (distanceInches: number): string => {
  const totalCentimeters = Math.round(distanceInches * CENTIMETERS_PER_INCH);
  const meters = Math.floor(totalCentimeters / CENTIMETERS_PER_METER);
  const centimeters = totalCentimeters % CENTIMETERS_PER_METER;

  if (meters === 0) {
    return `${centimeters}cm`;
  }

  if (centimeters === 0) {
    return `${meters}m`;
  }

  return `${meters}m ${centimeters}cm`;
};

const formatImperialDistance = (distanceInches: number): string => {
  const totalInches = Math.round(distanceInches);
  const feet = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = totalInches - feet * INCHES_PER_FOOT;

  if (feet === 0) {
    return `${inches}in`;
  }

  if (inches === 0) {
    return `${feet}ft`;
  }

  return `${feet}ft ${inches}in`;
};

const formatDistance = (distanceInches: number, unit: Unit): string => {
  if (unit === "m") {
    return formatMetricDistance(distanceInches);
  }

  return formatImperialDistance(distanceInches);
};

const createMeasuredSegment = (
  start: FieldPoint,
  end: FieldPoint,
  unit: Unit
): MeasuredSegment => {
  const distanceImageUnits = Math.hypot(end.x - start.x, end.y - start.y);
  const distanceInches = getDistanceInches(distanceImageUnits);

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
