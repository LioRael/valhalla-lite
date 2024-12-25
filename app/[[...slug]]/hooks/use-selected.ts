'use client';

import { useReducer } from 'react';

export function useSelected() {
  const [selected, dispatch] = useReducer(
    (
      state: string[],
      action: {
        type: 'add' | 'remove' | 'clear';
        value?: string;
      },
    ): string[] => {
      switch (action.type) {
        case 'add':
          return [...state, action.value!];
        case 'remove':
          return state.filter((item) => item !== action.value);
        case 'clear':
          return [];
        default:
          return state;
      }
    },
    [],
  );

  return { selected, dispatch };
}
