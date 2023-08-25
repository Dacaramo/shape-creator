import { MutableRefObject, createContext } from 'react';

interface Props {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
}

const CanvasContext = createContext<Props | null>(null);

export default CanvasContext;
