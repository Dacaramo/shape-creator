import { StateCreator } from 'zustand';
import { StoreState } from '../store';

export interface ToolbarSlice {
  isNodeSelectionAllowed: boolean;
  isNodeMovementAllowed: boolean;
  isNodeCreationAllowed: boolean;
  isNodeDeletionAllowed: boolean;
  setIsNodeSelectionAllowed: (isNodeSelectionAllowed: boolean) => void;
  setIsNodeMovementAllowed: (isNodeMovementAllowed: boolean) => void;
  setIsNodeCreationAllowed: (isNodeCreationAllowed: boolean) => void;
  setIsNodeDeletionAllowed: (isNodeDeletionAllowed: boolean) => void;
}

export const createToolbarSlice: StateCreator<
  StoreState,
  [],
  [],
  ToolbarSlice
> = (set) => {
  return {
    isNodeSelectionAllowed: false,
    isNodeMovementAllowed: false,
    isNodeCreationAllowed: false,
    isNodeDeletionAllowed: false,
    setIsNodeSelectionAllowed: (isNodeSelectionAllowed: boolean) => {
      set(() => {
        return {
          isNodeSelectionAllowed,
        };
      });
    },
    setIsNodeMovementAllowed: (isNodeMovementAllowed: boolean) => {
      set(() => {
        return {
          isNodeMovementAllowed,
        };
      });
    },
    setIsNodeCreationAllowed: (isNodeCreationAllowed: boolean) => {
      set(() => {
        return {
          isNodeCreationAllowed,
        };
      });
    },
    setIsNodeDeletionAllowed: (isNodeDeletionAllowed: boolean) => {
      set(() => {
        return {
          isNodeDeletionAllowed,
        };
      });
    },
  };
};
