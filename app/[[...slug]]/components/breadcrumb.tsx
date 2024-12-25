import { RiArrowRightSLine, RiHomeSmile2Line } from '@remixicon/react';

import * as Breadcrumb from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Fragment } from 'react';

export function BreadcrumbLite({ path }: { path: string }) {
  return (
    <Breadcrumb.Root className='ml-16'>
      <Breadcrumb.Item asChild>
        <Link href='/'>
          <Breadcrumb.Icon as={RiHomeSmile2Line} />
        </Link>
      </Breadcrumb.Item>

      <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />

      {path.split('/').map((item, index) => (
        <Fragment key={item}>
          <Breadcrumb.Item
            asChild
            active={index === path.split('/').length - 1}
            key={item}
          >
            <Link
              href={`/${path
                .split('/')
                .slice(0, index + 1)
                .join('/')}`}
            >
              {decodeURIComponent(item)}
            </Link>
          </Breadcrumb.Item>
          {index !== path.split('/').length - 1 && (
            <Breadcrumb.ArrowIcon as={RiArrowRightSLine} />
          )}
        </Fragment>
      ))}
    </Breadcrumb.Root>
  );
}
