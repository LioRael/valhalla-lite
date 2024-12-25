'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as Input from '@/components/ui/input';
import { useNotification } from '@/hooks/use-notification';
import { useMutation } from '@tanstack/react-query';

export function TokenModal({ children }: { children: React.ReactNode }) {
  const { notification } = useNotification();
  const [open, setOpen] = React.useState(false);
  const [tokenInput, setTokenInput] = React.useState('');
  const { mutate: setToken } = useMutation({
    mutationFn: (token: string) => {
      return fetch('/api/token', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    onSuccess: () => {
      notification({
        title: '设置成功',
        description: 'token设置成功',
      });
      setOpen(false);
    },
  });

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>{children}</Modal.Trigger>
      <Modal.Content className='max-w-[440px]'>
        <Modal.Header
          title='设置 Token'
          description='设置 Token，用于验证你是不是坏黑'
        />
        <Modal.Body className='flex items-start gap-4'>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                placeholder='请输入 Token'
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
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
              if (tokenInput) {
                setToken(tokenInput);
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
