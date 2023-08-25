import { ChangeEvent, FC, ChangeEvent as ReactChangeEvent } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TOOLBAR_ICON_SIZE } from '../../constants/sizes';
import { TOOLBAR_ICON_COLOR } from '../../constants/colors';
import { SLATE_100 } from '../../constants/tailwindColors';

interface Props {}

const ToolBar: FC<Props> = () => {
  const [
    isNodeSelectionAllowed,
    isNodeMovementAllowed,
    isNodeCreationAllowed,
    isNodeDeletionAllowed,
    selectionInfo,
    setIsNodeSelectionAllowed,
    setIsNodeMovementAllowed,
    setIsNodeCreationAllowed,
    setIsNodeDeletionAllowed,
    setSelectionInfo,
    deleteNodes,
    replaceImage,
  ] = useBoundStore((state) => {
    return [
      state.isNodeSelectionAllowed,
      state.isNodeMovementAllowed,
      state.isNodeCreationAllowed,
      state.isNodeDeletionAllowed,
      state.selectionInfo,
      state.setIsNodeSelectionAllowed,
      state.setIsNodeMovementAllowed,
      state.setIsNodeCreationAllowed,
      state.setIsNodeDeletionAllowed,
      state.setSelectionInfo,
      state.deleteNodes,
      state.replaceImage,
    ];
  }, shallow);

  const shapes = useBoundStore((state) => {
    return state.shapes;
  }, shallow);

  let nodeSelectionButtonAppearance: Appearance = 'unselected';
  let nodeMovementButtonAppearance: Appearance = 'unselected';
  let nodeCreationButtonAppearance: Appearance = 'unselected';
  let nodeDeletionButtonAppearance: Appearance = 'unselected';

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

  if (selectionInfo.nodesIndexes.length === 0) {
    nodeDeletionButtonAppearance = 'disabled';
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
    deleteNodes(selectionInfo.polygonIndex, selectionInfo.nodesIndexes);
    setSelectionInfo(-1, []);
  };

  const handleClickOnReplaceImage = (
    e: ReactChangeEvent<HTMLInputElement>
  ): void => {
    if (Array.from(e.target.files || []).length === 0) {
      return;
    }
    const file = Array.from(e.target.files || [])[0];
    const img = new Image();
    img.id = file.name;
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const originalHeight = img.height;
      if (originalHeight > 900) {
        img.height = 900;
        img.width = (img.width * img.height) / originalHeight;
      }
      replaceImage(img);
    };
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
        appearance={nodeDeletionButtonAppearance}
        onClick={handleClickOnRemoveSelectedNodes}
        tooltipId='node-deletion-button'
        tooltipText='Delete selected nodes'
      />
      <label
        htmlFor='image-input'
        className='mt-3 w-[50%] h-[35px] flex justify-center items-center cursor-pointer'
      >
        <FontAwesomeIcon
          icon={faImage}
          size={TOOLBAR_ICON_SIZE}
          color={SLATE_100}
        />
      </label>
      <input
        id='image-input'
        hidden
        className='absolute -z-10'
        type='file'
        accept='image/*'
        onChange={handleClickOnReplaceImage}
      />
    </menu>
  );
};

export default ToolBar;
