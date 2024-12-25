'use client';

import { useEffect, useRef, useState } from 'react';
import * as Dropdown from '@/components/ui/dropdown';
import {
  RiDeleteBinFill,
  RiFolderTransferFill,
  RiPencilFill,
} from '@remixicon/react';
import * as Modal from '@/components/ui/modal';
import * as Input from '@/components/ui/input';
import * as Button from '@/components/ui/button';
import { useMove } from '../hooks/use-move';
import { useDelete } from '../hooks/use-delete';

export function ContextMenu({
  selected,
  position,
  open,
  onClose,
  renameDispatch,
  slug,
}: {
  selected: string[];
  position: { x: number; y: number };
  open: boolean;
  onClose: () => void;
  renameDispatch: (action: {
    type: 'start' | 'finish' | 'quit';
    value?: string;
    slug: string;
  }) => void;
  slug: string;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Dropdown.Root open={open} onOpenChange={onClose}>
      <Dropdown.Content
        className='absolute left-0 top-0 w-40'
        style={{ left: position.x, top: position.y }}
      >
        <Dropdown.Group>
          {selected.length === 1 && (
            <Rename
              path={selected[0]}
              renameDispatch={renameDispatch}
              slug={slug}
            />
          )}
          <MoveTo selected={selected} slug={slug} />
          <Delete selected={selected} slug={slug} />
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

const Rename = ({
  path,
  renameDispatch,
  slug,
}: {
  path: string;
  renameDispatch: (action: {
    type: 'start' | 'finish' | 'quit';
    value?: string;
    slug: string;
  }) => void;
  slug: string;
}) => {
  return (
    <Dropdown.Item
      onClick={() => renameDispatch({ type: 'start', value: path, slug })}
    >
      <Dropdown.ItemIcon as={RiPencilFill} />
      重命名
    </Dropdown.Item>
  );
};

const MoveTo = ({ selected, slug }: { selected: string[]; slug: string }) => {
  const [value, setValue] = useState(slug);
  const [open, setOpen] = useState(false);

  const { move } = useMove(selected, slug);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Dropdown.ItemIcon as={RiFolderTransferFill} />
          移动到
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header
          title='移动到'
          description='将文件移动到指定目录，若目录不存在，则创建目录'
        />
        <Modal.Body>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                placeholder='请输入目录名称'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Input.Wrapper>
          </Input.Root>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root>取消</Button.Root>
          </Modal.Close>
          <Button.Root
            onClick={() => {
              move(value);
              setOpen(false);
            }}
          >
            确定
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

const Delete = ({ selected, slug }: { selected: string[]; slug: string }) => {
  const [open, setOpen] = useState(false);
  const { deleteFiles } = useDelete(selected, slug, () => setOpen(false));
  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Dropdown.Item onClick={deleteFiles}>
          <Dropdown.ItemIcon as={RiDeleteBinFill} />
          删除
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header title='删除' description='确定要删除吗？' />
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root>取消</Button.Root>
          </Modal.Close>
          <Button.Root onClick={deleteFiles}>确定</Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
