import Canvas from './components/Canvas/Canvas';
import { FC } from 'react';
import ToolBar from './components/ToolBar/ToolBar';

interface Props {}

const App: FC<Props> = () => {
  return (
    <div className='w-full h-full flex flex-row justify-center items-center'>
      <Canvas />
      <ToolBar />
    </div>
  );
};

export default App;
