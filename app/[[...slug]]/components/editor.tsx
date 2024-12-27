import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import * as Modal from '@/components/ui/modal';
import * as Button from '@/components/ui/button';
import { RiSaveLine } from '@remixicon/react';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { xml } from '@codemirror/lang-xml';
import { StreamLanguage } from '@codemirror/language';
import { properties } from '@codemirror/legacy-modes/mode/properties';
import { useTheme } from 'next-themes';

export const Editor = ({
  value,
  onChange,
  title,
  description,
  onSave,
  open,
  onOpenChange,
}: {
  value: string;
  onChange: (value: string) => void;
  title: string;
  description: string;
  onSave: (close: boolean) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { theme } = useTheme();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='fixed inset-8 flex size-[calc(100%-4rem)] h-[calc(100%-4rem)] max-w-full flex-col'>
        <Modal.Header title={title} description={description} />
        <Modal.Body className='flex-1 overflow-y-auto p-0'>
          <CodeMirror
            className='h-full bg-transparent'
            value={value}
            height='100%'
            theme={theme === 'dark' ? 'dark' : 'light'}
            onChange={onChange}
            extensions={[
              xml(),
              json(),
              yaml(),
              StreamLanguage.define(properties),
            ]}
          />
        </Modal.Body>
        <Modal.Footer className='mt-auto'>
          <Button.Root className='ml-auto' onClick={() => onSave(false)}>
            <Button.Icon as={RiSaveLine} />
            Save
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
