'use client';

import { orpc } from '@/orpc/client';
import { Folder } from './components/folder';
import { File } from './components/file';
import { BreadcrumbLite } from './components/breadcrumb';
import { useSelected } from './hooks/use-selected';
import { useContextMenu } from './hooks/use-context-menu';
import { ContextMenu } from './components/context-menu';
import { useRename } from './hooks/use-rename';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { Upload } from './components/upload';
import { Editor } from './components/editor';
import { useNotification } from '@/hooks/use-notification';

export default function Home({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const { notification } = useNotification();
  const { selected, dispatch } = useSelected();
  const { data: files } = orpc.files.getFiles.useQuery({
    path: slug.join('/'),
  });
  const [search] = useQueryState('search', {
    defaultValue: '',
  });
  const { rename, dispatch: renameDispatch } = useRename(
    dispatch,
    slug.join('/'),
  );

  const [openedFile, setOpenedFile] = useState<string | null>(null);

  const { data: fileContent } = orpc.files.read.useQuery({
    filePath: `${slug.join('/')}/${openedFile}`,
  });

  const [value, setValue] = useState<string>(fileContent || '');

  const { mutate: writeFile } = orpc.files.write.useMutation({
    onSuccess: () => {
      setOpenedFile(null);
      notification({
        title: '保存成功',
        description: '文件已保存',
      });
    },
  });

  useEffect(() => {
    if (openedFile) {
      setValue(fileContent || '');
    }
  }, [openedFile, fileContent]);

  const handleSave = () => {
    writeFile({
      filePath: `${slug.join('/')}/${openedFile}`,
      content: value,
    });
  };

  const { contextMenu, setContextMenu } = useContextMenu();

  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      // 可以在这里添加拖动结束后的清理逻辑
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const closeEditor = () => {
    setOpenedFile(null);
  };

  return (
    <div
      className='container mx-auto mt-8 flex h-full flex-1 flex-col gap-8'
      onMouseDown={(e) => {
        setSelectionBox({
          startX: e.clientX,
          startY: e.clientY,
          endX: e.clientX,
          endY: e.clientY,
        });
      }}
      onMouseMove={(e) => {
        if (selectionBox) {
          setSelectionBox({
            ...selectionBox,
            endX: e.clientX,
            endY: e.clientY,
          });
        }
      }}
      onMouseUp={() => setSelectionBox(null)}
    >
      {selectionBox && (
        <div
          style={{
            position: 'fixed',
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
            border: '1px solid #0066cc',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div className='flex items-center justify-between gap-2'>
        <BreadcrumbLite path={slug.join('/')} />
        <Upload slug={slug} />
      </div>
      <div className='grid w-full grid-cols-2 gap-4 md:grid-cols-10'>
        <Editor
          value={value}
          onChange={setValue}
          title={`编辑 ${slug.join('/')}/${openedFile}`}
          description='请编辑文件内容'
          onSave={handleSave}
          open={!!openedFile}
          onOpenChange={closeEditor}
        />
        <ContextMenu
          slug={slug.join('/')}
          renameDispatch={renameDispatch}
          selected={contextMenu.selected}
          position={contextMenu.position}
          open={contextMenu.open}
          onClose={() =>
            setContextMenu({
              type: 'close',
              selected: [],
              position: { x: 0, y: 0 },
            })
          }
        />
        {files
          ?.sort((a) => (a.isDirectory ? -1 : 1))
          .filter((file) => file.name.includes(search))
          .map((file) =>
            file.isDirectory ? (
              <Folder
                slug={slug.join('/')}
                rename={rename}
                renameDispatch={renameDispatch}
                setContextMenu={setContextMenu}
                selected={selected}
                dispatch={dispatch}
                key={file.name}
                path={file.name}
              >
                {file.name}
              </Folder>
            ) : (
              <File
                key={file.name}
                path={file.name}
                onOpen={() => setOpenedFile(file.name)}
              >
                {file.name}
              </File>
            ),
          )}
      </div>
    </div>
  );
}
