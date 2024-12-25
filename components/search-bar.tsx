'use client';

import * as Input from '@/components/ui/input';
import { useQueryState } from 'nuqs';

export default function SearchBar() {
  const [search, setSearch] = useQueryState('search', {
    defaultValue: '',
  });

  return (
    <Input.Root size='xsmall' className='max-w-xs'>
      <Input.Wrapper>
        <Input.Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='输入以搜索...'
        />
      </Input.Wrapper>
    </Input.Root>
  );
}
