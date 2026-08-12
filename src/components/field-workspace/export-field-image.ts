import type { FieldPoint } from "./workspace-types";

const EXPORTED_LINE_WIDTH = 8;
const EXPORTED_POINT_RADIUS = 12;

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
  points: FieldPoint[]
): void => {
  context.fillStyle = "white";
  context.strokeStyle = "white";
  context.lineCap = "round";
  context.lineWidth = EXPORTED_LINE_WIDTH;

  if (points.length === 2) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.stroke();
  }

  for (const point of points) {
    context.beginPath();
    context.arc(point.x, point.y, EXPORTED_POINT_RADIUS, 0, 2 * Math.PI);
    context.fill();
  }
};

export const exportFieldImage = async (
  imageSrc: string,
  points: FieldPoint[]
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
  drawPoints(context, points);
  imageBitmap.close();

  return await canvasToBlob(canvas);
};
