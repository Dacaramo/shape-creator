import { CanvasSlice, createCanvasSlice } from './slices/canvasSlice';
import { ToolbarSlice, createToolbarSlice } from './slices/toolbarSlice';
import { create } from 'zustand';

/**
 * A type that joins all of the slices defined by the programmers
 */
export type StoreState = ToolbarSlice & CanvasSlice;

export const useStore = create<StoreState>((...args) => {
  return {
    ...createCanvasSlice(...args),
    ...createToolbarSlice(...args),
  };
});
