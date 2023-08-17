import { Shape } from '../../model/Shape';
import { StateCreator } from 'zustand';
import { StoreState } from '../store';

export interface CanvasSlice {
  image: HTMLImageElement | null;
  shapes: Array<Shape>;
  replaceImage: (image: HTMLImageElement) => void;
  addShape: (shape: Shape) => void;
  replaceShape: (shape: Shape, index: number) => void;
  deleteShape: (index: number) => void;
}

export const createCanvasSlice: StateCreator<
  StoreState,
  [],
  [],
  CanvasSlice
> = (set) => {
  return {
    image: null,
    shapes: [],
    replaceImage: (image: HTMLImageElement) => {
      set(() => {
        return {
          image,
        };
      });
    },
    addShape: (shape: Shape) => {
      set((state) => {
        return {
          shapes: [...state.shapes, shape],
        };
      });
    },
    replaceShape: (shape: Shape, index: number) => {
      set((state) => {
        return {
          shapes: state.shapes.map((val, i) => {
            return i === index ? shape : val;
          }),
        };
      });
    },
    deleteShape: (index: number) => {
      set((state) => {
        return {
          shapes: state.shapes.filter((_, i) => i !== index),
        };
      });
    },
  };
};
