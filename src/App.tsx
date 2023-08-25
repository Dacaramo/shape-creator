import Canvas from './components/Canvas/Canvas';
import { FC } from 'react';
import ToolBar from './components/ToolBar/ToolBar';
import CanvasContextProvider from './contexts/CanvasContext/CanvasContextProvider';

interface Props {}

const App: FC<Props> = () => {
  return (
    <CanvasContextProvider>
      <div className='w-full h-[100vh] flex flex-row justify-start items-center bg-red-300'>
        <div className='h-full flex grow justify-center items-center bg-slate-100'>
          <Canvas />
        </div>
        <ToolBar />
      </div>
    </CanvasContextProvider>
  );
};

export default App;
