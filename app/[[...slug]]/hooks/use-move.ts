import { useNotification } from '@/hooks/use-notification';
import { orpc } from '@/orpc/client';

export function useMove(selected: string[], slug: string) {
  const { notification } = useNotification();
  const utils = orpc.useUtils();
  const { mutate } = orpc.files.move.useMutation({
    onSuccess: () => {
      notification({
        title: '移动成功',
        description: '文件已成功移动到指定目录',
      });
      utils.files.getFiles.invalidate();
    },
    onError: () => {
      notification({
        title: '移动失败',
        description: '文件移动失败',
      });
    },
  });

  const move = (targetPath: string) => {
    mutate({
      sourcePath: slug,
      fileNames: selected,
      targetPath,
    });
  };

  return { move };
}
