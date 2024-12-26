import * as FileFormatIcon from '@/components/ui/file-format-icon';
import * as Button from '@/components/ui/button';
import { cnExt } from '@/utils/cn';
import { useState, useEffect } from 'react';
import * as Tooltip from '@/components/ui/tooltip';
const colorMap: Record<
  string,
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'sky'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'gray'
> = {
  pdf: 'red',
  doc: 'orange',
  docx: 'orange',
  xls: 'yellow',
  xlsx: 'yellow',
  ppt: 'green',
  pptx: 'green',
  txt: 'sky',
  jpg: 'blue',
  jpeg: 'blue',
  png: 'blue',
  gif: 'purple',
  svg: 'purple',
  mp4: 'pink',
  mp3: 'pink',
  wav: 'pink',
  zip: 'gray',
  rar: 'gray',
  other: 'gray',
  json: 'yellow',
  yaml: 'green',
  xml: 'red',
  csv: 'yellow',
  tsv: 'yellow',
  md: 'gray',
};

export function File({
  path,
  children,
  onOpen,
  selected,
  dispatch,
  setContextMenu,
}: {
  path: string;
  children: React.ReactNode;
  onOpen: () => void;
  selected: string[];
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
  const [pendingContextMenu, setPendingContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const isSelected = selected.includes(path);

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

  const ext = path.split('.').pop();

  return (
    <div className='flex flex-col items-center justify-center gap-1'>
      <Button.Root
        className={cnExt(
          'h-[100px] w-[100px] hover:bg-transparent',
          isSelected && 'bg-bg-soft-200 hover:bg-bg-soft-200',
        )}
        mode='ghost'
        onDoubleClick={onOpen}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <Button.Icon
          className='h-full w-[50px]'
          as={FileFormatIcon.Root}
          format={ext}
          color={colorMap[ext || 'red']}
        />
      </Button.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <p
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            className={cnExt(
              'line-clamp-3 max-w-[100px] break-all rounded-md px-0.5',
              isSelected && 'cursor-default bg-primary-base text-static-white',
            )}
          >
            {children}
          </p>
        </Tooltip.Trigger>
        <Tooltip.Content>{children}</Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}
