import { getMeasuredSegments } from "./field-measurements";
import { IMAGE_UNITS_PER_METER } from "./field-scale";
import type { FieldPoint, Unit } from "./workspace-types";

const EXPORTED_LINE_WIDTH = 8;
const EXPORTED_POINT_RADIUS = 12;
const EXPORTED_LABEL_HEIGHT = 32;
const EXPORTED_LABEL_PADDING = 12;
const EXPORTED_GRID_LINE_WIDTH = 2;

const drawGrid = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number
): void => {
  context.save();
  context.beginPath();

  for (let x = IMAGE_UNITS_PER_METER; x < width; x += IMAGE_UNITS_PER_METER) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }

  for (let y = IMAGE_UNITS_PER_METER; y < height; y += IMAGE_UNITS_PER_METER) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }

  context.lineWidth = EXPORTED_GRID_LINE_WIDTH;
  context.strokeStyle = "rgba(255, 255, 255, 0.65)";
  context.stroke();
  context.restore();
};

const canvasToBlob = async (canvas: HTMLCanvasElement): Promise<Blob> =>
  await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("The exported image could not be created."));
    }, "image/png");
  });

const drawPoints = (
  context: CanvasRenderingContext2D,
  points: FieldPoint[],
  unit: Unit
): void => {
  context.fillStyle = "white";
  context.strokeStyle = "white";
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = EXPORTED_LINE_WIDTH;

  const [firstPoint] = points;
  if (firstPoint && points.length >= 2) {
    context.beginPath();
    context.moveTo(firstPoint.x, firstPoint.y);
    for (const point of points.slice(1)) {
      context.lineTo(point.x, point.y);
    }
    if (points.length >= 3) {
      context.closePath();
      context.fillStyle = "rgba(37, 99, 235, 0.25)";
      context.fill();
    }
    context.stroke();
  }

  for (const point of points) {
    context.beginPath();
    context.arc(point.x, point.y, EXPORTED_POINT_RADIUS, 0, 2 * Math.PI);
    context.fill();
  }

  context.font = "700 18px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const { end, label, start } of getMeasuredSegments(points, unit)) {
    const midpointX = (start.x + end.x) / 2;
    const midpointY = (start.y + end.y) / 2;
    const labelWidth =
      context.measureText(label).width + EXPORTED_LABEL_PADDING * 2;

    context.beginPath();
    context.roundRect(
      midpointX - labelWidth / 2,
      midpointY - EXPORTED_LABEL_HEIGHT / 2,
      labelWidth,
      EXPORTED_LABEL_HEIGHT,
      EXPORTED_LABEL_HEIGHT / 2
    );
    context.fillStyle = "white";
    context.fill();
    context.fillStyle = "#0f172a";
    context.fillText(label, midpointX, midpointY);
  }
};

export const exportFieldImage = async (
  imageSrc: string,
  points: FieldPoint[],
  unit: Unit,
  showGrid: boolean
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
  if (showGrid) {
    drawGrid(context, canvas.width, canvas.height);
  }
  drawPoints(context, points, unit);
  imageBitmap.close();

  return await canvasToBlob(canvas);
};
