'use client';

import * as Button from '@/components/ui/button';
import { cnExt } from '@/utils/cn';
import { RiFolder3Fill } from '@remixicon/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export function Folder({
  children,
  path,
  selected,
  dispatch,
  setContextMenu,
  rename,
  renameDispatch,
}: {
  children: React.ReactNode;
  path: string;
  selected: string[];
  rename: { path: string; name: string };
  renameDispatch: (action: {
    type: 'start' | 'finish' | 'quit';
    value?: string;
  }) => void;
  dispatch: (action: {
    type: 'add' | 'remove' | 'clear';
    value?: string;
  }) => void;
  setContextMenu: (action: {
    type: 'open' | 'close';
    selected: string[];
    position: { x: number; y: number };
  }) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSelected = selected.includes(path);

  const [pendingContextMenu, setPendingContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const inputRef = useRef<HTMLParagraphElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (pendingContextMenu) {
      setContextMenu({
        type: 'open',
        selected,
        position: pendingContextMenu,
      });
      setPendingContextMenu(null);
    }
  }, [pendingContextMenu, selected, setContextMenu]);

  const handleDoubleClick = () => {
    router.push(
      `${pathname === '/' ? '' : pathname}/${path}?${searchParams.toString()}`,
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    if (selected.length > 0 && !e.shiftKey) {
      dispatch({ type: 'clear' });
      dispatch({ type: 'add', value: path });
      return;
    }

    dispatch({ type: isSelected ? 'remove' : 'add', value: path });
  };
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      selected.length === 0 ||
      (selected.length !== 0 && !selected.includes(path))
    ) {
      dispatch({ type: 'clear' });
      dispatch({ type: 'add', value: path });
    }

    setPendingContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      if (!e.ctrlKey && !e.metaKey) {
        dispatch({ type: 'clear' });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside && !selected.includes(path)) {
        dispatch({ type: 'add', value: path });
      }
    }
  };

  useEffect(() => {
    if (rename.path === path) {
      const element = inputRef.current;
      if (element) {
        element.focus();
        // 创建一个范围选择整个文本内容
        const range = document.createRange();
        range.selectNodeContents(element);
        // 获取当前选区
        const selection = window.getSelection();
        if (selection) {
          // 清除现有选区并应用新的选区
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  }, [rename.path, path]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className='relative'
    >
      <div
        className={cnExt(
          'absolute inset-0',
          isDragging && 'pointer-events-none',
        )}
      />
      <div className='flex flex-col items-center justify-center gap-1'>
        <Button.Root
          className={cnExt(
            'size-[100px] hover:bg-transparent',
            isSelected && 'bg-bg-soft-200 hover:bg-bg-soft-200',
          )}
          mode='ghost'
          onDoubleClick={handleDoubleClick}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          <Button.Icon className='size-full' as={RiFolder3Fill} />
        </Button.Root>
        <p
          className={cnExt(
            'line-clamp-3 max-w-[100px] break-all rounded-md px-0.5 focus:outline-none',
            isSelected && 'cursor-default bg-primary-base text-static-white',
            rename.path === path && 'bg-bg-soft-200 text-primary-base',
          )}
          contentEditable={rename.path === path}
          ref={inputRef}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const newName = e.currentTarget.textContent;
              renameDispatch({ type: 'finish', value: newName || '' });
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              renameDispatch({ type: 'quit' });
            }
          }}
          suppressContentEditableWarning={true}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
