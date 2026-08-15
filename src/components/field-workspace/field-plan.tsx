import Image from "next/image";
import type {
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
} from "react";
import { useLayoutEffect, useRef, useState } from "react";
import type { FieldPoint } from "./workspace-types";

interface FieldPlanProps {
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  onPointsChange: Dispatch<SetStateAction<FieldPoint[]>>;
  points: FieldPoint[];
}

const MAX_POINTS = 2;
const POINT_RADIUS_IN_PIXELS = 10;
const LINE_STROKE_WIDTH = 5;
const FOCUS_RING_WIDTH_IN_PIXELS = 2;
const DEFAULT_IMAGE_UNITS_PER_PIXEL = 1;

const useImageUnitsPerPixel = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [imageUnitsPerPixel, setImageUnitsPerPixel] = useState(
    DEFAULT_IMAGE_UNITS_PER_PIXEL
  );

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const updateScale = (): void => {
      const transformationMatrix = svg.getScreenCTM();
      if (!transformationMatrix) {
        return;
      }

      const pixelsPerImageUnit = Math.hypot(
        transformationMatrix.a,
        transformationMatrix.b
      );
      if (pixelsPerImageUnit <= 0) {
        return;
      }

      setImageUnitsPerPixel(1 / pixelsPerImageUnit);
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(svg);
    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return { imageUnitsPerPixel, svgRef };
};

const getPointIndex = (element: SVGCircleElement): number =>
  Number(element.dataset.pointIndex);

const getImagePoint = (
  event: MouseEvent<SVGRectElement>,
  imageWidth: number,
  imageHeight: number
): FieldPoint | null => {
  const transformationMatrix =
    event.currentTarget.ownerSVGElement?.getScreenCTM();
  if (!transformationMatrix) {
    return null;
  }

  const imagePoint = new DOMPoint(event.clientX, event.clientY).matrixTransform(
    transformationMatrix.inverse()
  );

  const isInsideImage =
    imagePoint.x >= 0 &&
    imagePoint.x <= imageWidth &&
    imagePoint.y >= 0 &&
    imagePoint.y <= imageHeight;

  return isInsideImage ? { x: imagePoint.x, y: imagePoint.y } : null;
};

export const FieldPlan = ({
  imageHeight,
  imageSrc,
  imageWidth,
  onPointsChange,
  points,
}: FieldPlanProps) => {
  const { imageUnitsPerPixel, svgRef } = useImageUnitsPerPixel();
  const pointRadius = POINT_RADIUS_IN_PIXELS * imageUnitsPerPixel;
  const focusRingWidth = FOCUS_RING_WIDTH_IN_PIXELS * imageUnitsPerPixel;

  const addPoint = (event: MouseEvent<SVGRectElement>): void => {
    const point = getImagePoint(event, imageWidth, imageHeight);
    if (!point) {
      return;
    }

    onPointsChange((currentPoints) =>
      currentPoints.length < MAX_POINTS
        ? [...currentPoints, point]
        : currentPoints
    );
  };

  const removePoint = (event: MouseEvent<SVGCircleElement>): void => {
    const pointIndex = getPointIndex(event.currentTarget);
    onPointsChange((currentPoints) =>
      currentPoints.filter((_, index) => index !== pointIndex)
    );
  };

  const removePointWithKeyboard = (
    event: KeyboardEvent<SVGCircleElement>
  ): void => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    const pointIndex = getPointIndex(event.currentTarget);
    onPointsChange((currentPoints) =>
      currentPoints.filter((_, index) => index !== pointIndex)
    );
  };

  return (
    <section
      aria-label="Field plan workspace"
      className="relative min-h-0 flex-1 overflow-hidden p-3 sm:p-6 lg:p-8"
    >
      <div className="relative h-full w-full">
        <Image
          alt="2026 field layout"
          className="object-contain"
          fill
          priority
          sizes="100vw"
          src={imageSrc}
        />
        <svg
          aria-label="Tap the field to place up to two measurement points. Select a point to remove it."
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          ref={svgRef}
          role="img"
          viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        >
          {/* SVG is intentional: it shares the contained image's coordinate system. */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Field placement is a spatial pointer interaction. */}
          <rect
            className="cursor-crosshair fill-transparent"
            height={imageHeight}
            onClick={addPoint}
            width={imageWidth}
          />
          {points.length === MAX_POINTS ? (
            <line
              className="pointer-events-none stroke-white"
              strokeLinecap="round"
              strokeWidth={LINE_STROKE_WIDTH}
              vectorEffect="non-scaling-stroke"
              x1={points[0].x}
              x2={points[1].x}
              y1={points[0].y}
              y2={points[1].y}
            />
          ) : null}
          {points.map((point, pointIndex) => (
            // biome-ignore lint/a11y/useSemanticElements: HTML buttons cannot share an SVG image coordinate system.
            <circle
              aria-label={`Remove point ${pointIndex + 1}`}
              className="cursor-pointer fill-white focus-visible:stroke-sky-400 focus-visible:outline-none"
              cx={point.x}
              cy={point.y}
              data-point-index={pointIndex}
              key={`${point.x}-${point.y}`}
              onClick={removePoint}
              onKeyDown={removePointWithKeyboard}
              r={pointRadius}
              role="button"
              strokeWidth={focusRingWidth}
              tabIndex={0}
            />
          ))}
        </svg>
      </div>
    </section>
  );
};
