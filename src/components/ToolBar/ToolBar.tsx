import { FC } from 'react';

interface Props {}

const ToolBar: FC<Props> = () => {
  return (
    <div className='w-[5%] h-full flex flex-col justify-start items-start bg-slate-800'>
      <button type='button'>Button 1</button>
      <button type='button'>Button 2</button>
      <button type='button'>Button 3</button>
      <button type='button'>Button 4</button>
      <button type='button'>Button 5</button>
    </div>
  );
};

export default ToolBar;
