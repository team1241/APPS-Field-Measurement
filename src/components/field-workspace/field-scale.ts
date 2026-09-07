// The reference drawing marks 651.22 in between the matching diamond-plate
// boundaries, whose centers are 1,239 image units apart.
const CALIBRATION_DISTANCE_INCHES = 651.22;
const CALIBRATION_DISTANCE_IMAGE_UNITS = 1239;
const METERS_PER_INCH = 0.0254;

export const IMAGE_UNITS_PER_METER =
  CALIBRATION_DISTANCE_IMAGE_UNITS /
  (CALIBRATION_DISTANCE_INCHES * METERS_PER_INCH);

export const getDistanceInches = (distanceImageUnits: number): number =>
  (distanceImageUnits * CALIBRATION_DISTANCE_INCHES) /
  CALIBRATION_DISTANCE_IMAGE_UNITS;
