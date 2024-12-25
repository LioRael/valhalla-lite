import * as FileFormatIcon from '@/components/ui/file-format-icon';
import * as Button from '@/components/ui/button';
import { cnExt } from '@/utils/cn';
import { useState } from 'react';

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
}: {
  path: string;
  children: React.ReactNode;
  onOpen: () => void;
}) {
  const [isSelected, setIsSelected] = useState(false);

  const handleDoubleClick = () => {
    onOpen();
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
        onDoubleClick={handleDoubleClick}
        onClick={() => setIsSelected(!isSelected)}
      >
        <Button.Icon
          className='h-full w-[50px]'
          as={FileFormatIcon.Root}
          format={ext}
          color={colorMap[ext || 'red']}
        />
      </Button.Root>
      <p
        onClick={() => setIsSelected(!isSelected)}
        className={cnExt(
          'line-clamp-3 max-w-[100px] break-all rounded-md px-0.5',
          isSelected && 'cursor-default bg-primary-base text-static-white',
        )}
      >
        {children}
      </p>
    </div>
  );
}
