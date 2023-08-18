import { CanvasSlice, createCanvasSlice } from './slices/CanvasSlice';
import { ToolbarSlice, createToolbarSlice } from './slices/ToolbarSlice';
import { createWithEqualityFn } from 'zustand/traditional';

/**
 * A type that joins all of the slices defined by the programmers
 */
export type StoreState = ToolbarSlice & CanvasSlice;

export const useBoundStore = createWithEqualityFn<StoreState>((...args) => {
  return {
    ...createCanvasSlice(...args),
    ...createToolbarSlice(...args),
  };
}, Object.is);
