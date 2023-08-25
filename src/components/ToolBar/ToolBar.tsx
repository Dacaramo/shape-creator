import { FC } from 'react';
import {
  faCirclePlus,
  faCircleMinus,
  faHandPointer,
  faUpDownLeftRight,
  faImage,
} from '@fortawesome/free-solid-svg-icons';
import { useBoundStore } from '../../zustand/store';
import ToolBarButton, { Appearance } from './ToolBarButton/ToolBarButton';
import { Tooltip } from 'react-tooltip';
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
    setSelectionInfo,
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
      state.setSelectionInfo,
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

    setSelectionInfo(-1, []);
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
        tooltipId='node-selection-button'
        tooltipText='Select nodes'
      />
      <ToolBarButton
        icon={faUpDownLeftRight}
        appearance={nodeMovementButtonAppearance}
        onClick={handleClickOnMoveSelectedNodes}
        tooltipId='node-movement-button'
        tooltipText='Move selected nodes'
      />
      <ToolBarButton
        icon={faCirclePlus}
        appearance={nodeCreationButtonAppearance}
        onClick={handleClickOnAddNode}
        tooltipId='node-creation-button'
        tooltipText='Add nodes'
      />
      <ToolBarButton
        icon={faCircleMinus}
        onClick={handleClickOnRemoveSelectedNodes}
        tooltipId='node-deletion-button'
        tooltipText='Delete selected nodes'
      />
      <ToolBarButton
        icon={faImage}
        onClick={handleClickOnReplaceImage}
        tooltipId='image-replacement-button'
        tooltipText='Replace image'
      />
    </menu>
  );
};

export default ToolBar;
