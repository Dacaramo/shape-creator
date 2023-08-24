import {
  CANVAS_SHAPE_EDGE_COLOR,
  CANVAS_SHAPE_NODE_STROKE_COLOR,
  CANVAS_SHAPE_PREVIEW_NODE_FILL_COLOR,
  CANVAS_SHAPE_SELECTED_NODE_FILL_COLOR,
  CANVAS_SHAPE_UNSELECTED_NODE_FILL_COLOR,
} from '../constants/colors';
import {
  CANVAS_SHAPE_NODE_END_ANGLE,
  CANVAS_SHAPE_NODE_RADIUS,
  CANVAS_SHAPE_NODE_START_ANGLE,
  CANVAS_SHAPE_NODE_STROKE_WIDTH,
  CANVAS_SHAPE_EDGE_STROKE_WIDTH,
} from '../constants/sizes';
import { Point, Polygon } from '../model/Shape';

export const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  polygon: Polygon,
  previewPoint?: Point,
  selectedNodesIndexes: Array<number> = []
): void => {
  ctx.beginPath();
  ctx.moveTo(polygon[0].x, polygon[0].y);
  polygon.forEach(({ x, y }) => {
    ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.strokeStyle = CANVAS_SHAPE_EDGE_COLOR;
  ctx.lineWidth = CANVAS_SHAPE_EDGE_STROKE_WIDTH;
  ctx.stroke();

  polygon.forEach(({ x, y }, i) => {
    ctx.beginPath();
    ctx.arc(
      x,
      y,
      CANVAS_SHAPE_NODE_RADIUS,
      CANVAS_SHAPE_NODE_START_ANGLE,
      CANVAS_SHAPE_NODE_END_ANGLE
    );

    let color = CANVAS_SHAPE_UNSELECTED_NODE_FILL_COLOR;
    if (selectedNodesIndexes.includes(i)) {
      color = CANVAS_SHAPE_SELECTED_NODE_FILL_COLOR;
    }

    ctx.strokeStyle = CANVAS_SHAPE_NODE_STROKE_COLOR;
    ctx.lineWidth = CANVAS_SHAPE_NODE_STROKE_WIDTH;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  });

  if (previewPoint) {
    ctx.beginPath();
    ctx.arc(
      previewPoint.x,
      previewPoint.y,
      CANVAS_SHAPE_NODE_RADIUS,
      CANVAS_SHAPE_NODE_START_ANGLE,
      CANVAS_SHAPE_NODE_END_ANGLE
    );
    ctx.strokeStyle = CANVAS_SHAPE_NODE_STROKE_COLOR;
    ctx.lineWidth = CANVAS_SHAPE_NODE_STROKE_WIDTH;
    ctx.stroke();
    ctx.fillStyle = CANVAS_SHAPE_PREVIEW_NODE_FILL_COLOR;
    ctx.fill();
  }
};
