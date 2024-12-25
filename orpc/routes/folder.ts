import { os } from '@orpc/server';
import { z } from 'zod';
import fs from 'fs-extra';

export const folderRouter = os.router({
  getRootFolder: os.func(() => {
    fs.ensureFileSync('rootFolder.txt');
    const rootFolder = fs.readFileSync('rootFolder.txt', 'utf8');
    return rootFolder;
  }),

  setRootFolder: os.input(z.string()).func((input) => {
    fs.writeFileSync('rootFolder.txt', input);
  }),
});
