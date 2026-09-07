import Image from "next/image";
import type { KeyboardEvent, MouseEvent } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { getMeasuredSegments } from "./field-measurements";
import { IMAGE_UNITS_PER_METER } from "./field-scale";
import type { FieldPoint, Unit } from "./workspace-types";

interface FieldPlanProps {
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  onAddPoint: (point: FieldPoint) => void;
  onRemovePoint: (pointIndex: number) => void;
  points: FieldPoint[];
  showGrid: boolean;
  unit: Unit;
}

const MAX_POINTS = 2;
const POINT_RADIUS_IN_PIXELS = 10;
const LINE_STROKE_WIDTH = 5;
const FOCUS_RING_WIDTH_IN_PIXELS = 2;
const DEFAULT_IMAGE_UNITS_PER_PIXEL = 1;
const LABEL_FONT_SIZE_IN_PIXELS = 14;
const LABEL_HEIGHT_IN_PIXELS = 26;
const LABEL_HORIZONTAL_PADDING_IN_PIXELS = 10;
const LABEL_CHARACTER_WIDTH_IN_PIXELS = 8;
const GRID_STROKE_WIDTH_IN_PIXELS = 1.25;

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
  onAddPoint,
  onRemovePoint,
  points,
  showGrid,
  unit,
}: FieldPlanProps) => {
  const { imageUnitsPerPixel, svgRef } = useImageUnitsPerPixel();
  const pointRadius = POINT_RADIUS_IN_PIXELS * imageUnitsPerPixel;
  const focusRingWidth = FOCUS_RING_WIDTH_IN_PIXELS * imageUnitsPerPixel;

  const addPoint = (event: MouseEvent<SVGRectElement>): void => {
    if (points.length >= MAX_POINTS) {
      return;
    }

    const point = getImagePoint(event, imageWidth, imageHeight);
    if (!point) {
      return;
    }

    onAddPoint(point);
  };

  const removePoint = (event: MouseEvent<SVGCircleElement>): void => {
    const pointIndex = getPointIndex(event.currentTarget);
    onRemovePoint(pointIndex);
  };

  const removePointWithKeyboard = (
    event: KeyboardEvent<SVGCircleElement>
  ): void => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    const pointIndex = getPointIndex(event.currentTarget);
    onRemovePoint(pointIndex);
  };

  const svgPoints = points.map(({ x, y }) => `${x},${y}`).join(" ");
  const measuredSegments = getMeasuredSegments(points, unit);

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
          aria-label="Tap the field to add up to two measurement points. Select a point to remove it."
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          ref={svgRef}
          role="img"
          viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        >
          {/* SVG is intentional: it shares the contained image's coordinate system. */}
          <defs>
            <pattern
              height={IMAGE_UNITS_PER_METER}
              id="meter-grid"
              patternUnits="userSpaceOnUse"
              width={IMAGE_UNITS_PER_METER}
            >
              <path
                d={`M ${IMAGE_UNITS_PER_METER} 0 H 0 V ${IMAGE_UNITS_PER_METER}`}
                fill="none"
                stroke="rgba(255, 255, 255, 0.65)"
                strokeWidth={GRID_STROKE_WIDTH_IN_PIXELS * imageUnitsPerPixel}
              />
            </pattern>
          </defs>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Field placement is a spatial pointer interaction. */}
          <rect
            className="cursor-crosshair fill-transparent"
            height={imageHeight}
            onClick={addPoint}
            width={imageWidth}
          />
          {showGrid ? (
            <rect
              className="pointer-events-none"
              fill="url(#meter-grid)"
              height={imageHeight}
              width={imageWidth}
            />
          ) : null}
          <polyline
            className="pointer-events-none fill-none stroke-white"
            points={svgPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={LINE_STROKE_WIDTH}
            vectorEffect="non-scaling-stroke"
          />
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
          {measuredSegments.map(({ end, key, label, start }) => {
            const labelHeight = LABEL_HEIGHT_IN_PIXELS * imageUnitsPerPixel;
            const labelWidth =
              (label.length * LABEL_CHARACTER_WIDTH_IN_PIXELS +
                LABEL_HORIZONTAL_PADDING_IN_PIXELS * 2) *
              imageUnitsPerPixel;
            const midpointX = (start.x + end.x) / 2;
            const midpointY = (start.y + end.y) / 2;

            return (
              <g
                className="pointer-events-none"
                key={key}
                transform={`translate(${midpointX} ${midpointY})`}
              >
                <rect
                  fill="white"
                  height={labelHeight}
                  rx={labelHeight / 2}
                  width={labelWidth}
                  x={-labelWidth / 2}
                  y={-labelHeight / 2}
                />
                <text
                  dominantBaseline="central"
                  fill="#0f172a"
                  fontSize={LABEL_FONT_SIZE_IN_PIXELS * imageUnitsPerPixel}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
};
