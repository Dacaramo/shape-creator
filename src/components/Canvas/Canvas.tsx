import { FC, useState, useRef, useEffect } from 'react';
import {
  INITIAL_CANVAS_WIDTH,
  INITIAL_CANVAS_HEIGHT,
  CANVAS_ICON_SIZE,
} from '../../constants/sizes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize } from '@fortawesome/free-solid-svg-icons';
import { SLATE_500 } from '../../constants/tailwindColors';
import { getDirection } from '../../utils/linearAlgebraUtils';

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const resizingBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
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

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div className='relative'>
      <canvas
        ref={canvasRef}
        className='bg-slate-50 drop-shadow-lg'
        width={dimensions.width}
        height={dimensions.height}
      />
      <button
        ref={resizingBtnRef}
        type='button'
        className='absolute -right-[30px] -bottom-[30px] px-[5px] py-[2px] bg-slate-200 cursor-se-resize rounded-full'
        onMouseDown={handleMouseDown}
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
