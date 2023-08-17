import { CanvasSlice, createCanvasSlice } from './slices/canvasSlice';
import { create } from 'zustand';
import { ToolbarSlice, createToolbarSlice } from './slices/toolbarSlice';

/**
 * A type that joins all of the slices defined by the programmers
 */
export type StoreState = ToolbarSlice & CanvasSlice;

const useStore = create<StoreState>((...args) => {
  return {
    ...createCanvasSlice(...args),
    ...createToolbarSlice(...args),
  };
});
