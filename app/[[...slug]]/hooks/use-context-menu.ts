import { useReducer } from 'react';

export function useContextMenu() {
  const [contextMenu, setContextMenu] = useReducer(
    (
      state: {
        selected: string[];
        position: { x: number; y: number };
        open: boolean;
      },
      action: {
        type: 'open' | 'close';
        selected: string[];
        position: { x: number; y: number };
      },
    ) => {
      if (action.type === 'open') {
        return {
          ...state,
          selected: action.selected,
          position: action.position,
          open: true,
        };
      }
      return { ...state, selected: [], position: { x: 0, y: 0 }, open: false };
    },
    { selected: [], position: { x: 0, y: 0 }, open: false },
  );

  return { contextMenu, setContextMenu };
}
