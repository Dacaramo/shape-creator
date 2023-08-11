import Canvas from './components/Canvas/Canvas';
import { FC } from 'react';
import ToolBar from './components/ToolBar/ToolBar';

interface Props {}

const App: FC<Props> = () => {
  return (
    <div className='w-full h-[100vh] flex flex-row justify-start items-center bg-slate-300'>
      <Canvas />
      <ToolBar />
    </div>
  );
};

export default App;
