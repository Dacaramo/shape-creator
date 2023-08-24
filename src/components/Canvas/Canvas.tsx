import {
  FC,
  useState,
  useRef,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from 'react';
import {
  INITIAL_CANVAS_WIDTH,
  INITIAL_CANVAS_HEIGHT,
  CANVAS_ICON_SIZE,
} from '../../constants/sizes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize } from '@fortawesome/free-solid-svg-icons';
import { SLATE_500 } from '../../constants/tailwindColors';
import {
  findTransferredPointOnSegment,
  getDirection,
  getPointToSegmentDistance,
} from '../../utils/linearAlgebra';
import { useBoundStore } from '../../zustand/store';
import { Point, Polygon } from '../../model/Shape';
import { drawPolygon } from '../../utils/canvas';

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resizingBtnRef = useRef<HTMLButtonElement | null>(null);
  const isCreatingPolygon = useRef<boolean>(false);

  const [
    isNodeSelectionAllowed,
    isNodeMovementAllowed,
    isNodeCreationAllowed,
    isNodeDeletionAllowed,
    shapes,
    addShape,
    replaceShape,
    deleteShape,
    addNodeAfterGivenNode,
  ] = useBoundStore((state) => {
    return [
      state.isNodeSelectionAllowed,
      state.isNodeMovementAllowed,
      state.isNodeCreationAllowed,
      state.isNodeDeletionAllowed,
      state.shapes,
      state.addShape,
      state.replaceShape,
      state.deleteShape,
      state.addNodeAfterGivenNode,
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

    shapes.forEach((polygon) => {
      drawPolygon(
        ctx,
        polygon,
        previewPoint ? previewPoint : undefined,
        undefined
      );
    });

    if (currentPolygon.length > 0) {
      drawPolygon(ctx, [
        ...currentPolygon,
        ...(currentNode ? [currentNode] : []),
      ]);
    }
  }, [currentPolygon, currentNode, shapes, dimensions, previewPoint]);

  const handleMouseDownForResizing = () => {
    setIsResizing(true);
  };

  const handleMouseUpForResizing = () => {
    setIsResizing(false);
  };

  const handleMouseDown = () => {
    /**
     * TODO
     */
  };

  const handleMouseMove = () => {
    /**
     * TODO
     */
  };

  const handleMouseUp = () => {
    /**
     * TODO
     */
  };

  const handleClickOnCanvas = (
    e: ReactMouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (isNodeCreationAllowed) {
      const thresholdToAddNode = 5;
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
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
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
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
            p1.x,
            p1.y,
            p2.x,
            p2.y
          );

          const transferredPoint = findTransferredPointOnSegment(p1, p2, {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          });

          if (distance <= thresholdToAddNode) {
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
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
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
    if (isNodeCreationAllowed) {
      setCurrentNode({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });

      const thresholdToDrawPreviewPoint = 5;
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
            e.nativeEvent.offsetX,
            e.nativeEvent.offsetY,
            p1.x,
            p1.y,
            p2.x,
            p2.y
          );

          const transferredPoint = findTransferredPointOnSegment(p1, p2, {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
          });

          if (distance <= thresholdToDrawPreviewPoint) {
            if (!isCreatingPolygon.current) {
              setPreviewPoint(transferredPoint);
            }
            break;
          }
        }
      });
    }
  };

  useEffect(() => {
    const handleMouseMoveForResizing = (e: MouseEvent) => {
      if (!isResizing || !resizingBtnRef.current) {
        return;
      }

      const rect = resizingBtnRef.current.getBoundingClientRect();
      const btnCenter = {
        /* eslint-disable */
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        /* eslint-enable */
      };
      const finalMousePosition = {
        x: e.clientX,
        y: e.clientY,
      };
      const dx = finalMousePosition.x - btnCenter.x;
      const dy = finalMousePosition.y - btnCenter.y;
      /* eslint-disable */
      const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      /* eslint-enable */
      const direction = getDirection(dx, dy);

      if (!direction) {
        return;
      }

      if (direction === 'left' || direction === 'top') {
        setDimensions((prev) => {
          return {
            width: prev.width - distance,
            height: prev.height - (distance * prev.height) / prev.width,
          };
        });
      } else if (direction === 'right' || direction === 'bottom') {
        setDimensions((prev) => {
          return {
            width: prev.width + distance,
            height: prev.height + (distance * prev.height) / prev.width,
          };
        });
      }
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
      />
      <button
        ref={resizingBtnRef}
        type='button'
        className='absolute -right-[30px] -bottom-[30px] px-[5px] py-[2px] bg-slate-200 cursor-se-resize rounded-full'
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
