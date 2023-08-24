import { Point, Shape } from '../../model/Shape';
import { StateCreator } from 'zustand';
import { StoreState } from '../store';

export interface CanvasSlice {
  image: HTMLImageElement | null;
  shapes: Array<Shape>;
  selectionInfo: {
    polygonIndex: number;
    nodesIndexes: Array<number>;
  };
  replaceImage: (image: HTMLImageElement) => void;
  addShape: (shape: Shape) => void;
  replaceShape: (shape: Shape, index: number) => void;
  deleteShape: (index: number) => void;
  addNodeAfterGivenNode: (
    node: Point,
    afterNodeIndex: number,
    triggeredPolygonIndex: number
  ) => void;
  setSelectionInfo: (polygonIndex: number, nodesIndexes: Array<number>) => void;
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
    selectionInfo: {
      polygonIndex: -1,
      nodesIndexes: [],
    },
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
    addNodeAfterGivenNode: (
      node: Point,
      afterNodeIndex: number,
      triggeredPolygonIndex: number
    ) => {
      set((state) => {
        return {
          shapes: state.shapes.map((poly, i) => {
            if (i === triggeredPolygonIndex) {
              poly.splice(afterNodeIndex + 1, 0, node);
              return poly;
            }
            return poly;
          }),
        };
      });
    },
    setSelectionInfo: (polygonIndex: number, nodesIndexes: Array<number>) => {
      set(() => {
        return {
          selectionInfo: {
            polygonIndex,
            nodesIndexes,
          },
        };
      });
    },
  };
};
