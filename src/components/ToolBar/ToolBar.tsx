import { FC } from 'react';
import {
  faCirclePlus,
  faCircleMinus,
  faHandPointer,
  faUpDownLeftRight,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import ToolBarButton from './ToolBarButton/ToolBarButton';

interface Props {}

const ToolBar: FC<Props> = () => {
  const handleClickOnSelectNodes = (): void => {
    /**
     * TODO
     */
  };

  const handleClickOnMoveSelectedNodes = (): void => {
    /**
     * TODO
     */
  };

  const handleClickOnAddNode = (): void => {
    /**
     * TODO
     */
  };

  const handleClickOnRemoveSelectedNodes = (): void => {
    /**
     * TODO
     */
  };
  const handleClickOnReplaceImage = (): void => {
    /**
     * TODO
     */
  };

  return (
    <menu className='w-[5%] max-w-[75px] h-full flex flex-col justify-start items-center bg-slate-600'>
      <ToolBarButton
        icon={faHandPointer}
        onClick={handleClickOnSelectNodes}
      />
      <ToolBarButton
        icon={faUpDownLeftRight}
        onClick={handleClickOnMoveSelectedNodes}
      />
      <ToolBarButton
        icon={faCirclePlus}
        onClick={handleClickOnAddNode}
      />
      <ToolBarButton
        icon={faCircleMinus}
        onClick={handleClickOnRemoveSelectedNodes}
      />
      <ToolBarButton
        icon={faImage}
        onClick={handleClickOnReplaceImage}
      />
    </menu>
  );
};

export default ToolBar;
