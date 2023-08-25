import { Point, Shape } from '../../model/Shape';
import { StateCreator } from 'zustand';
import { StoreState } from '../store';
import { useRef, MutableRefObject } from 'react';

export interface CanvasSlice {
  image: HTMLImageElement | null;
  shapes: Array<Shape>;
  selectionInfo: {
    polygonIndex: number;
    nodesIndexes: Array<number>;
  };
  replaceImage: (image: HTMLImageElement) => void;
  setShapes: (shapes: Array<Shape>) => void;
  addShape: (shape: Shape) => void;
  replaceShape: (shape: Shape, index: number) => void;
  deleteShape: (index: number) => void;
  addNodeAfterGivenNode: (
    node: Point,
    afterNodeIndex: number,
    triggeredPolygonIndex: number
  ) => void;
  setSelectionInfo: (polygonIndex: number, nodesIndexes: Array<number>) => void;
  deleteNodes: (polygonIndex: number, nodesIndexes: Array<number>) => void;
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
    setShapes: (shapes: Array<Shape>) => {
      set(() => {
        return {
          shapes,
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
    deleteNodes: (polygonIndex: number, nodesIndexes: Array<number>) => {
      set((state) => {
        let newShapes = state.shapes.map((poly, i) => {
          if (i === polygonIndex) {
            return poly.filter((_, j) => !nodesIndexes.includes(j));
          }
          return poly;
        });

        /**
         * Can't have empty polygons. If all nodes are deleted the polygon must
         * be removed from the list
         */
        if (state.shapes[polygonIndex].length === nodesIndexes.length) {
          newShapes = newShapes.filter((_, i) => i !== polygonIndex);
        }

        return {
          shapes: newShapes,
        };
      });
    },
  };
};
