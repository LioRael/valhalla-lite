import * as Button from '@/components/ui/button';
import { useNotification } from '@/hooks/use-notification';
import { orpc } from '@/orpc/client';
import { RiUploadLine } from '@remixicon/react';
import { useRef, useState } from 'react';
import * as Modal from '@/components/ui/modal';

export function Upload({ slug }: { slug: string[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { notification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const utils = orpc.useUtils();
  const { mutate: upload } = orpc.files.upload.useMutation({
    onSuccess: () => {
      notification({
        title: '上传成功',
        description: '文件已成功上传',
      });
      utils.files.getFiles.invalidate();
    },
    onError: () => {
      notification({
        title: '上传失败',
        description: '文件上传失败',
      });
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      upload({
        targetPath: slug.join('/'),
        files: selectedFiles,
      });
    }
  };

  return (
    <>
      <input
        type='file'
        multiple
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Modal.Root open={isOpen} onOpenChange={setIsOpen}>
        <Modal.Content>
          <Modal.Header title='进度' description='请稍等，文件正在上传中' />
          <Modal.Body>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-primary h-2 w-2 rounded-full' />
                  <p className='text-sm font-medium'>文件上传中</p>
                </div>
                <p className='text-sm text-muted-foreground'>100%</p>
              </div>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <Button.Root onClick={handleClick}>
        <Button.Icon as={RiUploadLine} />
        上传文件
      </Button.Root>
    </>
  );
}
