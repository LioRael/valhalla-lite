'use client';

import * as React from 'react';
import { RiFolderLine, RiMoonLine, RiSettings2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';
import dynamic from 'next/dynamic';
import { RootFolderModal } from './root-folder-modal';
import { TokenModal } from './token';

const DynamicThemeSwitch = dynamic(() => import('./theme-switch'), {
  ssr: false,
});

export function Settings() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button.Root size='xsmall' variant='neutral' mode='stroke'>
          <Button.Icon as={RiSettings2Line} />
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align='end'>
        <Dropdown.Item
          className='h-10'
          onSelect={(e) => {
            e.preventDefault();
          }}
        >
          <Dropdown.ItemIcon as={RiMoonLine} />
          主题
          <span className='flex-1' />
          <DynamicThemeSwitch />
        </Dropdown.Item>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <RootFolderModal>
            <Dropdown.Item
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Dropdown.ItemIcon as={RiFolderLine} />
              根目录
            </Dropdown.Item>
          </RootFolderModal>
          <TokenModal>
            <Dropdown.Item
              onSelect={(e) => {
                e.preventDefault();
              }}
            >
              <Dropdown.ItemIcon as={RiSettings2Line} />
              Token
            </Dropdown.Item>
          </TokenModal>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
