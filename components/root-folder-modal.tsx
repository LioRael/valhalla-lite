'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as Input from '@/components/ui/input';
import { orpc } from '@/orpc/client';
import { useNotification } from '@/hooks/use-notification';

export function RootFolderModal({ children }: { children: React.ReactNode }) {
  const { notification } = useNotification();
  const [open, setOpen] = React.useState(false);
  const { data: rootFolder, isLoading } = orpc.folder.getRootFolder.useQuery(
    {},
  );
  const [rootFolderInput, setRootFolderInput] = React.useState<string>();
  const { mutate: setRootFolder } = orpc.folder.setRootFolder.useMutation({
    onSuccess: () => {
      notification({
        title: '设置成功',
        description: '根目录设置成功',
      });
      setOpen(false);
    },
  });

  React.useEffect(() => {
    if (rootFolder) {
      setRootFolderInput(rootFolder);
    }
  }, [rootFolder]);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>{children}</Modal.Trigger>
      <Modal.Content className='max-w-[440px]'>
        <Modal.Header
          title='设置根目录'
          description='设置根目录，用于浏览文件'
        />
        <Modal.Body className='flex items-start gap-4'>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                placeholder='请输入根目录'
                disabled={isLoading}
                value={rootFolderInput}
                onChange={(e) => setRootFolderInput(e.target.value)}
              />
            </Input.Wrapper>
          </Input.Root>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              className='w-full'
            >
              取消
            </Button.Root>
          </Modal.Close>
          <Button.Root
            size='small'
            className='w-full'
            onClick={() => {
              if (rootFolderInput) {
                setRootFolder(rootFolderInput);
              }
            }}
          >
            设置
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
