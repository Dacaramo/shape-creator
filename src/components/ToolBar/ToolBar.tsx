import { FC } from 'react';
import {
  faCirclePlus,
  faCircleMinus,
  faHandPointer,
  faUpDownLeftRight,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import ToolBarButton, { Appearance } from './ToolBarButton/ToolBarButton';
import { useBoundStore } from '../../zustand/store';
import { shallow } from 'zustand/shallow';

interface Props {}

const ToolBar: FC<Props> = () => {
  const [
    isNodeSelectionAllowed,
    isNodeMovementAllowed,
    isNodeCreationAllowed,
    isNodeDeletionAllowed,
    setIsNodeSelectionAllowed,
    setIsNodeMovementAllowed,
    setIsNodeCreationAllowed,
    setIsNodeDeletionAllowed,
  ] = useBoundStore((state) => {
    return [
      state.isNodeSelectionAllowed,
      state.isNodeMovementAllowed,
      state.isNodeCreationAllowed,
      state.isNodeDeletionAllowed,
      state.setIsNodeSelectionAllowed,
      state.setIsNodeMovementAllowed,
      state.setIsNodeCreationAllowed,
      state.setIsNodeDeletionAllowed,
    ];
  }, shallow);

  const shapes = useBoundStore((state) => {
    return state.shapes;
  }, shallow);

  let nodeSelectionButtonAppearance: Appearance = 'unselected';
  let nodeMovementButtonAppearance: Appearance = 'unselected';
  let nodeCreationButtonAppearance: Appearance = 'unselected';

  if (isNodeSelectionAllowed) {
    nodeSelectionButtonAppearance = 'selected';
  } else if (isNodeMovementAllowed) {
    nodeMovementButtonAppearance = 'selected';
  } else if (isNodeCreationAllowed) {
    nodeCreationButtonAppearance = 'selected';
  }

  if (shapes.length === 0) {
    nodeSelectionButtonAppearance = 'disabled';
    nodeMovementButtonAppearance = 'disabled';
  }

  const handleClickOnSelectNodes = (): void => {
    if (isNodeSelectionAllowed) {
      setIsNodeSelectionAllowed(false);
    } else {
      setIsNodeSelectionAllowed(true);
      /* Only one action is allowed at a time */
      setIsNodeMovementAllowed(false);
      setIsNodeCreationAllowed(false);
    }
  };

  const handleClickOnMoveSelectedNodes = (): void => {
    if (isNodeMovementAllowed) {
      setIsNodeMovementAllowed(false);
    } else {
      setIsNodeMovementAllowed(true);
      /* Only one action is allowed at a time */
      setIsNodeSelectionAllowed(false);
      setIsNodeCreationAllowed(false);
    }
  };

  const handleClickOnAddNode = (): void => {
    if (isNodeCreationAllowed) {
      setIsNodeCreationAllowed(false);
    } else {
      setIsNodeCreationAllowed(true);
      /* Only one action is allowed at a time */
      setIsNodeSelectionAllowed(false);
      setIsNodeMovementAllowed(false);
    }
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
        appearance={nodeSelectionButtonAppearance}
        onClick={handleClickOnSelectNodes}
      />
      <ToolBarButton
        icon={faUpDownLeftRight}
        appearance={nodeMovementButtonAppearance}
        onClick={handleClickOnMoveSelectedNodes}
      />
      <ToolBarButton
        icon={faCirclePlus}
        appearance={nodeCreationButtonAppearance}
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
