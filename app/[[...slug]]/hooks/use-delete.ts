import { useNotification } from '@/hooks/use-notification';
import { orpc } from '@/orpc/client';
import path from 'path';

export function useDelete(
  selected: string[],
  slug: string,
  callback: () => void,
) {
  const { notification } = useNotification();
  const utils = orpc.useUtils();
  const { mutate } = orpc.files.delete.useMutation({
    onSuccess: () => {
      notification({
        title: '删除成功',
        description: '文件已成功删除',
      });
      utils.files.getFiles.invalidate();
      callback();
    },
    onError: () => {
      notification({
        title: '删除失败',
        description: '文件删除失败',
      });
    },
  });

  const deleteFiles = () => {
    mutate({
      filePath: selected.map((file) => path.join(slug, file)),
    });
  };

  return { deleteFiles };
}
