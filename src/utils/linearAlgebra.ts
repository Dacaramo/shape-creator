import { Point, Polygon } from '../model/Shape';

export type Direction = 'right' | 'bottom' | 'top' | 'left';

export const getDirection = (dx: number, dy: number): undefined | Direction => {
  if (dx === 0 && dy === 0) {
    return;
  }

  /* eslint-disable */
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle >= -45 && angle < 45) {
    return 'right';
  } else if (angle >= 45 && angle < 135) {
    return 'bottom';
  } else if (angle >= -135 && angle < -45) {
    return 'top';
  } else {
    return 'left';
  }
};

export const getPointToSegmentDistance = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0)
    // in case of 0 length line
    param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

export const findTransferredPointOnSegment = (
  segmentPoint1: Point,
  segmentPoint2: Point,
  pointToTransfer: Point
): Point => {
  const dx = segmentPoint2.x - segmentPoint1.x;
  const dy = segmentPoint2.y - segmentPoint1.y;
  const t =
    ((pointToTransfer.x - segmentPoint1.x) * dx +
      (pointToTransfer.y - segmentPoint1.y) * dy) /
    (dx * dx + dy * dy);
  const transferredPoint = {
    x: segmentPoint1.x + dx * t,
    y: segmentPoint1.y + dy * t,
  };
  return transferredPoint;
};

export const isPointInsidePolygon = (
  point: Point,
  polygon: Polygon,
  innerThreshold: number = 0
): boolean => {
  const { x, y } = point;
  let isInside = false;

  // Iterate through each edge of the polygon
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const { x: xi, y: yi } = polygon[i];
    const { x: xj, y: yj } = polygon[j];

    // Calculate the distance between the point and the edge
    const edgeLength = Math.sqrt((xj - xi) ** 2 + (yj - yi) ** 2);
    const distanceToEdge =
      Math.abs((yj - yi) * x - (xj - xi) * y + xj * yi - yj * xi) / edgeLength;

    if (distanceToEdge < innerThreshold) {
      return false; // Point is too close to an edge, return false
    }

    // Check if the coordinate is on the same side of the edge
    const intersectCondition =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersectCondition) {
      isInside = !isInside;
    }
  }

  return isInside;
};
