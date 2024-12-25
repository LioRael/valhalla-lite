import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import * as Modal from '@/components/ui/modal';
import * as Button from '@/components/ui/button';
import { RiSaveLine } from '@remixicon/react';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { StreamLanguage } from '@codemirror/language';
import { properties } from '@codemirror/legacy-modes/mode/properties';

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
  onSave: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='fixed inset-8 flex size-[calc(100%-4rem)] h-[calc(100%-4rem)] max-w-full flex-col'>
        <Modal.Header title={title} description={description} />
        <Modal.Body className='flex-1 overflow-y-auto p-0'>
          <CodeMirror
            className='h-full bg-transparent'
            value={value}
            height='100%'
            onChange={onChange}
            extensions={[json(), yaml(), StreamLanguage.define(properties)]}
          />
        </Modal.Body>
        <Modal.Footer className='mt-auto'>
          <Button.Root className='ml-auto' onClick={onSave}>
            <Button.Icon as={RiSaveLine} />
            Save
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};
