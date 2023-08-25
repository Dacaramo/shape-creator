import { FC, ReactNode, useRef } from 'react';
import CanvasContext from './CanvasContext';

interface Props {
  children: ReactNode;
}

const CanvasContextProvider: FC<Props> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <CanvasContext.Provider value={{ canvasRef }}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasContextProvider;
