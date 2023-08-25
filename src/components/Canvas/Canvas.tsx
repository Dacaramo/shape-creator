import {
  FC,
  useContext,
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from 'react';
import {
  INITIAL_CANVAS_WIDTH,
  INITIAL_CANVAS_HEIGHT,
  CANVAS_ICON_SIZE,
  CANVAS_SHAPE_EDGE_THRESHOLD,
  CANVAS_SHAPE_NODE_RADIUS,
  CANVAS_RESIZE_BUTTON_OFFSET,
} from '../../constants/sizes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize } from '@fortawesome/free-solid-svg-icons';
import { SLATE_500 } from '../../constants/tailwindColors';
import {
  findTransferredPointOnSegment,
  getDirection,
  getPointToSegmentDistance,
  isPointInsidePolygon,
} from '../../utils/linearAlgebra';
import { useBoundStore } from '../../zustand/store';
import { Point, Polygon } from '../../model/Shape';
import { drawPolygon } from '../../utils/canvas';
import CanvasContext from '../../contexts/CanvasContext/CanvasContext';

interface Props {}

const Canvas: FC<Props> = () => {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: INITIAL_CANVAS_WIDTH,
    height: INITIAL_CANVAS_HEIGHT,
  });
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [currentPolygon, setCurrentPolygon] = useState<Polygon>([]);
  const [currentNode, setCurrentNode] = useState<Point | null>(null);
  const [previewPoint, setPreviewPoint] = useState<Point | null>(null);

  const resizingBtnRef = useRef<HTMLButtonElement | null>(null);
  const isCreatingPolygon = useRef<boolean>(false);
  const nodeBeingMovedIndex = useRef<number>(-1);

  const { canvasRef } = useContext(CanvasContext)!;

  const [
    image,
    isNodeSelectionAllowed,
    isNodeMovementAllowed,
    isNodeCreationAllowed,
    isNodeDeletionAllowed,
    shapes,
    selectionInfo,
    setShapes,
    addShape,
    replaceShape,
    deleteShape,
    addNodeAfterGivenNode,
    setSelectionInfo,
    replaceImage,
  ] = useBoundStore((state) => {
    return [
      state.image,
      state.isNodeSelectionAllowed,
      state.isNodeMovementAllowed,
      state.isNodeCreationAllowed,
      state.isNodeDeletionAllowed,
      state.shapes,
      state.selectionInfo,
      state.setShapes,
      state.addShape,
      state.replaceShape,
      state.deleteShape,
      state.addNodeAfterGivenNode,
      state.setSelectionInfo,
      state.replaceImage,
    ];
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw Error("Couldn't get the context out of the canvas");
    }

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    if (image) {
      ctx.drawImage(image, 0, 0, image.width, image.height);
    }

    shapes.forEach((polygon, i) => {
      drawPolygon(
        ctx,
        polygon,
        previewPoint ? previewPoint : undefined,
        selectionInfo.polygonIndex === i
          ? selectionInfo.nodesIndexes
          : undefined
      );
    });

    if (currentPolygon.length > 0) {
      drawPolygon(ctx, [
        ...currentPolygon,
        ...(currentNode ? [currentNode] : []),
      ]);
    }
  }, [
    image,
    currentPolygon,
    currentNode,
    shapes,
    dimensions,
    previewPoint,
    selectionInfo,
  ]);

  useEffect(() => {
    if (!image) {
      return;
    }

    setDimensions({
      width: image.width,
      height: image.height,
    });
  }, [image]);

  const handleMouseDownForResizing = () => {
    setIsResizing(true);
  };

  const handleMouseUpForResizing = () => {
    setIsResizing(false);
  };

  const handleClickOnCanvas = (
    e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const clickedPoint = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    if (isNodeSelectionAllowed) {
      let mustTriggerFullDeselection = true;

      shapes.forEach((poly, i) => {
        if (
          isPointInsidePolygon(clickedPoint, poly, CANVAS_SHAPE_EDGE_THRESHOLD)
        ) {
          setSelectionInfo(
            i,
            poly.map((_, j) => j)
          );
          mustTriggerFullDeselection = false;
        } else {
          poly.forEach(({ x, y }, j) => {
            const dx = Math.abs(clickedPoint.x - x);
            const dy = Math.abs(clickedPoint.y - y);
            const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            if (distance < CANVAS_SHAPE_NODE_RADIUS) {
              if (e.ctrlKey) {
                setSelectionInfo(
                  i,
                  i === selectionInfo.polygonIndex
                    ? [...selectionInfo.nodesIndexes, j]
                    : [j]
                );
              } else {
                setSelectionInfo(i, [j]);
              }
              mustTriggerFullDeselection = false;
              return;
            }
          });
        }
      });

      if (mustTriggerFullDeselection) {
        setSelectionInfo(-1, []);
      }
    } else if (isNodeCreationAllowed) {
      /**
       * Need to know if the node to add is for the polygon that is currently
       * being created or if it's for a polygon that was previously created
       */
      let isForCurrentPolygon = true;
      /**
       * By default the node to add is for the current polygon, so the node
       * coordinates are the current mouse coordinates relative to the canvas
       */
      let newNode: Point = {
        x: clickedPoint.x,
        y: clickedPoint.y,
      };
      let afterNodeIndex = -1;
      let triggeredPolygonIndex = -1;

      /**
       * If there's no shapes then the node is for the polygon that is currently
       * being created
       */
      shapes.forEach((poly, i) => {
        /* Iterate over line segments */
        for (let j = 0; j < poly.length; j++) {
          const p1 = poly[j];
          const p2 = poly[(j + 1) % poly.length];

          const distance = getPointToSegmentDistance(
            clickedPoint.x,
            clickedPoint.y,
            p1.x,
            p1.y,
            p2.x,
            p2.y
          );

          const transferredPoint = findTransferredPointOnSegment(p1, p2, {
            x: clickedPoint.x,
            y: clickedPoint.y,
          });

          if (distance <= CANVAS_SHAPE_EDGE_THRESHOLD) {
            if (!isCreatingPolygon.current) {
              isForCurrentPolygon = false;
              newNode = transferredPoint;
              afterNodeIndex = j;
              triggeredPolygonIndex = i;
            }
          }
        }
      });

      if (isForCurrentPolygon) {
        setCurrentPolygon((prev) => {
          return [
            ...prev,
            {
              x: clickedPoint.x,
              y: clickedPoint.y,
            },
          ];
        });
        isCreatingPolygon.current = true;
      } else {
        addNodeAfterGivenNode(newNode, afterNodeIndex, triggeredPolygonIndex);
      }
    }
  };

  const handleMouseMoveOnCanvas = (
    e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const clickedPoint = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };

    if (isNodeCreationAllowed) {
      setCurrentNode({ x: clickedPoint.x, y: clickedPoint.y });

      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw Error("Couldn't get the context out of the canvas");
      }

      setPreviewPoint(null);

      shapes.forEach((poly) => {
        /* Iterate over line segments */
        for (let i = 0; i < poly.length; i++) {
          const p1 = poly[i];
          const p2 = poly[(i + 1) % poly.length];

          const distance = getPointToSegmentDistance(
            clickedPoint.x,
            clickedPoint.y,
            p1.x,
            p1.y,
            p2.x,
            p2.y
          );

          const transferredPoint = findTransferredPointOnSegment(p1, p2, {
            x: clickedPoint.x,
            y: clickedPoint.y,
          });

          if (distance <= CANVAS_SHAPE_EDGE_THRESHOLD) {
            if (!isCreatingPolygon.current) {
              setPreviewPoint(transferredPoint);
            }
            break;
          }
        }
      });
    } else if (isNodeMovementAllowed) {
      if (nodeBeingMovedIndex.current !== -1) {
        const averagePosition = { x: 0, y: 0 };
        for (const index of selectionInfo.nodesIndexes) {
          averagePosition.x += shapes[selectionInfo.polygonIndex][index].x;
          averagePosition.y += shapes[selectionInfo.polygonIndex][index].y;
        }
        averagePosition.x /= selectionInfo.nodesIndexes.length;
        averagePosition.y /= selectionInfo.nodesIndexes.length;

        const offsetX = clickedPoint.x - averagePosition.x;
        const offsetY = clickedPoint.y - averagePosition.y;

        const tempPolygon = [...shapes[selectionInfo.polygonIndex]];
        for (const index of selectionInfo.nodesIndexes) {
          tempPolygon[index].x += offsetX;
          tempPolygon[index].y += offsetY;
        }

        replaceShape(tempPolygon, selectionInfo.polygonIndex);
      }
    }
  };

  const handleMouseDownOnCanvas = (
    e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const clickedPoint = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    if (isNodeMovementAllowed) {
      shapes.forEach((poly, i) => {
        poly.forEach(({ x, y }, j) => {
          const dx = Math.abs(clickedPoint.x - x);
          const dy = Math.abs(clickedPoint.y - y);
          const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

          if (distance < CANVAS_SHAPE_NODE_RADIUS) {
            if (
              i === selectionInfo.polygonIndex &&
              selectionInfo.nodesIndexes.includes(j)
            ) {
              nodeBeingMovedIndex.current = j;
            }
            return;
          }
        });
      });
    }
  };

  const handleMouseUpOnCanvas = () => {
    if (isNodeMovementAllowed) {
      nodeBeingMovedIndex.current = -1;
    }
  };

  useEffect(() => {
    const handleMouseMoveForResizing = (e: MouseEvent) => {
      if (!isResizing || !resizingBtnRef.current) {
        return;
      }

      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const canvasOrigin: Point = {
        x: canvasRect.left,
        y: canvasRect.top,
      };

      const mousePosition = {
        x: e.clientX,
        y: e.clientY,
      };

      /**
       * Distance between the bottom right corner of the canvas and the
       * mouse position
       */
      const distanceX = mousePosition.x - (canvasOrigin.x + dimensions.width);
      const distanceY = mousePosition.y - (canvasOrigin.y + dimensions.height);

      /**
       *
       */
      const newWidth =
        dimensions.width + distanceX - CANVAS_RESIZE_BUTTON_OFFSET;
      const newHeight =
        dimensions.height + distanceY - CANVAS_RESIZE_BUTTON_OFFSET;

      const scaleFactorX = newWidth / dimensions.width;
      const scaleFactorY = newHeight / dimensions.height;

      setShapes(
        shapes.map((poly) => {
          return poly.map((node) => {
            return {
              x: node.x * scaleFactorX,
              y: node.y * scaleFactorY,
            };
          });
        })
      );

      if (image) {
        const img = new Image(newWidth, newHeight);
        img.id = image.id;
        img.src = image.src;

        replaceImage(img);
      }

      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const requiredNodesForPolygon = 3;
        if (
          !isNodeCreationAllowed ||
          currentPolygon.length < requiredNodesForPolygon
        ) {
          return;
        }
        addShape(currentPolygon);
        setCurrentPolygon([]);
        setCurrentNode(null);
        isCreatingPolygon.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMoveForResizing);
    window.addEventListener('mouseup', handleMouseUpForResizing);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveForResizing);
      window.removeEventListener('mouseup', handleMouseUpForResizing);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isResizing, isNodeCreationAllowed, currentPolygon, addShape]);

  return (
    <div className='relative'>
      <canvas
        ref={canvasRef}
        className='bg-slate-50 drop-shadow-lg'
        width={dimensions.width}
        height={dimensions.height}
        onClick={handleClickOnCanvas}
        onMouseMove={handleMouseMoveOnCanvas}
        onMouseDown={handleMouseDownOnCanvas}
        onMouseUp={handleMouseUpOnCanvas}
      />
      <button
        ref={resizingBtnRef}
        type='button'
        className={`absolute -right-[${CANVAS_RESIZE_BUTTON_OFFSET}px] -bottom-[${CANVAS_RESIZE_BUTTON_OFFSET}px] px-[5px] py-[2px] bg-slate-200 cursor-se-resize rounded-full`}
        onMouseDown={handleMouseDownForResizing}
      >
        <FontAwesomeIcon
          icon={faMaximize}
          size={CANVAS_ICON_SIZE}
          color={SLATE_500}
        />
      </button>
    </div>
  );
};

export default Canvas;
