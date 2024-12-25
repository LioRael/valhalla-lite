import { useNotification } from '@/hooks/use-notification';
import { orpc } from '@/orpc/client';
import { Dispatch, useEffect, useReducer } from 'react';

export function useRename(
  selectedDispatch: Dispatch<{
    type: 'add' | 'remove' | 'clear';
    value?: string;
  }>,
  slug: string,
) {
  const { notification } = useNotification();
  const utils = orpc.useUtils();
  const { mutate } = orpc.files.rename.useMutation({
    onSuccess: () => {
      notification({
        title: '重命名成功',
      });
      selectedDispatch({ type: 'clear' });
      selectedDispatch({ type: 'add', value: rename.path });
      utils.files.getFiles.invalidate();
    },
    onError: () => {
      notification({
        title: '重命名失败',
      });
    },
  });

  const [rename, dispatch] = useReducer(
    (
      state: {
        path: string;
        name: string;
        pendingRename: boolean;
      },
      action: { type: 'start' | 'finish' | 'quit'; value?: string },
    ): { path: string; name: string; pendingRename: boolean } => {
      switch (action.type) {
        case 'start':
          return {
            path: action.value!,
            name: '',
            pendingRename: false,
          };
        case 'finish':
          return {
            ...state,
            name: action.value!,
            pendingRename: true,
          };
        case 'quit':
          return {
            path: '',
            name: '',
            pendingRename: false,
          };
        default:
          return state;
      }
    },
    {
      path: '',
      name: '',
      pendingRename: false,
    },
  );

  // 使用 useEffect 处理重命名操作
  useEffect(() => {
    if (rename.pendingRename && rename.name) {
      mutate({
        path: `${slug}/${rename.path}`,
        name: rename.name,
      });
      // 重置 pendingRename 状态
      dispatch({ type: 'quit' });
    }
  }, [rename.pendingRename, rename.name, rename.path, mutate, slug]);

  return { rename, dispatch };
}
