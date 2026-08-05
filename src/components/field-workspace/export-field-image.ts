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

export const exportFieldImage = async (imageSrc: string): Promise<Blob> => {
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

  return await canvasToBlob(canvas);
};
